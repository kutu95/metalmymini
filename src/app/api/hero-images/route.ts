import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveHeroImage } from "@/lib/storage";
import { heroImageSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const adminView = request.nextUrl.searchParams.get("admin") === "1";

  if (adminView) {
    try {
      await requireAdmin();
      const images = await prisma.heroImage.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return NextResponse.json({ images });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const images = await prisma.heroImage.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const files = formData.getAll("images").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    const altText = String(formData.get("altText") ?? "").trim() || undefined;
    const published = formData.get("published") !== "false";

    const maxSort = await prisma.heroImage.aggregate({ _max: { sortOrder: true } });
    let nextSort = (maxSort._max.sortOrder ?? -1) + 1;

    const created = [];
    for (const file of files) {
      const saved = await saveHeroImage(file);
      const parsed = heroImageSchema.safeParse({ altText, published, sortOrder: nextSort });
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
      }

      const image = await prisma.heroImage.create({
        data: {
          imagePath: saved.storedFilename,
          altText: parsed.data.altText,
          published: parsed.data.published,
          sortOrder: parsed.data.sortOrder,
        },
      });
      created.push(image);
      nextSort += 1;
    }

    return NextResponse.json({ images: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload hero images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const image = await prisma.heroImage.update({
      where: { id: body.id },
      data: {
        altText: body.altText,
        published: body.published,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ image });
  } catch {
    return NextResponse.json({ error: "Unable to update hero image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    await prisma.heroImage.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete hero image" }, { status: 500 });
  }
}
