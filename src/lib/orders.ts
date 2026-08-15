import { prisma } from "@/lib/db";
import { Prisma, ProductionStatus } from "@/generated/prisma/client";
import { quoteDomesticParcel } from "@/lib/auspost";
import { getActiveProduct } from "@/lib/products";

export const orderItemsInclude = {
  items: {
    orderBy: { sortOrder: "asc" as const },
    include: { uploadedFile: true },
  },
} satisfies Prisma.OrderInclude;

export function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MMM-${date}-${rand}`;
}

export async function calculateOrderTotal(quantity: number, toPostcode: string, productId: string) {
  const product = await getActiveProduct(productId);
  if (!product) {
    throw new Error("Selected product is not available");
  }

  const unitPrice = product.priceCents;
  const productTotal = unitPrice * quantity;
  const shipping = await quoteDomesticParcel({ toPostcode, quantity });

  return {
    product,
    unitPrice,
    productTotal,
    shippingPrice: shipping.amountCents,
    shippingService: shipping.serviceName,
    shippingDeliveryTime: shipping.deliveryTime,
    totalPrice: productTotal + shipping.amountCents,
  };
}

/** Best-effort postcode from a stored address when shippingPostcode is missing. */
export function extractPostcodeFromAddress(address: string) {
  const matches = address.match(/\b(\d{4})\b/g);
  if (!matches?.length) return null;
  return matches[matches.length - 1] ?? null;
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
