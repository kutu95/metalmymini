import { prisma } from "@/lib/db";
import { FOUNDER } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { blogImageUrl } from "@/lib/blog-html";
import type { BlogPost } from "@/generated/prisma/client";

export const BLOG_PAGE_SIZE = 12;

export function blogCoverUrl(post: Pick<BlogPost, "coverImagePath">) {
  return post.coverImagePath ? blogImageUrl(post.coverImagePath) : null;
}

export async function listPublishedPosts(page = 1) {
  const safePage = Math.max(1, page);
  const where = { status: "published" as const };
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (safePage - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
  };
}

export async function listAllPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      title: true,
      slug: true,
      excerpt: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
}

export async function listAdminPosts() {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export function resolveBlogPublishedAt({
  status,
  requested,
  existing = null,
}: {
  status: "draft" | "published";
  requested?: Date | null;
  existing?: Date | null;
}): Date | null {
  if (status === "published") {
    if (requested) {
      if (existing && requested.toISOString().slice(0, 10) === existing.toISOString().slice(0, 10)) {
        return existing;
      }
      return requested;
    }
    return existing ?? new Date();
  }

  if (requested !== undefined) {
    if (requested && existing && requested.toISOString().slice(0, 10) === existing.toISOString().slice(0, 10)) {
      return existing;
    }
    return requested;
  }

  return existing;
}

export function getBlogPostingJsonLd(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = blogCoverUrl(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt || post.title,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || FOUNDER.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Metal My Mini",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    url,
    ...(image ? { image: image.startsWith("http") ? image : `${SITE_URL}${image}` } : {}),
  };
}

export function getBlogIndexJsonLd(posts: Array<Pick<BlogPost, "title" | "slug" | "excerpt">>) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Metal My Mini journal",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Metal My Mini",
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      description: post.excerpt || post.title,
    })),
  };
}
