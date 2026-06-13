import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { saveGalleryImage } from "@/lib/storage";
import { galleryItemSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const adminView = request.nextUrl.searchParams.get("admin") === "1";
  if (adminView) {
    try {
      await requireAdmin();
      const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
      return NextResponse.json({ items });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const items = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const parsed = galleryItemSchema.safeParse({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      finishType: String(formData.get("finishType") ?? ""),
      published: formData.get("published") === "true",
      relatedOrderId: String(formData.get("relatedOrderId") ?? "") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const saved = await saveGalleryImage(image);
    const item = await prisma.galleryItem.create({
      data: {
        ...parsed.data,
        imagePath: saved.storedFilename,
      },
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const item = await prisma.galleryItem.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        finishType: body.finishType,
        published: body.published,
      },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Unable to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await prisma.galleryItem.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete gallery item" }, { status: 500 });
  }
}
