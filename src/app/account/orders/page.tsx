"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading, StatusBadge } from "@/components/ui";
import { PAYMENT_STATUS_LABELS, PRODUCTION_STATUS_LABELS } from "@/lib/constants";
import { formatAud, formatDateTime, productLabel } from "@/lib/format";

type Order = {
  id: string;
  orderNumber: string;
  productOption: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: keyof typeof PAYMENT_STATUS_LABELS;
  productionStatus: keyof typeof PRODUCTION_STATUS_LABELS;
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load orders");
        setOrders(data.orders);
      })
      .catch((err) => setError(err.message));
  }, []);

  async function reorder(orderId: string) {
    const response = await fetch(`/api/orders/${orderId}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error ?? "Unable to reorder");
      return;
    }
    window.location.href = `/order/confirm?orderId=${data.orderId}&orderNumber=${data.orderNumber}`;
  }

  return (
    <div>
      <PageHeading title="My Orders" subtitle="View your orders and reorder from stored files." />
      {error && <p className="text-red-400">{error}</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-stone-100">{order.orderNumber}</h2>
                <p className="mt-1 text-sm text-stone-400">
                  {productLabel(order.productOption)} × {order.quantity} — {formatAud(order.totalPrice)}
                </p>
                <p className="mt-1 text-xs text-stone-500">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
                <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/order/status?orderNumber=${order.orderNumber}`} className="text-sm text-copper-light hover:underline">
                View status
              </Link>
              <Button variant="secondary" onClick={() => reorder(order.id)}>
                Reorder
              </Button>
            </div>
          </Card>
        ))}
        {!error && orders.length === 0 && (
          <Card>
            <p className="text-stone-400">No orders yet.</p>
            <Button href="/order" className="mt-4">
              Upload Your Mini
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
