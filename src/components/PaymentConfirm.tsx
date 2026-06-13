"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { formatAud } from "@/lib/format";

export function PaymentConfirm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function simulatePayment(success: boolean) {
    if (!orderId) return;
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/payments/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, success }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Payment failed");
      return;
    }

    router.push(`/order/status?orderNumber=${orderNumber}&paid=1`);
  }

  return (
    <Card>
      <StatusBadge label="Awaiting payment" />
      <h1 className="mt-4 text-2xl font-semibold text-stone-100">Complete your order</h1>
      <p className="mt-3 text-stone-400">
        Order <strong className="text-stone-200">{orderNumber}</strong> is ready for payment.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        After payment, your file will be reviewed and you will be contacted if anything needs attention before production.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={loading} onClick={() => simulatePayment(true)}>
          Simulate Payment Success
        </Button>
        <Button variant="secondary" disabled={loading} onClick={() => simulatePayment(false)}>
          Simulate Payment Failure
        </Button>
      </div>

      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
    </Card>
  );
}
