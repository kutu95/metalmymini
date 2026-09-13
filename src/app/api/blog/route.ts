import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { listAdminPosts, listPublishedPosts, resolveBlogPublishedAt } from "@/lib/blog";
import { sanitizeBlogHtml, slugify } from "@/lib/blog-html";
import { blogPostSchema, parseBlogPublishedAt } from "@/lib/validators";

async function uniqueSlug(desired: string, excludeId?: string) {
  const base = slugify(desired);
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${base.slice(0, 70)}-${n}`;
    n += 1;
  }
}

export async function GET(request: NextRequest) {
  const adminView = request.nextUrl.searchParams.get("admin") === "1";
  if (adminView) {
    try {
      await requireAdmin();
      const posts = await listAdminPosts();
      return NextResponse.json({ posts });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const result = await listPublishedPosts(Number.isFinite(page) ? page : 1);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const status = parsed.data.status ?? "draft";
    const post = await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: await uniqueSlug(parsed.data.slug || parsed.data.title),
        excerpt: parsed.data.excerpt ?? "",
        content: sanitizeBlogHtml(parsed.data.content ?? ""),
        coverImagePath: parsed.data.coverImagePath ?? null,
        status,
        publishedAt: resolveBlogPublishedAt({
          status,
          requested: parseBlogPublishedAt(parsed.data.publishedAt),
        }),
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
      },
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Unable to create post" }, { status: 500 });
  }
}
