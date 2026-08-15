import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/products";
import { audToCents } from "@/lib/site-settings";
import { productSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const adminView = request.nextUrl.searchParams.get("admin") === "1";

  if (adminView) {
    try {
      await requireAdmin();
      const products = await listProducts({ admin: true });
      return NextResponse.json({ products });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const products = await listProducts({ activeOnly: true });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    if (parsed.data.galleryItemId) {
      const galleryItem = await prisma.galleryItem.findUnique({
        where: { id: parsed.data.galleryItemId },
      });
      if (!galleryItem) {
        return NextResponse.json({ error: "Gallery image not found" }, { status: 400 });
      }
    }

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? "",
        priceCents: audToCents(parsed.data.priceAud),
        active: parsed.data.active ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
        galleryItemId: parsed.data.galleryItemId || null,
      },
      include: { galleryItem: true },
    });

    const products = await listProducts({ admin: true });
    return NextResponse.json({
      product: products.find((p) => p.id === product.id),
      products,
    });
  } catch {
    return NextResponse.json({ error: "Unable to create product" }, { status: 500 });
  }
}
