import Link from "next/link";
import { Card, PageHeading } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { BLOG_PAGE_SIZE, blogCoverUrl, getBlogIndexJsonLd, listPublishedPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Journal",
  description:
    "Notes on copper plating, miniature finishing, and how Metal My Mini makes custom metal minis in Melbourne.",
  path: "/blog",
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, pageCount } = await listPublishedPosts(page);

  return (
    <div>
      <JsonLd data={getBlogIndexJsonLd(posts)} />
      <PageHeading
        title="Journal"
        subtitle="Process notes, finish experiments, and the work behind copper-plated miniatures."
      />

      {posts.length === 0 ? (
        <Card>
          <p className="text-stone-400">New writing will show up here as I publish it.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const cover = blogCoverUrl(post);
            return (
              <Card key={post.id} className="overflow-hidden p-0">
                <Link href={`/blog/${post.slug}`} className="grid gap-0 md:grid-cols-[16rem_1fr]">
                  {cover ? (
                    <img src={cover} alt="" className="h-48 w-full object-cover md:h-full" />
                  ) : (
                    <div className="hidden bg-stone-950 md:block" />
                  )}
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-wide text-copper-light">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </p>
                    <h2 className="mt-2 text-xl font-medium text-stone-100">{post.title}</h2>
                    {post.excerpt ? (
                      <p className="mt-2 text-sm leading-relaxed text-stone-400">{post.excerpt}</p>
                    ) : null}
                    <span className="mt-4 inline-block text-sm text-copper-light">Read</span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      {pageCount > 1 ? (
        <nav className="mt-8 flex items-center justify-between text-sm" aria-label="Blog pages">
          {page > 1 ? (
            <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`} className="text-copper-light hover:underline">
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-stone-500">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={`/blog?page=${page + 1}`} className="text-copper-light hover:underline">
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
      <p className="sr-only">Showing up to {BLOG_PAGE_SIZE} posts per page.</p>
    </div>
  );
}
