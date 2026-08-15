import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { markOrderPaid } from "@/lib/payments";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const schema = z.object({
  sessionId: z.string().min(1).optional(),
  orderId: z.string().min(1).optional(),
  orderNumber: z.string().min(5).optional(),
});

/**
 * Reconcile a Checkout Session with our order after return from Stripe.
 * Used when the webhook is delayed/misconfigured so paid orders don't stay unpaid.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "sessionId or order details required" }, { status: 400 });
    }

    let sessionId = parsed.data.sessionId ?? null;
    let order =
      parsed.data.orderId && parsed.data.orderNumber
        ? await prisma.order.findFirst({
            where: { id: parsed.data.orderId, orderNumber: parsed.data.orderNumber },
          })
        : null;

    if (!sessionId && order?.stripeCheckoutSessionId) {
      sessionId = order.stripeCheckoutSessionId;
    }

    if (!sessionId && parsed.data.orderNumber) {
      order = await prisma.order.findFirst({
        where: { orderNumber: parsed.data.orderNumber },
      });
      sessionId = order?.stripeCheckoutSessionId ?? null;
    }

    if (!sessionId) {
      return NextResponse.json({ error: "No Stripe session found for this order" }, { status: 404 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId ?? session.client_reference_id ?? order?.id ?? null;
    if (!orderId) {
      return NextResponse.json({ error: "Session is not linked to an order" }, { status: 400 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        paid: false,
        paymentStatus: session.payment_status,
        orderNumber: session.metadata?.orderNumber ?? order?.orderNumber ?? null,
      });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const updated = await markOrderPaid({
      orderId,
      note: "Payment confirmed via Stripe Checkout",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
    });

    return NextResponse.json({
      paid: true,
      orderNumber: updated.orderNumber,
      paymentStatus: updated.paymentStatus,
      productionStatus: updated.productionStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
