import { Suspense } from "react";
import { PageHeading } from "@/components/ui";
import { PaymentConfirm } from "@/components/PaymentConfirm";

export default function OrderConfirmPage() {
  return (
    <div>
      <PageHeading title="Payment" subtitle="Complete payment to begin file review." />
      <Suspense>
        <PaymentConfirm />
      </Suspense>
    </div>
  );
}
