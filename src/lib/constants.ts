import { ProductionStatus } from "@/generated/prisma/client";

export const FOUNDER = {
  name: "Shay",
} as const;

export const ABOUT_MAKER =
  "I'm Shay. I run Metal My Mini out of Melbourne — tabletop player, resin printer, and the one who does the plating. Every model that comes in gets looked at by me before anything is printed, so what ships is the best result I can get from your file.";

export const WHY_METAL_MY_MINI =
  "It's one person, not a print farm. I review every file myself before it goes near the printer — if it won't plate cleanly, you get a revision or your money back. The gallery is real pieces from real orders, photographed as they shipped.";

/** Checkout ships within Australia only for now. */
export const SHIPPING_COUNTRY = "Australia";

export const DEFAULT_PRODUCT_DESCRIPTION =
  "A genuine copper surface, electroplated over your print and polished to a metal shine. Looks like solid bronze and takes a natural patina over time.";

export const ACCEPTED_FILE_TYPES = [".stl", ".obj", ".3mf"] as const;
export const MAX_ORDER_FILES = 10;
export const MAX_LINE_QUANTITY = 99;
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
export const MIN_ORDER_CENTS = 100;

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
    "Each model is reviewed after payment. If a file can't be produced and can't reasonably be fixed, I'll cancel and refund the order.",
  gallery:
    "By ordering, you agree photos of your finished piece may appear in the gallery, on the site, and in marketing. Tell us in your order notes or email metalmymini@gmail.com if you'd rather we didn't — no reason needed.",
  contact:
    "I may contact you if your model needs a change, clarification, or extra processing.",
} as const;

export const PROCESS_STEPS = [
  { step: 1, title: "Upload your model", detail: "STL, OBJ, or 3MF — up to 100 mm" },
  { step: 2, title: "Choose a finish", detail: "Electroplated metal finish, polished to a shine" },
  { step: 3, title: "Pay securely", detail: "Payment taken when you submit" },
  { step: 4, title: "File review", detail: "I check printability, size, and how well it'll take copper" },
  { step: 5, title: "Print, plate, finish", detail: "UV resin print, then real copper electroplating" },
  { step: 6, title: "Ship within Australia", detail: "At cost, with tracking when it ships" },
] as const;
