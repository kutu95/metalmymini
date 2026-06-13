import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addStatusHistory } from "@/lib/orders";

// Dev-only payment simulation. Stripe webhook handler will replace this flow.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEV_PAYMENT !== "true") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = await request.json();
  const orderId = body.orderId as string;
  const success = body.success !== false;

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!success) {
    const failed = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.json({ order: failed });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "paid",
      productionStatus: order.productionStatus === "submitted" ? "paid" : order.productionStatus,
    },
  });

  await addStatusHistory(updated.id, "paid", "Payment simulated (dev mode)");

  return NextResponse.json({ order: updated });
}
