import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { audToCents } from "@/lib/site-settings";
import { productOptionUpdateSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const option = await prisma.productOption.findUnique({
      where: { id },
      include: { group: true },
    });
    if (!option) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    const parsed = productOptionUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    await prisma.productOption.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.priceDeltaAud !== undefined
          ? { priceDeltaCents: audToCents(parsed.data.priceDeltaAud) }
          : {}),
        ...(parsed.data.sortOrder !== undefined ? { sortOrder: parsed.data.sortOrder } : {}),
        ...(parsed.data.active !== undefined ? { active: parsed.data.active } : {}),
      },
    });

    return NextResponse.json({
      product: await getProductById(option.group.productId, { admin: true }),
    });
  } catch {
    return NextResponse.json({ error: "Unable to update option" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const option = await prisma.productOption.findUnique({
      where: { id },
      include: { group: true },
    });
    if (!option) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    await prisma.productOption.delete({ where: { id } });
    return NextResponse.json({
      product: await getProductById(option.group.productId, { admin: true }),
    });
  } catch {
    return NextResponse.json({ error: "Unable to delete option" }, { status: 500 });
  }
}
