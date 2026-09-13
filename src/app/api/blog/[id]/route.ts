import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { resolveBlogPublishedAt } from "@/lib/blog";
import { sanitizeBlogHtml, slugify } from "@/lib/blog-html";
import { blogPostUpdateSchema, parseBlogPublishedAt } from "@/lib/validators";

async function uniqueSlug(desired: string, excludeId: string) {
  const base = slugify(desired);
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id: excludeId } },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${base.slice(0, 70)}-${n}`;
    n += 1;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const parsed = blogPostUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const status = parsed.data.status ?? existing.status;
    const shouldUpdatePublishedAt =
      parsed.data.publishedAt !== undefined || parsed.data.status !== undefined;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
        ...(parsed.data.slug !== undefined ? { slug: await uniqueSlug(parsed.data.slug, id) } : {}),
        ...(parsed.data.excerpt !== undefined ? { excerpt: parsed.data.excerpt } : {}),
        ...(parsed.data.content !== undefined ? { content: sanitizeBlogHtml(parsed.data.content) } : {}),
        ...(parsed.data.coverImagePath !== undefined ? { coverImagePath: parsed.data.coverImagePath } : {}),
        ...(parsed.data.status !== undefined ? { status } : {}),
        ...(shouldUpdatePublishedAt
          ? {
              publishedAt: resolveBlogPublishedAt({
                status,
                requested: parseBlogPublishedAt(parsed.data.publishedAt),
                existing: existing.publishedAt,
              }),
            }
          : {}),
        ...(parsed.data.seoTitle !== undefined ? { seoTitle: parsed.data.seoTitle || null } : {}),
        ...(parsed.data.seoDescription !== undefined
          ? { seoDescription: parsed.data.seoDescription || null }
          : {}),
      },
    });

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Unable to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete post" }, { status: 500 });
  }
}
