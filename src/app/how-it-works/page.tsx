import { Card, PageHeading } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, MAX_MODEL_DIMENSION_MM, ACCEPTED_FILE_TYPES } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "How It Works",
  description:
    "How I turn your STL, OBJ, or 3MF into a copper-plated tabletop mini — upload, file check, print, electroplate, and ship worldwide.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeading
        title="How It Works"
        subtitle="I copper-plate custom tabletop miniatures — your sculpt, UV resin print, real copper surface. I check every file before I print."
      />

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-medium text-stone-100">1. Upload and pay</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Choose your finish, upload your sculpt, enter shipping details, and submit. Payment is
            taken when you place the order.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">2. I check your file</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            After payment, I review your file myself for printability, size, and suitability for
            copper plating. Accepted formats: {ACCEPTED_FILE_TYPES.join(", ")}. Maximum size:{" "}
            {MAX_MODEL_DIMENSION_MM} mm in any dimension.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">3. Review outcomes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
            <li>
              <strong className="text-stone-200">Approved</strong> — I start production.
            </li>
            <li>
              <strong className="text-stone-200">More information needed</strong> — I&apos;ll get in
              touch for clarification.
            </li>
            <li>
              <strong className="text-stone-200">Extra charge required</strong> — unusual sculpts may
              need additional payment.
            </li>
            <li>
              <strong className="text-stone-200">Rejected and refunded</strong> — if the file can&apos;t
              reasonably be produced.
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">4. Production and shipping</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            I print approved orders in UV resin, electroplate the copper surface, polish, and pack.
            Shipping is at customer cost, worldwide. Tracking goes on when your order ships. Worth
            the wait — I do these one at a time.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">Order terms</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-stone-400">
            <li>{LEGAL_CHECKOUT_TEXT.review}</li>
            <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
            <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
          </ul>
          <p className="mt-4 text-sm text-stone-400">
            See our{" "}
            <Link href="/returns" className="text-copper-light hover:underline">
              Return and Refund Policy
            </Link>{" "}
            for full details on cancellations, defective items, and Australian Consumer Law rights.
          </p>
        </Card>
      </div>
    </div>
  );
}
