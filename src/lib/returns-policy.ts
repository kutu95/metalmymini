export const RETURN_POLICY_PATH = "/returns";

export const RETURN_POLICY_EFFECTIVE_DATE = "2026-08-08";

export const SUPPORT_EMAIL = "metalmymini@gmail.com";

export const RETURN_POLICY_INTRO = [
  "Every miniature is made to order from the file you supply. Because each piece is custom-made, some specific conditions apply to returns and refunds — and nothing below affects your rights under the Australian Consumer Law.",
] as const;

export const RETURN_POLICY_SECTIONS = [
  {
    title: "Custom-made products",
    paragraphs: [
      "All prints and copper-plated miniatures are made to order. Because they're customised, I can't offer returns or refunds for:",
    ],
    bullets: [
      "Change of mind",
      "The wrong file or options chosen at checkout",
      "Minor variation in appearance, finish, colour, or texture that's a normal part of 3D printing and metal plating",
      "Errors in the file, dimensions, or specifications you supplied",
    ],
  },
  {
    title: "Faulty or damaged items",
    paragraphs: [
      "If your order arrives damaged or has a manufacturing fault, contact me as soon as you can — ideally within 14 days of delivery so I can sort it quickly. Your rights under the Australian Consumer Law aren't limited to that window.",
      "Please include:",
    ],
    bullets: [
      "Your order number",
      "A description of the problem",
      "Clear photos showing the issue",
    ],
    closing:
      "I'll assess the item. For a minor fault, I'll repair or replace it. For a major fault, you choose a refund or a replacement — that choice is yours.",
  },
  {
    title: "File approval",
    paragraphs: [
      "Where a preview or proof is provided, it's your responsibility to review and approve it before production begins. Once production has started, orders generally can't be cancelled.",
    ],
  },
  {
    title: "Lost or damaged in transit",
    paragraphs: [
      "If a shipment is lost or arrives visibly damaged, contact me as soon as possible. I'll work with the carrier to investigate and find a resolution.",
    ],
  },
  {
    title: "Cancellations",
    paragraphs: [
      "Orders can be cancelled before production begins. Once printing, plating, finishing, or packing has started, cancellation generally isn't possible, because the piece is being made specifically for you. This covers change-of-mind cancellation and doesn't affect your rights if an item is faulty.",
    ],
  },
  {
    title: "Australian Consumer Law",
    paragraphs: [
      "Nothing in this policy excludes, restricts, or modifies any right or remedy you have under the Australian Consumer Law. You're entitled to a repair, replacement, or refund where the ACL requires it.",
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
