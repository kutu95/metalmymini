"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { PAYMENT_STATUS_LABELS, PRODUCTION_STATUS_LABELS } from "@/lib/constants";
import { formatAud, formatDateTime, productLabel } from "@/lib/format";

type OrderSummary = {
  id: string;
  orderNumber: string;
  productOption: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: keyof typeof PAYMENT_STATUS_LABELS;
  productionStatus: keyof typeof PRODUCTION_STATUS_LABELS;
  createdAt: string;
};

type OrderDetail = OrderSummary & {
  trackingNumber?: string | null;
  customerNotes?: string | null;
  statusHistory?: Array<{ status: string; note?: string | null; createdAt: string }>;
};

function OrderDetailCard({ order }: { order: OrderDetail }) {
  return (
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
  );
}

export function OrderStatusLookup() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"loading" | "logged-in" | "guest">("loading");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [guestOrder, setGuestOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");
  const [loadingGuest, setLoadingGuest] = useState(false);

  const loadOrderDetail = useCallback(async (orderId: string) => {
    setLoadingDetail(true);
    setError("");
    setSelectedOrder(null);

    const response = await fetch(`/api/orders/${orderId}`);
    const data = await response.json();
    setLoadingDetail(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to load order");
      return;
    }

    setSelectedOrder(data.order);
  }, []);

  useEffect(() => {
    fetch("/api/orders")
      .then(async (response) => {
        if (response.status === 401) {
          setMode("guest");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load orders");
        const loaded: OrderSummary[] = data.orders ?? [];
        setOrders(loaded);
        setMode("logged-in");

        const orderNumberParam = searchParams.get("orderNumber");
        if (orderNumberParam) {
          const match = loaded.find((o) => o.orderNumber === orderNumberParam);
          if (match) await loadOrderDetail(match.id);
        }
      })
      .catch((err) => {
        setError(err.message);
        setMode("guest");
      });
  }, [searchParams, loadOrderDetail]);

  async function handleGuestLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoadingGuest(true);
    setError("");
    setGuestOrder(null);

    const response = await fetch(
      `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
    );
    const data = await response.json();
    setLoadingGuest(false);

    if (!response.ok) {
      setError(data.error ?? "Order not found");
      return;
    }

    setGuestOrder(data.order);
  }

  if (mode === "loading") {
    return (
      <Card>
        <p className="text-stone-400">Loading...</p>
      </Card>
    );
  }

  if (mode === "logged-in") {
    return (
      <div className="space-y-6">
        {error && <p className="text-sm text-red-400">{error}</p>}

        {orders.length === 0 ? (
          <Card>
            <p className="text-stone-400">You don&apos;t have any commissions yet.</p>
            <Button href="/order" className="mt-4">
              Upload Your Mini
            </Button>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              <p className="text-sm text-stone-400">Select an order to view its status.</p>
              {orders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => loadOrderDetail(order.id)}
                  className={`w-full rounded-xl border p-5 text-left transition hover:border-copper/40 ${
                    selectedOrder?.id === order.id
                      ? "border-copper bg-copper/10"
                      : "border-copper/20 bg-charcoal"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-stone-100">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-stone-400">
                        {productLabel(order.productOption)} × {order.quantity} —{" "}
                        {formatAud(order.totalPrice)}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
                      <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {loadingDetail && (
              <Card>
                <p className="text-stone-400">Loading order details...</p>
              </Card>
            )}

            {selectedOrder && !loadingDetail && <OrderDetailCard order={selectedOrder} />}
          </>
        )}

        <p className="text-sm text-stone-500">
          Need to reorder?{" "}
          <Link href="/account/orders" className="text-copper-light hover:underline">
            View all orders
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <p className="mb-4 text-sm text-stone-400">
          Log in to see your orders automatically, or look up a guest order below.
        </p>
        <form onSubmit={handleGuestLookup} className="grid gap-4 md:grid-cols-2">
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
            <Button type="submit" disabled={loadingGuest}>
              {loadingGuest ? "Looking up..." : "Track Order"}
            </Button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <p className="mt-4 text-sm text-stone-500">
          Have an account?{" "}
          <Link href="/login" className="text-copper-light hover:underline">
            Log in
          </Link>{" "}
          to see all your orders.
        </p>
      </Card>

      {guestOrder && <OrderDetailCard order={guestOrder} />}
    </div>
  );
}
