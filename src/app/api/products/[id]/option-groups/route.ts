import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { optionGroupSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await getProductById(id, { admin: true });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({
      optionGroups: product.optionGroups,
      incompatibilities: product.incompatibilities,
    });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const parsed = optionGroupSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const group = await prisma.productOptionGroup.create({
      data: {
        productId: id,
        name: parsed.data.name,
        description: parsed.data.description ?? "",
        required: parsed.data.required ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
        active: parsed.data.active ?? true,
      },
    });

    const catalog = await getProductById(id, { admin: true });
    return NextResponse.json({ group, product: catalog });
  } catch {
    return NextResponse.json({ error: "Unable to create option group" }, { status: 500 });
  }
}
