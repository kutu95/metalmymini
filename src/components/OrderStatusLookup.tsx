"use client";

import { useState } from "react";
import { Button, Card, StatusBadge } from "@/components/ui";
import { PAYMENT_STATUS_LABELS, PRODUCTION_STATUS_LABELS } from "@/lib/constants";
import { formatAud, formatDateTime, productLabel } from "@/lib/format";

type OrderResult = {
  orderNumber: string;
  productOption: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: keyof typeof PAYMENT_STATUS_LABELS;
  productionStatus: keyof typeof PRODUCTION_STATUS_LABELS;
  trackingNumber?: string | null;
  customerNotes?: string | null;
  statusHistory?: Array<{ status: string; note?: string | null; createdAt: string }>;
};

export function OrderStatusLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    const response = await fetch(
      `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
    );
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Order not found");
      return;
    }

    setOrder(data.order);
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleLookup} className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm text-stone-300">Order number</span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              className="w-full rounded-md border border-stone-700 bg-black px-3 py-2"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-stone-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-stone-700 bg-black px-3 py-2"
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Looking up..." : "Track Order"}
            </Button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </Card>

      {order && (
        <Card>
          <div className="flex flex-wrap gap-3">
            <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
            <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
          </div>
          <h2 className="mt-4 text-xl font-medium text-stone-100">{order.orderNumber}</h2>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-stone-500">Product</dt>
              <dd className="text-stone-200">{productLabel(order.productOption)}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Quantity</dt>
              <dd className="text-stone-200">{order.quantity}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Total</dt>
              <dd className="text-stone-200">{formatAud(order.totalPrice)}</dd>
            </div>
            {order.trackingNumber && (
              <div>
                <dt className="text-stone-500">Tracking</dt>
                <dd className="text-stone-200">{order.trackingNumber}</dd>
              </div>
            )}
          </dl>
          {order.customerNotes && (
            <p className="mt-4 rounded-md border border-copper/20 bg-black/40 p-4 text-sm text-stone-300">
              {order.customerNotes}
            </p>
          )}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm uppercase tracking-wide text-stone-500">Status history</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-400">
                {order.statusHistory.map((entry, index) => (
                  <li key={`${entry.createdAt}-${index}`}>
                    {PRODUCTION_STATUS_LABELS[entry.status as keyof typeof PRODUCTION_STATUS_LABELS]} —{" "}
                    {formatDateTime(entry.createdAt)}
                    {entry.note ? ` (${entry.note})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
