import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader, Card, EmptyState } from "@hericilla/ui";
import { getPosts } from "@/lib/db";
import { Newspaper, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Articles, company news and project updates from Hericilla Support Services — logistics, safety and supply chain in the Nigerian oil & gas industry.",
};

export const revalidate = 60;

const categoryLabels: Record<string, string> = {
  blog: "Article",
  news: "News",
  project_update: "Project update",
};

export default async function BlogPage() {
  const posts = await getPosts(24);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <PageHeader
        title="Blog & news"
        purpose="What we are learning and doing — written plainly, so you can use it even if you never hire us."
      />

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Nothing published yet"
            teach="Our first articles are on the way. Meanwhile, the contact form is the fastest way to reach a human."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group">
              <Card className="flex h-full flex-col overflow-hidden !p-0 transition group-hover:shadow-[var(--shadow-pop)]">
                {p.cover_image ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={p.cover_image} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                  </div>
                ) : (
                  <div className="flex h-24 items-center justify-center bg-brand-50">
                    <Newspaper className="h-10 w-10 text-brand-300" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-500">
                    {categoryLabels[p.category] ?? "Article"}
                    {p.published_at && (
                      <span className="ml-2 font-normal normal-case text-ink-soft">
                        {new Date(p.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-brand-900">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 flex-1 text-lg text-ink-soft">{p.excerpt}</p>}
                  <p className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-700">
                    Read more <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
