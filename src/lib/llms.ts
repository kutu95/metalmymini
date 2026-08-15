import { BUSINESS_LOCATION_DISPLAY, SITE_NAME, SITE_NAME_ALT, SITE_URL } from "@/lib/seo";
import { listProducts } from "@/lib/products";

export async function getLlmsTxt(): Promise<string> {
  const products = await listProducts({ activeOnly: true });
  const finishLines =
    products.length > 0
      ? products
          .map(
            (product) =>
              `- ${product.name} (${product.priceDisplay}) — ${product.description || "metal finish"}`,
          )
          .join("\n")
      : "- Finishes are listed on the order page";

  return `# ${SITE_NAME}

> ${SITE_NAME_ALT} is run by Shay in ${BUSINESS_LOCATION_DISPLAY}. Upload your STL, OBJ, or 3MF — it is printed in UV resin, electroplated in real copper, and hand-finished. Shipping within Australia.

## What it is

- One person, not a print farm
- UV resin print + real copper electroplating
- Genuine copper surface that takes a natural patina over time
- Every file reviewed before anything is printed

## Finish

${finishLines}

## Location

- ${BUSINESS_LOCATION_DISPLAY}

## Website

- ${SITE_URL}

## Key pages

- Home: ${SITE_URL}/
- Order: ${SITE_URL}/order
- How it works: ${SITE_URL}/how-it-works
- Returns and refunds: ${SITE_URL}/returns
- Privacy: ${SITE_URL}/privacy
- Terms of Service: ${SITE_URL}/terms
- Gallery: ${SITE_URL}/gallery
- Sitemap: ${SITE_URL}/sitemap.xml

## Contact and orders

Customers upload their model and choose a finish online. Shay reviews every file before printing. If a file can't be produced, the order is cancelled and refunded. Contact: metalmymini@gmail.com
`;
}
