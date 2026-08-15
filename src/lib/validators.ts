import { z } from "zod";
import { MAX_LINE_QUANTITY, MAX_ORDER_FILES } from "@/lib/constants";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(5),
  shippingPostcode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a valid 4-digit Australian postcode"),
  country: z.literal("Australia", {
    message: "Shipping is currently available within Australia only",
  }),
  productId: z.string().min(1, "Select a product"),
  termsAccepted: z.literal(true, { message: "You must accept the terms" }),
  publicGalleryConsentAccepted: z.boolean().optional().default(true),
  customerNotes: z.string().max(2000).optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
});

export const shippingQuoteSchema = z.object({
  postcode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a valid 4-digit Australian postcode"),
  quantity: z.coerce.number().int().min(1).max(MAX_ORDER_FILES * MAX_LINE_QUANTITY).default(1),
});

export const orderStatusLookupSchema = z.object({
  orderNumber: z.string().min(5),
  email: z.string().email(),
});

export const adminOrderUpdateSchema = z.object({
  productionStatus: z.enum([
    "submitted",
    "paid",
    "human_review",
    "approved",
    "printing",
    "plating",
    "polishing",
    "packaging",
    "shipped",
    "completed",
    "awaiting_customer_action",
    "additional_payment_required",
    "rejected",
    "refunded",
    "cancelled",
  ]),
  paymentStatus: z.enum(["unpaid", "paid", "refunded", "failed"]).optional(),
  adminNotes: z.string().optional(),
  customerNotes: z.string().optional(),
  trackingNumber: z.string().optional(),
  statusNote: z.string().optional(),
  printStartEmailSent: z.boolean().optional(),
});

export const galleryItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  productId: z.string().optional(),
  published: z.boolean(),
  relatedOrderId: z.string().optional(),
});

export const heroImageSchema = z.object({
  altText: z.string().optional(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export const heroRotationSchema = z.object({
  heroRotationSeconds: z.coerce.number().min(1).max(60),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(1000).optional().default(""),
  priceAud: z.coerce.number().min(1).max(5000),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  galleryItemId: z.string().nullable().optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
  active: z.boolean().optional(),
});

export const orderLineQuantitySchema = z.coerce.number().int().min(1).max(MAX_LINE_QUANTITY);

export function parseOrderModelLines(formData: FormData) {
  const lines: { file: File; quantity: number }[] = [];

  for (let i = 0; i < MAX_ORDER_FILES; i++) {
    const file = formData.get(`modelFile_${i}`);
    if (!(file instanceof File) || file.size === 0) continue;

    const quantity = orderLineQuantitySchema.safeParse(formData.get(`quantity_${i}`) ?? 1);
    if (!quantity.success) {
      throw new Error(`Quantity for ${file.name || `file ${i + 1}`} must be between 1 and ${MAX_LINE_QUANTITY}`);
    }
    lines.push({ file, quantity: quantity.data });
  }

  if (lines.length === 0) {
    throw new Error("At least one model file is required");
  }

  return lines;
}

export const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(80).optional(),
  source: z.enum(["footer", "home", "other"]).optional(),
});
