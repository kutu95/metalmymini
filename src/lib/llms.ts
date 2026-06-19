import { SITE_NAME, SITE_NAME_ALT, SITE_URL } from "@/lib/seo";

export function getLlmsTxt(): string {
  return `# ${SITE_NAME}

> ${SITE_NAME_ALT} is an Australian service that manufactures custom tabletop gaming miniatures from customer-supplied STL, OBJ, and 3MF files.

## Services

- Resin printing
- Copper electroplating
- Custom miniature production
- Specialist copper-plated finishes (cosmetic and heavy-duty)

## Website

- ${SITE_URL}

## Key pages

- Home: ${SITE_URL}/
- Order: ${SITE_URL}/order
- How it works: ${SITE_URL}/how-it-works
- Gallery: ${SITE_URL}/gallery
- Sitemap: ${SITE_URL}/sitemap.xml

## Contact and orders

Customers upload a model file, choose a copper finish, and place an order online. Each file is reviewed before production. Worldwide shipping is available.
`;
}
