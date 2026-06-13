import { Card, PageHeading } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, MAX_MODEL_DIMENSION_MM, ACCEPTED_FILE_TYPES } from "@/lib/constants";

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeading
        title="How I Work"
        subtitle="Metal My Mini is my workshop — not a print farm. I review every file myself before anything goes to the printer."
      />

      <div className="grid gap-6">
        <Card className="workshop-card">
          <h2 className="text-xl font-medium text-stone-100">1. You send your model and pay</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Pick your finish, upload your file, add your shipping details, and submit your commission.
            Payment is taken when you order. I use secure checkout — you&apos;ll get a confirmation
            straight away.
          </p>
        </Card>

        <Card className="workshop-card">
          <h2 className="text-xl font-medium text-stone-100">2. I review your file by hand</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            After payment, I personally check your model — printability, size, and whether it will
            plate well. I accept {ACCEPTED_FILE_TYPES.join(", ")} files up to{" "}
            {MAX_MODEL_DIMENSION_MM} mm in any dimension.
          </p>
        </Card>

        <Card className="workshop-card">
          <h2 className="text-xl font-medium text-stone-100">3. What can happen next</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-400">
            <li>
              <strong className="text-stone-200">Approved</strong> — I start printing and plating.
            </li>
            <li>
              <strong className="text-stone-200">I need more info</strong> — I&apos;ll email you with
              a question.
            </li>
            <li>
              <strong className="text-stone-200">Extra work required</strong> — unusual models may
              need additional payment; I&apos;ll explain why.
            </li>
            <li>
              <strong className="text-stone-200">Can&apos;t be made</strong> — if the file
              won&apos;t work and we can&apos;t fix it, I&apos;ll refund you.
            </li>
          </ul>
        </Card>

        <Card className="workshop-card">
          <h2 className="text-xl font-medium text-stone-100">4. Print, plate, pack, ship</h2>
          <p className="mt-3 leading-relaxed text-stone-400">
            Approved commissions go through my usual bench process: resin print, copper plate, polish,
            and careful packing. Shipping is at your cost, worldwide. When your parcel goes out, I add
            the tracking number to your order.
          </p>
        </Card>

        <Card className="workshop-card">
          <h2 className="text-xl font-medium text-stone-100">A note before you order</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-stone-400">
            <li>{LEGAL_CHECKOUT_TEXT.review}</li>
            <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
            <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
