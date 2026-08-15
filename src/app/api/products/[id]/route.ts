import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById, listProducts } from "@/lib/products";
import { audToCents } from "@/lib/site-settings";
import { productUpdateSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product || !product.active) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (parsed.data.galleryItemId) {
      const galleryItem = await prisma.galleryItem.findUnique({
        where: { id: parsed.data.galleryItemId },
      });
      if (!galleryItem) {
        return NextResponse.json({ error: "Gallery image not found" }, { status: 400 });
      }
    }

    const data: {
      name?: string;
      description?: string;
      priceCents?: number;
      active?: boolean;
      sortOrder?: number;
      galleryItemId?: string | null;
    } = {};

    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.description !== undefined) data.description = parsed.data.description;
    if (parsed.data.priceAud !== undefined) data.priceCents = audToCents(parsed.data.priceAud);
    if (parsed.data.active !== undefined) data.active = parsed.data.active;
    if (parsed.data.sortOrder !== undefined) data.sortOrder = parsed.data.sortOrder;
    if (parsed.data.galleryItemId !== undefined) {
      data.galleryItemId = parsed.data.galleryItemId || null;
    }

    await prisma.product.update({ where: { id }, data });
    const products = await listProducts({ admin: true });
    return NextResponse.json({
      product: products.find((p) => p.id === id),
      products,
    });
  } catch {
    return NextResponse.json({ error: "Unable to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Soft-delete by deactivating so order history stays intact.
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    const products = await listProducts({ admin: true });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Unable to deactivate product" }, { status: 500 });
  }
}
