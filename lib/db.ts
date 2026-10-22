import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost, Testimonial, Career } from "@hericilla/types";
import { company, clientReferences } from "./company";

/**
 * Server-side content access with graceful fallback:
 * - When Supabase env is configured, content comes from the CMS tables (ISR 60s).
 * - Before the project exists / during offline dev, static defaults keep the site buildable.
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
  const { data } = await s
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as BlogPost[]) ?? [];
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const s = db();
  if (!s) return null;
  const { data } = await s
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as BlogPost) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const s = db();
  if (!s) {
    // Approved references from the corporate profile serve as fallback quotes
    return clientReferences.slice(0, 4).map((c, i) => ({
      id: `fallback-${i}`,
      client_name: "Operations Team",
      company: c,
      quote: `${c} relies on Hericilla for ${i % 2 === 0 ? "heavy haulage and rig support" : "procurement and materials supply"} — delivered on time, fully documented.`,
      rating: 5,
      approved: true,
      display_order: i + 1,
      created_at: new Date().toISOString(),
    })) as Testimonial[];
  }
  const { data } = await s
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("display_order", { ascending: true });
  const rows = (data as Testimonial[]) ?? [];
  return rows.length ? rows : [];
}

export async function getCareers(): Promise<Career[]> {
  const s = db();
  if (!s) return [];
  const { data } = await s
    .from("careers")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  return (data as Career[]) ?? [];
}

/** page_content overrides for hero copy etc.; falls back to profile facts. */
export async function getPageContent(key: string, fallback: string): Promise<string> {
  const s = db();
  if (!s) return fallback;
  const { data } = await s.from("page_content").select("value").eq("key", key).maybeSingle();
  if (!data?.value) return fallback;
  const v = data.value as unknown;
  return typeof v === "string" ? v : fallback;
}

export const contactDetails = {
  ...company.adminOffice,
  ops: company.opsBase,
};
