import { prisma } from "@/lib/db";
import { addStatusHistory } from "@/lib/orders";

export async function markOrderPaid(input: {
  orderId: string;
  note: string;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
}) {
  const order = await prisma.order.findUnique({ where: { id: input.orderId } });
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    return order;
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "paid",
      productionStatus: order.productionStatus === "submitted" ? "paid" : order.productionStatus,
      ...(input.stripeCheckoutSessionId
        ? { stripeCheckoutSessionId: input.stripeCheckoutSessionId }
        : {}),
      ...(input.stripePaymentIntentId
        ? { stripePaymentIntentId: input.stripePaymentIntentId }
        : {}),
    },
  });

  await addStatusHistory(updated.id, "paid", input.note);
  return updated;
}
