import { ProductOption, ProductionStatus } from "@/generated/prisma/client";

export const PRODUCTS = {
  cosmetic_copper: {
    id: "cosmetic_copper" as const,
    name: "Cosmetic Copper Finish",
    description: "Standard display-quality copper plating.",
    priceCents: 5500,
    priceDisplay: "AUD $55",
  },
  heavy_duty_copper: {
    id: "heavy_duty_copper" as const,
    name: "Heavy-Duty Copper Finish",
    description: "Thicker jewellery-grade copper plating for regular handling.",
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
  human_review: "Human Review",
  approved: "Approved",
  printing: "Printing",
  plating: "Plating",
  polishing: "Polishing",
  packaging: "Packaging",
  shipped: "Shipped",
  completed: "Completed",
  awaiting_customer_action: "Awaiting Customer Action",
  additional_payment_required: "Additional Payment Required",
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
    "Your uploaded model will be manually reviewed after payment. If the model is unsuitable for production and cannot reasonably be corrected, we may cancel and refund the order.",
  gallery:
    "By ordering, you agree that completed work may be photographed and displayed in the Metal My Mini public gallery and marketing materials.",
  contact:
    "Metal My Mini may contact you if your model requires modification, clarification, or additional processing.",
} as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Upload your model", detail: "STL, OBJ, or 3MF up to 100 mm" },
  { step: 2, title: "Choose finish", detail: "Cosmetic or heavy-duty copper" },
  { step: 3, title: "Pay securely", detail: "Stripe checkout (test mode in dev)" },
  { step: 4, title: "Human review", detail: "We inspect every file by hand" },
  { step: 5, title: "Print, plate, polish", detail: "UV resin print and copper finish" },
  { step: 6, title: "Ship worldwide", detail: "Tracked delivery to your door" },
] as const;
