import { JsonLd } from "@/components/JsonLd";
import { Card, PageHeading } from "@/components/ui";
import { SUPPORT_EMAIL } from "@/lib/returns-policy";
import { SITE_NAME, SITE_URL, createPageMetadata } from "@/lib/seo";
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_INTRO,
  TERMS_SECTIONS,
  getTermsPageJsonLd,
} from "@/lib/terms-of-service";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for Metal My Mini — file rights, payment, cancellations, shipping, and Australian Consumer Law guarantees.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={getTermsPageJsonLd()} />

      <div>
        <PageHeading
          title="Terms of Service"
          subtitle={`Effective date: ${formatEffectiveDate(TERMS_EFFECTIVE_DATE)} · Last updated: ${formatEffectiveDate(TERMS_EFFECTIVE_DATE)}`}
        />

        <div className="space-y-6">
          {TERMS_INTRO.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-stone-400">
              {paragraph}
            </p>
          ))}

          {TERMS_SECTIONS.map((section) => (
            <Card key={section.number}>
              <h2 className="text-xl font-medium text-stone-100">
                {section.number}. {section.title}
              </h2>
              {section.blocks.map((block, index) =>
                block.type === "p" ? (
                  <p
                    key={`${section.number}-p-${index}`}
                    className="mt-3 leading-relaxed text-stone-400"
                  >
                    {block.text}
                  </p>
                ) : (
                  <ul
                    key={`${section.number}-ul-${index}`}
                    className="mt-3 list-disc space-y-2 pl-5 text-stone-400"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </Card>
          ))}

          <Card>
            <h2 className="text-xl font-medium text-stone-100">Related policies</h2>
            <ul className="mt-3 space-y-2 text-stone-400">
              <li>
                <Link href="/privacy" className="text-copper-light hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-copper-light hover:underline">
                  Return and Refund Policy
                </Link>
              </li>
              <li>
                Email:{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-copper-light hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                Website:{" "}
                <Link href="/" className="text-copper-light hover:underline">
                  {SITE_NAME}
                </Link>{" "}
                ({SITE_URL})
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function formatEffectiveDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  }).format(new Date(`${isoDate}T12:00:00`));
}
