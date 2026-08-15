"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { formatAud } from "@/lib/format";

type CheckoutPreview = {
  orderNumber: string;
  productLabel: string;
  quantity: number;
  unitPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentStatus: string;
  stripeConfigured: boolean;
  devPaymentAllowed: boolean;
};

export function PaymentConfirm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const cancelled = searchParams.get("cancelled") === "1";

  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!orderId || !orderNumber) {
      setLoadError("Missing order details.");
      return;
    }

    fetch(
      `/api/payments/checkout?orderId=${encodeURIComponent(orderId)}&orderNumber=${encodeURIComponent(orderNumber)}`,
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load order");
        setPreview(data);
        if (data.paymentStatus === "paid") {
          router.replace(`/order/status?orderNumber=${encodeURIComponent(orderNumber)}&paid=1`);
        }
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Unable to load order");
      });
  }, [orderId, orderNumber, router]);

  async function startCheckout() {
    if (!orderId || !orderNumber) return;
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, orderNumber }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Unable to start payment");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setMessage("Stripe did not return a checkout URL");
  }

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

  const showDevSimulate = Boolean(preview?.devPaymentAllowed);

  return (
    <Card>
      <StatusBadge label="Awaiting payment" />
      <h1 className="mt-4 text-2xl font-semibold text-stone-100">Complete your order</h1>

      {cancelled ? (
        <p className="mt-3 text-sm text-amber-300">
          Payment was cancelled. You can try again when you&apos;re ready.
        </p>
      ) : null}

      {loadError ? <p className="mt-3 text-sm text-red-400">{loadError}</p> : null}

      {preview ? (
        <>
          <p className="mt-3 text-stone-400">
            Order <strong className="text-stone-200">{preview.orderNumber}</strong> is ready for
            payment.
          </p>
          <div className="mt-4 space-y-2 text-sm text-stone-400">
            <div className="flex justify-between gap-4">
              <span>
                {preview.productLabel} × {preview.quantity}
              </span>
              <span>{formatAud(preview.unitPrice * preview.quantity)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Shipping</span>
              <span>{formatAud(preview.shippingPrice)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-stone-700 pt-2 text-stone-100">
              <span className="font-medium">Total</span>
              <span className="font-medium">{formatAud(preview.totalPrice)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            After payment, your file will be reviewed and you will be contacted if anything needs
            attention.
          </p>
        </>
      ) : !loadError ? (
        <p className="mt-3 text-stone-400">Loading order…</p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={loading || !preview || !orderId} onClick={startCheckout}>
          {loading ? "Redirecting…" : "Pay with Stripe"}
        </Button>
        {showDevSimulate ? (
          <>
            <Button
              variant="secondary"
              disabled={loading || !orderId}
              onClick={() => simulatePayment(true)}
            >
              Simulate Payment Success
            </Button>
            <Button
              variant="ghost"
              disabled={loading || !orderId}
              onClick={() => simulatePayment(false)}
            >
              Simulate Payment Failure
            </Button>
          </>
        ) : null}
      </div>

      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
    </Card>
  );
}
