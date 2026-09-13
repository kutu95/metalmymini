import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { blogCoverUrl, getBlogPostingJsonLd, getPublishedPostBySlug } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return { title: "Not found" };
  }
  const cover = blogCoverUrl(post);
  return createPageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    type: "article",
    image: cover ?? undefined,
    publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const cover = blogCoverUrl(post);

  return (
    <article>
      <JsonLd data={getBlogPostingJsonLd(post)} />
      <Link href="/blog" className="text-sm text-copper-light hover:underline">
        ← Journal
      </Link>
      <header className="mt-6 mb-8">
        <p className="text-xs uppercase tracking-wide text-copper-light">
          {formatDate(post.publishedAt ?? post.createdAt)} · {post.authorName}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-stone-100 md:text-4xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 max-w-2xl text-lg text-stone-400">{post.excerpt}</p> : null}
      </header>
      {cover ? (
        <img src={cover} alt="" className="mb-10 w-full rounded-xl object-cover" />
      ) : null}
      <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
