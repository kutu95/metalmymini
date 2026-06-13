import { ProductOption, ProductionStatus } from "@/generated/prisma/client";

export const FOUNDER = {
  name: "Shay",
  tagline: "Tabletop gamer, resin printer, copper plating specialist",
} as const;

export const PRODUCTS = {
  cosmetic_copper: {
    id: "cosmetic_copper" as const,
    name: "Cosmetic Copper Finish",
    description:
      "Display-quality copper plating — ideal for characters you want to admire on the shelf.",
    priceCents: 5500,
    priceDisplay: "AUD $55",
  },
  heavy_duty_copper: {
    id: "heavy_duty_copper" as const,
    name: "Heavy-Duty Copper Finish",
    description:
      "Thicker jewellery-grade copper for minis you pick up, roll, and bring to the table week after week.",
    priceCents: 8000,
    priceDisplay: "AUD $80",
  },
} satisfies Record<
  ProductOption,
  {
    id: ProductOption;
    name: string;
    description: string;
    priceCents: number;
    priceDisplay: string;
  }
>;

export const ACCEPTED_FILE_TYPES = [".stl", ".obj", ".3mf"] as const;
export const ACCEPTED_MIME_TYPES = [
  "model/stl",
  "application/sla",
  "application/vnd.ms-pki.stl",
  "application/octet-stream",
  "text/plain",
  "model/obj",
  "application/obj",
  "application/3mf",
  "application/vnd.ms-package.3dmanufacturing-3dmodel+xml",
] as const;

export const MAX_MODEL_DIMENSION_MM = 100;
export const MIN_ORDER_CENTS = 5500;

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  submitted: "Submitted",
  paid: "Paid",
  human_review: "Under review",
  approved: "Approved",
  printing: "Printing",
  plating: "Plating",
  polishing: "Polishing",
  packaging: "Packaging",
  shipped: "Shipped",
  completed: "Completed",
  awaiting_customer_action: "Awaiting your reply",
  additional_payment_required: "Additional payment needed",
  rejected: "Rejected",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
  failed: "Failed",
} as const;

export const LEGAL_CHECKOUT_TEXT = {
  review:
    "I personally review every uploaded model after payment. If your file isn't suitable for production and can't reasonably be corrected, I'll cancel the order and refund you.",
  gallery:
    "By commissioning a piece, you agree that finished work may be photographed and shown in the Metal My Mini gallery.",
  contact:
    "I'll reach out if your model needs a tweak, a clarification, or extra work before I can plate it.",
} as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Send me your model", detail: "STL, OBJ, or 3MF — up to 100 mm" },
  { step: 2, title: "Pick your finish", detail: "Cosmetic or heavy-duty copper" },
  { step: 3, title: "Pay securely", detail: "Payment taken when you submit your commission" },
  { step: 4, title: "I review your file", detail: "Every model checked by hand before I start" },
  { step: 5, title: "Print, plate, polish", detail: "Printed in resin, finished in copper at my bench" },
  { step: 6, title: "Shipped to you", detail: "Packed with care, tracked worldwide" },
] as const;

export const TRUST_SIGNALS = [
  {
    title: "Personally reviewed",
    detail: "I look at every file myself before a single layer is printed.",
  },
  {
    title: "Finished by hand",
    detail: "Print, plate, polish, and pack — all at my workbench.",
  },
  {
    title: "Real finished work",
    detail: "The gallery shows actual pieces I've made for customers.",
  },
  {
    title: "Progress from me",
    detail: "You'll hear from me directly if anything needs attention along the way.",
  },
] as const;

export const FOUNDER_POINTS = [
  "Tabletop gaming enthusiast — I know what a hero mini should feel like in your hand.",
  "Experienced resin printer — years at the bench getting supports, detail, and scale right.",
  "Copper plating specialist — turning printed resin into something that reads as metal.",
  "Every miniature personally reviewed and finished — no queue, no factory line.",
] as const;

export const WORKSHOP_STORY = {
  heading: "Why I Started Metal My Mini",
  paragraphs: [
    "I've been around tabletop games long enough to know the feeling when a character finally looks right on the table — and how disappointing it is when the mini doesn't match the story in your head.",
    "I got into 3D printing to solve that for myself. Then I fell down the rabbit hole of metal finishing: what if a custom sculpt could look and feel like it was cast in copper, not sprayed to look metallic?",
    "Metal My Mini is that obsession turned into a small workshop. I don't mass-produce. I take commissions, review every file, and finish each piece myself. If you want something that doesn't exist in a catalogue — your dragonborn, your warlock, your one-off sculpt — I'm the person making it.",
  ],
} as const;
