import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeading } from "@/components/ui";
import { AdminBlogEditor } from "@/components/AdminBlogEditor";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-copper-light hover:underline">
        ← Back to posts
      </Link>
      <PageHeading title="Edit post" subtitle={post.status === "published" ? "Published" : "Draft"} />
      <AdminBlogEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImagePath: post.coverImagePath,
          status: post.status,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }}
      />
    </div>
  );
}
