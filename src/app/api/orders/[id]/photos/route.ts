import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveGalleryImage } from "@/lib/storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await request.formData();
    const image = formData.get("image");
    const publish = formData.get("published") === "true";

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const saved = await saveGalleryImage(image);
    const item = await prisma.galleryItem.create({
      data: {
        title: `${order.orderNumber} — Finished Mini`,
        description: `Completed ${order.productOption.replace("_", " ")} miniature`,
        finishType: order.productOption,
        imagePath: saved.storedFilename,
        relatedOrderId: order.id,
        published: publish,
      },
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
