import { JsonLd } from "@/components/JsonLd";
import { Card, PageHeading } from "@/components/ui";
import {
  RETURN_POLICY_EFFECTIVE_DATE,
  RETURN_POLICY_INTRO,
  RETURN_POLICY_SECTIONS,
  SUPPORT_EMAIL,
  getReturnsPageJsonLd,
} from "@/lib/returns-policy";
import {
  SITE_NAME,
  SITE_URL,
  createPageMetadata,
  getMerchantReturnPolicyJsonLd,
} from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Return and Refund Policy",
  description:
    "Return and refund policy for custom-made copper-plated miniatures from Metal My Mini, including conditions for damaged, defective, or lost orders.",
  path: "/returns",
});

export default function ReturnsPage() {
  const merchantReturnPolicy = getMerchantReturnPolicyJsonLd();

  return (
    <>
      <JsonLd data={getReturnsPageJsonLd(SITE_URL, SITE_NAME, merchantReturnPolicy)} />

      <div>
        <PageHeading
          title="Return and Refund Policy"
          subtitle={`Effective date: ${formatEffectiveDate(RETURN_POLICY_EFFECTIVE_DATE)}`}
        />

        <div className="space-y-6">
          {RETURN_POLICY_INTRO.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-stone-400">
              {paragraph}
            </p>
          ))}

          {RETURN_POLICY_SECTIONS.map((section) => (
            <Card key={section.title}>
              <h2 className="text-xl font-medium text-stone-100">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-stone-400">
                  {paragraph}
                </p>
              ))}
              {"bullets" in section && section.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {"closing" in section && section.closing ? (
                <p className="mt-3 leading-relaxed text-stone-400">{section.closing}</p>
              ) : null}
            </Card>
          ))}

          <Card>
            <h2 className="text-xl font-medium text-stone-100">Contact Us</h2>
            <p className="mt-3 leading-relaxed text-stone-400">
              For questions regarding returns or refunds, please contact:
            </p>
            <ul className="mt-4 space-y-2 text-stone-400">
              <li>
                <strong className="text-stone-200">{SITE_NAME}</strong>
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
                  {SITE_URL}
                </Link>
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
