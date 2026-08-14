import { Card, PageHeading } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, MAX_MODEL_DIMENSION_MM } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "How It Works",
  description:
    "Upload your STL, OBJ, or 3MF. I check the file, print it in resin, plate it in real copper, and ship within Australia.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeading title="How It Works" subtitle="Every file is reviewed before anything is printed." />

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-medium text-stone-100">1. Upload and pay</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Upload your model, add shipping details, and submit. Payment is taken at submission
            through secure checkout.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">2. File review</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            After payment, I check your file for printability, size, and how well it&apos;ll take
            copper. Accepted formats: STL, OBJ, 3MF. Maximum size: {MAX_MODEL_DIMENSION_MM} mm in
            any dimension.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">3. What happens next</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
            <li>
              <strong className="text-stone-200">Approved</strong> — I start production.
            </li>
            <li>
              <strong className="text-stone-200">Need more info</strong> — I&apos;ll get in touch for
              clarification.
            </li>
            <li>
              <strong className="text-stone-200">Extra charge</strong> — unusual models may need
              additional payment before I proceed.
            </li>
            <li>
              <strong className="text-stone-200">Can&apos;t be done</strong> — if your file can&apos;t
              reasonably be produced, I cancel and refund.
            </li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">4. Print, plate, ship</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Approved orders are printed in UV resin, copper-plated, polished, and packed. Shipping
            is at cost within Australia, with tracking added when it ships.
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
            See the{" "}
            <Link href="/returns" className="text-copper-light hover:underline">
              Refund Policy
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-copper-light hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/terms" className="text-copper-light hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
