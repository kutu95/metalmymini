import { Card, PageHeading } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, MAX_MODEL_DIMENSION_MM, ACCEPTED_FILE_TYPES } from "@/lib/constants";

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeading
        title="How It Works"
        subtitle="Metal My Mini is a manufacturing service — not just a print farm. Every file is reviewed by hand before production begins."
      />

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-medium text-stone-100">1. Upload and pay on submission</h2>
          <p className="mt-3 text-stone-400">
            Choose your finish, upload your model, enter shipping details, and submit your order.
            Payment is taken at submission. Stripe checkout will handle live payments; development
            mode includes a safe payment simulation.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">2. Manual file review</h2>
          <p className="mt-3 text-stone-400">
            After payment, your file enters human review. We check printability, size limits, and
            suitability for copper plating. Accepted file types: {ACCEPTED_FILE_TYPES.join(", ")}.
            Maximum size: {MAX_MODEL_DIMENSION_MM} mm in any dimension.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">3. Possible review outcomes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
            <li><strong className="text-stone-200">Approved</strong> — production begins.</li>
            <li><strong className="text-stone-200">More information needed</strong> — we contact you for clarification.</li>
            <li><strong className="text-stone-200">Extra charge required</strong> — unusual processing may need additional payment.</li>
            <li><strong className="text-stone-200">Rejected and refunded</strong> — if the file cannot reasonably be produced.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">4. Production and shipping</h2>
          <p className="mt-3 text-stone-400">
            Approved orders move through print, plate, polish, and packaging. Shipping is paid by
            the customer and sent worldwide. Tracking is added manually when your order ships.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-medium text-stone-100">Customer commitments</h2>
          <ul className="mt-3 space-y-3 text-sm text-stone-400">
            <li>{LEGAL_CHECKOUT_TEXT.review}</li>
            <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
            <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
