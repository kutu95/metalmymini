import { BUSINESS_LOCATION_DISPLAY, SITE_NAME, SITE_NAME_ALT, SITE_URL } from "@/lib/seo";

export function getLlmsTxt(): string {
  return `# ${SITE_NAME}

> ${SITE_NAME_ALT} is a solo Australian maker based in ${BUSINESS_LOCATION_DISPLAY}. Shay prints custom tabletop miniatures from customer-supplied STL, OBJ, and 3MF files, then electroplates a genuine copper surface — not paint, not a print.

## What it is

- One maker (atelier of one), not a factory or faceless shop
- UV resin print + real copper electroplating
- Surface-forward finish: metallic sheen, looks like copper because it is copper, takes a patina as it ages
- Careful turnaround by design — pieces are done one at a time

## Finishes

- Cosmetic copper — display cabinets and showcase pieces
- Heavy-duty copper — tougher plated surface for regular table handling (durability, not weight)

## Location

- ${BUSINESS_LOCATION_DISPLAY}

## Website

- ${SITE_URL}

## Key pages

- Home: ${SITE_URL}/
- Order: ${SITE_URL}/order
- How it works: ${SITE_URL}/how-it-works
- Returns and refunds: ${SITE_URL}/returns
- Gallery: ${SITE_URL}/gallery
- Sitemap: ${SITE_URL}/sitemap.xml

## Contact and orders

Customers upload their sculpt, choose a copper finish, and order online. Shay reviews every file before printing. Worldwide shipping is available. Custom work — not every file is accepted if unsuitable or obviously infringing.
`;
}
