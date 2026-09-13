import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { audToCents } from "@/lib/site-settings";
import { productOptionSchema } from "@/lib/validators";

export async function POST(
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

    const parsed = productOptionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    await prisma.productOption.create({
      data: {
        groupId,
        name: parsed.data.name,
        description: parsed.data.description ?? "",
        priceDeltaCents: audToCents(parsed.data.priceDeltaAud ?? 0),
        sortOrder: parsed.data.sortOrder ?? 0,
        active: parsed.data.active ?? true,
      },
    });

    return NextResponse.json({ product: await getProductById(id, { admin: true }) });
  } catch {
    return NextResponse.json({ error: "Unable to create option" }, { status: 500 });
  }
}
