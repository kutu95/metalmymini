"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, StatusBadge } from "@/components/ui";
import { OrderTrackingView, type OrderTrackingData } from "@/components/OrderTrackingView";
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

type OrderStatusLookupProps = {
  isLoggedIn: boolean;
};

export function OrderStatusLookup({ isLoggedIn }: OrderStatusLookupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<OrderTrackingData | null>(null);
  const [loadingList, setLoadingList] = useState(isLoggedIn);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [guestTracking, setGuestTracking] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState("");
  const [loadingGuest, setLoadingGuest] = useState(false);

  const loadTracking = useCallback(async (orderId: string, orderNumberForUrl: string) => {
    setLoadingTracking(true);
    setError("");

    const response = await fetch(`/api/orders/${orderId}`);
    const data = await response.json();
    setLoadingTracking(false);

    if (!response.ok) {
      setTrackingOrder(null);
      setError(data.error ?? "Unable to load tracking");
      return;
    }

    setTrackingOrder(data.order);
    if (searchParams.get("orderNumber") !== orderNumberForUrl) {
      router.replace(`/order/status?orderNumber=${encodeURIComponent(orderNumberForUrl)}`, {
        scroll: false,
      });
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    setLoadingList(true);

    fetch("/api/orders")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load orders");
        if (cancelled) return;
        setOrders(data.orders ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unable to load orders");
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || loadingList || orders.length === 0 || !orderNumberParam) return;
    if (trackingOrder?.orderNumber === orderNumberParam) return;

    const match = orders.find((o) => o.orderNumber === orderNumberParam);
    if (match) void loadTracking(match.id, match.orderNumber);
  }, [isLoggedIn, loadingList, orders, orderNumberParam, trackingOrder?.orderNumber, loadTracking]);

  function handleSelectOrder(order: OrderSummary) {
    void loadTracking(order.id, order.orderNumber);
  }

  function handleBackToList() {
    setTrackingOrder(null);
    setError("");
    router.replace("/order/status", { scroll: false });
  }

  async function handleGuestLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoadingGuest(true);
    setError("");
    setGuestTracking(null);

    const response = await fetch(
      `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
    );
    const data = await response.json();
    setLoadingGuest(false);

    if (!response.ok) {
      setError(data.error ?? "Order not found");
      return;
    }

    setGuestTracking(data.order);
  }

  if (isLoggedIn) {
    if (loadingList && !trackingOrder) {
      return (
        <Card>
          <p className="text-stone-400">Loading your orders...</p>
        </Card>
      );
    }

    if (trackingOrder || loadingTracking) {
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleBackToList}
            className="text-sm text-copper-light hover:underline"
          >
            ← Back to your orders
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {loadingTracking ? (
            <Card>
              <p className="text-stone-400">Loading tracking updates...</p>
            </Card>
          ) : (
            trackingOrder && <OrderTrackingView order={trackingOrder} />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {error && <p className="text-sm text-red-400">{error}</p>}

        {orders.length === 0 ? (
          <Card>
            <p className="text-stone-400">You don&apos;t have any orders yet.</p>
            <Button href="/order" className="mt-4">
              Upload Your Mini
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stone-400">Select an order to view tracking updates.</p>
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => handleSelectOrder(order)}
                className="w-full rounded-xl border border-copper/20 bg-charcoal p-5 text-left transition hover:border-copper/40"
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
                    <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
                    <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-stone-500">
          Order details and reordering are on{" "}
          <Link href="/account/orders" className="text-copper-light hover:underline">
            My Orders
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {guestTracking ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setGuestTracking(null);
              setError("");
            }}
            className="text-sm text-copper-light hover:underline"
          >
            ← Look up another order
          </button>
          <OrderTrackingView order={guestTracking} />
        </div>
      ) : (
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
      )}
    </div>
  );
}
