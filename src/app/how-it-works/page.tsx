import { Card, PageHeading } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, MAX_MODEL_DIMENSION_MM, ACCEPTED_FILE_TYPES } from "@/lib/constants";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "How It Works",
  description:
    "Learn how Metal My Mini turns your STL, OBJ, or 3MF file into a copper-plated tabletop miniature — upload, expert review, production, and worldwide shipping.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeading
        title="How It Works"
        subtitle="Metal My Mini is a specialist copper plating service for custom tabletop miniatures. Every file is reviewed before production begins."
      />

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-medium text-stone-100">1. Upload and pay</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Choose your finish, upload your model, enter shipping details, and submit your order.
            Payment is taken at submission through secure checkout.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">2. Expert file review</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            After payment, each file is reviewed for printability, size, and suitability for copper
            plating. Accepted formats: {ACCEPTED_FILE_TYPES.join(", ")}. Maximum size:{" "}
            {MAX_MODEL_DIMENSION_MM} mm in any dimension.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">3. Review outcomes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
            <li><strong className="text-stone-200">Approved</strong> — production begins.</li>
            <li><strong className="text-stone-200">More information needed</strong> — you will be contacted for clarification.</li>
            <li><strong className="text-stone-200">Extra charge required</strong> — unusual models may require additional payment.</li>
            <li><strong className="text-stone-200">Rejected and refunded</strong> — if the file cannot reasonably be produced.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">4. Production and shipping</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Approved orders are printed in UV resin, copper plated, polished, and packaged.
            Shipping is at customer cost, worldwide. Tracking is added when your order ships.
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
            for full details on cancellations, defective items, and Australian Consumer Law
            rights.
          </p>
        </Card>
      </div>
    </div>
  );
}
