import { JsonLd } from "@/components/JsonLd";
import { Card, PageHeading } from "@/components/ui";
import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_SECTIONS,
  getPrivacyPageJsonLd,
} from "@/lib/privacy-policy";
import { SUPPORT_EMAIL } from "@/lib/returns-policy";
import { SITE_NAME, SITE_URL, createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Metal My Mini collects, stores, and uses personal information for custom miniature orders, accounts, and the public gallery.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const effectiveDate = formatEffectiveDate(PRIVACY_POLICY_EFFECTIVE_DATE);

  return (
    <>
      <JsonLd data={getPrivacyPageJsonLd()} />

      <div>
        <PageHeading
          title="Privacy Policy"
          subtitle={`Effective date: ${effectiveDate} · Last updated: ${effectiveDate}`}
        />

        <div className="space-y-6">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <Card key={section.number}>
              <h2 className="text-xl font-medium text-stone-100">
                {section.number}. {section.title}
              </h2>
              {section.blocks.map((block, index) => {
                const key = `${section.number}-${block.type}-${index}`;

                if (block.type === "p") {
                  return (
                    <p key={key} className="mt-3 leading-relaxed text-stone-400">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "h3") {
                  return (
                    <h3 key={key} className="mt-6 text-base font-medium text-stone-200">
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === "ul") {
                  return (
                    <ul key={key} className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <div key={key} className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-stone-400">
                      <thead>
                        <tr className="border-b border-stone-700 text-stone-200">
                          {block.headers.map((header) => (
                            <th key={header} className="px-3 py-2 font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row.join("-")} className="border-b border-stone-800 align-top">
                            {row.map((cell) => (
                              <td key={cell} className="px-3 py-2 leading-relaxed">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </Card>
          ))}

          <Card>
            <h2 className="text-xl font-medium text-stone-100">Related policies</h2>
            <ul className="mt-3 space-y-2 text-stone-400">
              <li>
                <Link href="/terms" className="text-copper-light hover:underline">
                  Terms of Service
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
