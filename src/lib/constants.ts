import { ProductOption, ProductionStatus } from "@/generated/prisma/client";

export const FOUNDER = {
  name: "Shay",
} as const;

export const ABOUT_MAKER =
  "I'm Shay — tabletop gamer, resin printer, and copper plater. I take your sculpt, print it in UV resin, and electroplate a real copper surface so it gleams like metal and takes a patina as it ages. I check every file myself before I print. Worth the wait — I do these one at a time.";

export const PRODUCTS = {
  cosmetic_copper: {
    id: "cosmetic_copper" as const,
    name: "Cosmetic Copper Finish",
    description:
      "A real electroplated copper surface with the sheen for display cabinets and showcase pieces — grey resin in, gleaming copper out.",
    priceCents: 5500,
    priceDisplay: "AUD $55",
  },
  heavy_duty_copper: {
    id: "heavy_duty_copper" as const,
    name: "Heavy-Duty Copper Finish",
    description:
      "A tougher copper plate built for minis you handle at the table — same metallic look and surface, more durability for regular play. Not about weight; about a finish that holds up.",
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

/** Happy-path production stages shown on the order tracking page. */
export const TRACKING_PIPELINE = [
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
] as const satisfies readonly ProductionStatus[];

export const LEGAL_CHECKOUT_TEXT = {
  review:
    "Each uploaded model is reviewed after payment. If a file is unsuitable for production and cannot reasonably be corrected, the order may be cancelled and refunded.",
  gallery:
    "By ordering, you agree that completed work may be photographed and displayed in the Metal My Mini gallery.",
  contact:
    "You may be contacted if your model requires modification, clarification, or additional processing.",
} as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Upload your sculpt", detail: "STL, OBJ, or 3MF — up to 100 mm" },
  { step: 2, title: "Choose your finish", detail: "Cosmetic or heavy-duty copper plate" },
  { step: 3, title: "Pay securely", detail: "Payment taken when you submit" },
  { step: 4, title: "I check your file", detail: "I review every sculpt before I print" },
  { step: 5, title: "Print, plate, finish", detail: "UV resin print, then real copper electroplating" },
  { step: 6, title: "Ship worldwide", detail: "Tracked delivery to your door" },
] as const;

export const TRUST_SIGNALS = [
  {
    title: "Real copper surface",
    detail:
      "Electroplated metal — not paint, not a print. It looks like copper because it is copper, and it takes a patina as it ages.",
  },
  {
    title: "Two finishes, clear jobs",
    detail: "Cosmetic for the cabinet. Heavy-duty for the table. Same metallic look; different durability.",
  },
  {
    title: "I check every file",
    detail: "Before I print your mini, I review the sculpt myself — printability, size, and plating suitability.",
  },
  {
    title: "Finished pieces, not mockups",
    detail: "The gallery shows real copper-plated minis from orders I've completed.",
  },
] as const;
