import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { markOrderPaid } from "@/lib/payments";
import { isDevPaymentAllowed } from "@/lib/stripe";

// Dev-only payment simulation. Prefer Stripe Checkout + webhook in real use.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && !isDevPaymentAllowed()) {
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

  const updated = await markOrderPaid({
    orderId,
    note: "Payment simulated (dev mode)",
  });

  return NextResponse.json({ order: updated });
}
