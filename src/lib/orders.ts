import { prisma } from "@/lib/db";
import { Prisma, ProductionStatus } from "@/generated/prisma/client";
import { quoteDomesticParcel } from "@/lib/auspost";
import { getActiveProduct } from "@/lib/products";
import {
  productNameWithOptions,
  resolveSelectedOptions,
  type SelectedOptionSnapshot,
} from "@/lib/product-options";

export const orderItemsInclude = {
  items: {
    orderBy: { sortOrder: "asc" as const },
    include: { uploadedFile: true },
  },
  selectedOptions: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.OrderInclude;

export function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MMM-${date}-${rand}`;
}

export async function calculateOrderTotal(
  quantity: number,
  toPostcode: string,
  productId: string,
  optionIds: string[] = [],
) {
  const product = await getActiveProduct(productId);
  if (!product) {
    throw new Error("Selected product is not available");
  }

  const selectedOptions = resolveSelectedOptions(optionIds, {
    optionGroups: product.optionGroups,
    incompatibilities: product.incompatibilities,
  });
  const optionDelta = selectedOptions.reduce((sum, option) => sum + option.priceDeltaCents, 0);
  const unitPrice = product.priceCents + optionDelta;
  const productTotal = unitPrice * quantity;
  const shipping = await quoteDomesticParcel({ toPostcode, quantity });

  return {
    product,
    selectedOptions,
    productName: productNameWithOptions(product.name, selectedOptions),
    unitPrice,
    productTotal,
    shippingPrice: shipping.amountCents,
    shippingService: shipping.serviceName,
    shippingDeliveryTime: shipping.deliveryTime,
    totalPrice: productTotal + shipping.amountCents,
  };
}

export function parseOptionIds(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((value) => String(value)).filter(Boolean);
  }
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((value) => String(value)).filter(Boolean);
  } catch {
    return [];
  }
}

export function snapshotSelectedOptions(selectedOptions: SelectedOptionSnapshot[]) {
  return selectedOptions.map((option) => ({
    groupName: option.groupName,
    optionName: option.optionName,
    priceDeltaCents: option.priceDeltaCents,
    sortOrder: option.sortOrder,
  }));
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
