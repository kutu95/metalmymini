export const RETURN_POLICY_PATH = "/returns";

export const RETURN_POLICY_EFFECTIVE_DATE = "2026-06-22";

export const SUPPORT_EMAIL = "support@metalmymini.com";

export const RETURN_POLICY_INTRO = [
  "At MetalMyMini, every miniature is produced specifically for each customer from files supplied by the customer. Because our products are custom manufactured, special conditions apply to returns and refunds.",
] as const;

export const RETURN_POLICY_SECTIONS = [
  {
    title: "Custom-Made Products",
    paragraphs: [
      "All miniatures, resin prints, and copper-plated miniatures are made to order.",
      "Due to the customised nature of these products, we do not accept returns or provide refunds for:",
    ],
    bullets: [
      "Change of mind",
      "Incorrect file selection by the customer",
      "Minor variations in appearance, finish, colour, or texture that are inherent to 3D printing and metal plating",
      "Customer errors in uploaded files, dimensions, or specifications",
    ],
  },
  {
    title: "Damaged or Defective Products",
    paragraphs: [
      "If your order arrives damaged or contains a manufacturing defect, please contact us within 14 days of delivery.",
      "Please provide:",
    ],
    bullets: [
      "Your order number",
      "A description of the issue",
      "Clear photographs showing the problem",
    ],
    closing:
      "We will assess the issue and may, at our discretion, reprint the item, replace the item, provide a partial refund, or provide a full refund.",
  },
  {
    title: "File Approval",
    paragraphs: [
      "Where a design review or approval process is provided, customers are responsible for reviewing and approving any proofs, previews, or specifications before production begins.",
      "Once production has commenced, orders cannot normally be cancelled.",
    ],
  },
  {
    title: "Lost or Damaged Shipments",
    paragraphs: [
      "If a shipment is lost in transit or arrives visibly damaged, please contact us as soon as possible.",
      "We will work with the shipping carrier to investigate the issue and determine an appropriate resolution.",
    ],
  },
  {
    title: "Order Cancellations",
    paragraphs: [
      "Orders may be cancelled before production begins.",
      "Once printing, finishing, plating, or packaging has commenced, cancellations are generally not possible because the product is being manufactured specifically for you.",
    ],
  },
  {
    title: "Australian Consumer Law",
    paragraphs: [
      "Nothing in this policy excludes, restricts, or modifies any rights or remedies available under the Australian Consumer Law.",
      "Customers are entitled to a replacement, repair, or refund where required by Australian Consumer Law.",
    ],
  },
] as const;

export function getReturnsPageJsonLd(
  siteUrl: string,
  siteName: string,
  merchantReturnPolicy: Record<string, unknown>,
) {
  const returnPolicyUrl = `${siteUrl}${RETURN_POLICY_PATH}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${returnPolicyUrl}#webpage`,
        url: returnPolicyUrl,
        name: "Return and Refund Policy",
        description:
          "Return and refund policy for custom-made copper-plated miniatures from Metal My Mini, including conditions for damaged or defective orders.",
        isPartOf: {
          "@type": "WebSite",
          url: siteUrl,
          name: siteName,
        },
        about: merchantReturnPolicy,
        inLanguage: "en-AU",
      },
      merchantReturnPolicy,
    ],
  };
}
