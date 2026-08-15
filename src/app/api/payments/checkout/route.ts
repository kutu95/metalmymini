import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { productLabel } from "@/lib/format";
import { getAppUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  orderId: z.string().min(1),
  orderNumber: z.string().min(5),
});

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  const parsed = bodySchema.safeParse({ orderId, orderNumber });
  if (!parsed.success) {
    return NextResponse.json({ error: "Order details required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, orderNumber: parsed.data.orderNumber },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    productLabel: productLabel(order.productOption),
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    paymentStatus: order.paymentStatus,
    stripeConfigured: isStripeConfigured(),
    devPaymentAllowed:
      process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_PAYMENT === "true",
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to the environment." },
        { status: 503 },
      );
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Order details required" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: parsed.data.orderId, orderNumber: parsed.data.orderNumber },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        alreadyPaid: true,
        url: `${getAppUrl()}/order/status?orderNumber=${encodeURIComponent(order.orderNumber)}&paid=1`,
      });
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();
    const label = productLabel(order.productOption);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      line_items: [
        {
          quantity: order.quantity,
          price_data: {
            currency: "aud",
            unit_amount: order.unitPrice,
            product_data: {
              name: label,
              description: `Order ${order.orderNumber}`,
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${appUrl}/order/status?orderNumber=${encodeURIComponent(order.orderNumber)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order/confirm?orderId=${encodeURIComponent(order.id)}&orderNumber=${encodeURIComponent(order.orderNumber)}&cancelled=1`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
