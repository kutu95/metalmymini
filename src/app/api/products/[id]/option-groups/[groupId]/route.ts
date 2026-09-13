import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { optionGroupUpdateSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  try {
    await requireAdmin();
    const { id, groupId } = await params;
    const group = await prisma.productOptionGroup.findFirst({
      where: { id: groupId, productId: id },
    });
    if (!group) {
      return NextResponse.json({ error: "Option group not found" }, { status: 404 });
    }

    const parsed = optionGroupUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    await prisma.productOptionGroup.update({
      where: { id: groupId },
      data: {
        ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
        ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
        ...(parsed.data.required !== undefined ? { required: parsed.data.required } : {}),
        ...(parsed.data.sortOrder !== undefined ? { sortOrder: parsed.data.sortOrder } : {}),
        ...(parsed.data.active !== undefined ? { active: parsed.data.active } : {}),
      },
    });

    return NextResponse.json({ product: await getProductById(id, { admin: true }) });
  } catch {
    return NextResponse.json({ error: "Unable to update option group" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; groupId: string }> },
) {
  try {
    await requireAdmin();
    const { id, groupId } = await params;
    const group = await prisma.productOptionGroup.findFirst({
      where: { id: groupId, productId: id },
    });
    if (!group) {
      return NextResponse.json({ error: "Option group not found" }, { status: 404 });
    }

    await prisma.productOptionGroup.delete({ where: { id: groupId } });
    return NextResponse.json({ product: await getProductById(id, { admin: true }) });
  } catch {
    return NextResponse.json({ error: "Unable to delete option group" }, { status: 500 });
  }
}
