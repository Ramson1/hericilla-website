import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost, Testimonial, Career } from "@hericilla/types";
import { CONTENT_KEYS, type ContentKey } from "@hericilla/types";
import { company } from "./company";
import type { ContactInfo } from "./types";

/**
 * Server-side content access with graceful fallback:
 * - When Supabase env is configured, content comes from the CMS tables (ISR 60s).
 * - Before the project exists / during offline dev, static defaults keep the site buildable.
 * - Page text and contact details fall back to the CONTENT_KEYS registry so the site
 *   renders real wording without ever inventing client praise.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
function db(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!client) client = createClient(url, anon, { auth: { persistSession: false } });
  return client;
}

export const supabaseConfigured = Boolean(url && anon);
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function getPosts(limit = 12): Promise<BlogPost[]> {
  const s = db();
  if (!s) return [];
  // Match the blog_public_read policy: published AND (timestamp is null OR already due).
  const now = new Date().toISOString();
  const { data } = await s
    .from("hericilla_blog_posts")
    .select("*")
    .eq("status", "published")
    .or(`published_at.is.null,published_at.lte.${now}`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as BlogPost[]) ?? [];
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const s = db();
  if (!s) return null;
  const { data } = await s
    .from("hericilla_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as BlogPost) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const s = db();
  if (!s) return [];
  const { data } = await s
    .from("hericilla_testimonials")
    .select("*")
    .eq("approved", true)
    .order("display_order", { ascending: true });
  return ((data as Testimonial[]) ?? []);
}

export async function getCareers(): Promise<Career[]> {
  const s = db();
  if (!s) return [];
  const { data } = await s
    .from("hericilla_careers")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  return (data as Career[]) ?? [];
}

/**
 * Fetch many CMS page-text keys in a single query, overlaid on the registry defaults.
 * Cached per request so a page that needs five keys issues one round trip, not five.
 */
export const getPageContentMap = cache(async (keys: ContentKey[]): Promise<Record<ContentKey, string>> => {
  const out = {} as Record<ContentKey, string>;
  for (const k of keys) out[k] = CONTENT_KEYS[k].default;
  const s = db();
  if (!s || keys.length === 0) return out;
  const { data } = await s.from("hericilla_page_content").select("key, value").in("key", keys);
  for (const row of (data as { key: string; value: unknown }[]) ?? []) {
    if (typeof row.value === "string" && row.value.trim().length > 0) {
      out[row.key as ContentKey] = row.value;
    }
  }
  return out;
});

/** Single page-text override, falling back to the registry default (or an explicit one). */
export async function getPageContent(key: ContentKey, fallback?: string): Promise<string> {
  const map = await getPageContentMap([key]);
  return map[key] ?? fallback ?? CONTENT_KEYS[key].default;
}

// Stable reference so React.cache dedupes the contact query across layout + page in one request.
const CONTACT_KEYS: ContentKey[] = [
  "contact.admin_address",
  "contact.ops_address",
  "contact.email",
  "contact.phone1",
  "contact.phone2",
];

/**
 * Contact details sourced from the CMS, overlaid on the guaranteed company.ts facts.
 * Shaped exactly like `company.adminOffice` / `company.opsBase` so call sites drop in.
 */
export const getContact = cache(async (): Promise<ContactInfo> => {
  const map = await getPageContentMap(CONTACT_KEYS);
  return {
    adminOffice: {
      label: company.adminOffice.label,
      address: map["contact.admin_address"],
      phone: map["contact.phone1"],
      email: map["contact.email"],
    },
    opsBase: {
      label: company.opsBase.label,
      address: map["contact.ops_address"],
      phone: map["contact.phone2"],
    },
  };
});
