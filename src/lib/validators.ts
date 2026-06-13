import { z } from "zod";

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
  country: z.string().min(2),
  productOption: z.enum(["cosmetic_copper", "heavy_duty_copper"]),
  quantity: z.coerce.number().int().min(1).max(99),
  termsAccepted: z.literal(true, { message: "You must accept the terms" }),
  publicGalleryConsentAccepted: z.boolean(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
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
});

export const galleryItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  finishType: z.enum(["cosmetic_copper", "heavy_duty_copper"]),
  published: z.boolean(),
  relatedOrderId: z.string().optional(),
});
