import { prisma } from "@/lib/db";
import { ProductionStatus } from "@/generated/prisma/client";
import { getDisplayCopperPriceCents } from "@/lib/site-settings";

export function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MMM-${date}-${rand}`;
}

export async function calculateOrderTotal(quantity: number) {
  const unitPrice = await getDisplayCopperPriceCents();
  return { unitPrice, totalPrice: unitPrice * quantity };
}

export async function addStatusHistory(
  orderId: string,
  status: ProductionStatus,
  note?: string,
  createdBy?: string,
) {
  return prisma.orderStatusHistory.create({
    data: { orderId, status, note, createdBy },
  });
}
