import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPosts, getPost, supabaseConfigured } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  if (!supabaseConfigured) return [];
  const posts = await getPosts(50);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline">
        <ArrowLeft className="h-5 w-5" /> Back to blog &amp; news
      </Link>

      <h1 className="mt-4 text-4xl font-extrabold leading-tight text-brand-950">{post.title}</h1>
      {post.published_at && (
        <p className="mt-2 text-base text-ink-soft">Published {new Date(post.published_at).toLocaleDateString()}</p>
      )}

      {post.cover_image && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)]">
          <Image src={post.cover_image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      <div className="prose-website mt-8 text-lg leading-relaxed text-ink">
        <ReactMarkdown
          components={{
            h1: (p) => <h2 className="mt-8 text-2xl font-bold text-brand-900" {...p} />,
            h2: (p) => <h2 className="mt-8 text-2xl font-bold text-brand-900" {...p} />,
            h3: (p) => <h3 className="mt-6 text-xl font-bold text-brand-900" {...p} />,
            p: (p) => <p className="mt-4" {...p} />,
            ul: (p) => <ul className="mt-4 list-disc space-y-2 pl-8" {...p} />,
            ol: (p) => <ol className="mt-4 list-decimal space-y-2 pl-8" {...p} />,
            blockquote: (p) => (
              <blockquote className="mt-4 border-l-4 border-brand-300 bg-brand-50 p-4 text-brand-900" {...p} />
            ),
            a: ({ href, ...p }) => (
              <a href={href} className="font-semibold text-brand-700 underline" target="_blank" rel="noopener" {...p} />
            ),
            img: (p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mt-4 rounded-[var(--radius-card)]" alt={p.alt ?? ""} src={String(p.src ?? "")} />
            ),
          }}
        >
          {post.content_md}
        </ReactMarkdown>
      </div>

      <div className="mt-12 rounded-[var(--radius-card)] bg-brand-950 p-8 text-center text-white">
        <p className="text-xl font-bold">Need this kind of work done?</p>
        <p className="mt-1 text-brand-100">Tell us what you are moving, buying or storing — we reply within 24 hours.</p>
        <Link
          href="/quote"
          className="mt-4 inline-flex rounded-[var(--radius-btn)] bg-accent-500 px-8 py-4 text-xl font-bold text-white hover:bg-accent-600"
        >
          Request a quote
        </Link>
      </div>
    </article>
  );
}
