import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { orderedIncompatibilityPair } from "@/lib/product-option-rules";
import { incompatibilitySchema } from "@/lib/validators";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const parsed = incompatibilitySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    if (parsed.data.optionAId === parsed.data.optionBId) {
      return NextResponse.json({ error: "Choose two different options" }, { status: 400 });
    }

    const options = await prisma.productOption.findMany({
      where: { id: { in: [parsed.data.optionAId, parsed.data.optionBId] } },
      include: { group: true },
    });
    if (options.length !== 2 || options.some((option) => option.group.productId !== id)) {
      return NextResponse.json({ error: "Both options must belong to this product" }, { status: 400 });
    }
    if (options[0].groupId === options[1].groupId) {
      return NextResponse.json(
        { error: "Incompatibilities are between options from different groups" },
        { status: 400 },
      );
    }

    const pair = orderedIncompatibilityPair(parsed.data.optionAId, parsed.data.optionBId);
    await prisma.productOptionIncompatibility.upsert({
      where: {
        optionAId_optionBId: pair,
      },
      create: pair,
      update: {},
    });

    return NextResponse.json({ product: await getProductById(id, { admin: true }) });
  } catch {
    return NextResponse.json({ error: "Unable to save incompatibility" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const incompatibilityId = request.nextUrl.searchParams.get("incompatibilityId");
    if (!incompatibilityId) {
      return NextResponse.json({ error: "incompatibilityId required" }, { status: 400 });
    }

    const product = await getProductById(id, { admin: true });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const exists = product.incompatibilities.some((row) => row.id === incompatibilityId);
    if (!exists) {
      return NextResponse.json({ error: "Incompatibility not found" }, { status: 404 });
    }

    await prisma.productOptionIncompatibility.delete({ where: { id: incompatibilityId } });
    return NextResponse.json({ product: await getProductById(id, { admin: true }) });
  } catch {
    return NextResponse.json({ error: "Unable to delete incompatibility" }, { status: 500 });
  }
}
