import { ProductOption, ProductionStatus } from "@/generated/prisma/client";

export const FOUNDER = {
  name: "Shay",
} as const;

export const ABOUT_MAKER =
  "Metal My Mini is operated by Shay — a tabletop gaming enthusiast, experienced resin printer, and copper plating specialist. Each submitted model is personally reviewed before production to ensure the best possible result.";

export const PRODUCTS = {
  cosmetic_copper: {
    id: "cosmetic_copper" as const,
    name: "Cosmetic Copper Finish",
    description:
      "Display-quality copper plating for showcase pieces and display cabinets.",
    priceCents: 5500,
    priceDisplay: "AUD $55",
  },
  heavy_duty_copper: {
    id: "heavy_duty_copper" as const,
    name: "Heavy-Duty Copper Finish",
    description:
      "Jewellery-grade copper plating with greater durability for regular handling at the table.",
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
    "Each uploaded model is reviewed after payment. If a file is unsuitable for production and cannot reasonably be corrected, the order may be cancelled and refunded.",
  gallery:
    "By ordering, you agree that completed work may be photographed and displayed in the Metal My Mini gallery.",
  contact:
    "You may be contacted if your model requires modification, clarification, or additional processing.",
} as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Upload your model", detail: "STL, OBJ, or 3MF — up to 100 mm" },
  { step: 2, title: "Choose your finish", detail: "Cosmetic or heavy-duty copper plating" },
  { step: 3, title: "Pay securely", detail: "Payment taken on order submission" },
  { step: 4, title: "Expert review", detail: "Every file checked before production begins" },
  { step: 5, title: "Print, plate, finish", detail: "UV resin print with specialist copper plating" },
  { step: 6, title: "Ship worldwide", detail: "Tracked delivery to your door" },
] as const;

export const TRUST_SIGNALS = [
  {
    title: "Specialist copper plating",
    detail: "A finishing process focused on tabletop miniatures — not generic metal coating.",
  },
  {
    title: "Premium finishes",
    detail: "Two plating options designed for display or regular handling.",
  },
  {
    title: "Quality control",
    detail: "Each model is reviewed before production to ensure the best possible result.",
  },
  {
    title: "Real results",
    detail: "The gallery shows completed miniatures from actual customer orders.",
  },
] as const;
