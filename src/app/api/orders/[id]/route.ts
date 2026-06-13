import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { addStatusHistory } from "@/lib/orders";
import { adminOrderUpdateSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        uploadedFile: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        galleryItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (user.role !== "admin" && order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Unable to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = adminOrderUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        productionStatus: parsed.data.productionStatus,
        paymentStatus: parsed.data.paymentStatus,
        adminNotes: parsed.data.adminNotes,
        customerNotes: parsed.data.customerNotes,
        trackingNumber: parsed.data.trackingNumber,
      },
    });

    await addStatusHistory(
      order.id,
      parsed.data.productionStatus,
      parsed.data.statusNote,
      admin.email,
    );

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
