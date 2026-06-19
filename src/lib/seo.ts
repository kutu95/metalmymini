import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/constants";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://metalmymini.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Metal My Mini";
export const SITE_NAME_ALT = "MetalMyMini";

export const DEFAULT_DESCRIPTION =
  "Upload your STL file and receive a professionally printed and copper-plated tabletop miniature. Specialist finishes, expert review, worldwide shipping.";

export const FAQ_ITEMS = [
  {
    question: "What file formats do you accept?",
    answer:
      "We accept STL, OBJ, and 3MF files. Models must be up to 100 mm in any dimension.",
  },
  {
    question: "What copper finish options are available?",
    answer:
      "Cosmetic Copper Finish (AUD $55) is ideal for display pieces. Heavy-Duty Copper Finish (AUD $80) uses jewellery-grade plating for minis handled regularly at the table.",
  },
  {
    question: "Is my model reviewed before production?",
    answer:
      "Yes. Each uploaded model is reviewed after payment to confirm it is suitable for printing and copper plating before production begins.",
  },
  {
    question: "What happens if my file cannot be produced?",
    answer:
      "If a file is unsuitable for production and cannot reasonably be corrected, the order may be cancelled and refunded.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes. Completed miniatures are shipped worldwide with tracking when your order ships.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Use the Track Order page with your order number and email, or log in to view all your orders and status updates.",
  },
] as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_AU",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function getHomeJsonLd() {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const products = Object.values(PRODUCTS).map((product) => ({
    "@type": "Product",
    "@id": `${SITE_URL}/#product-${product.id}`,
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/order`,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        alternateName: SITE_NAME_ALT,
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        founder: {
          "@type": "Person",
          name: "Shay",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: {
          "@id": organizationId,
        },
        inLanguage: "en-AU",
      },
      ...products,
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
