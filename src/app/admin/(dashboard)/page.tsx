"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading, StatusBadge } from "@/components/ui";
import { PRODUCTION_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { formatAud, formatDateTime } from "@/lib/format";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productionStatus: keyof typeof PRODUCTION_STATUS_LABELS;
  paymentStatus: keyof typeof PAYMENT_STATUS_LABELS;
  totalPrice: number;
  createdAt: string;
  uploadedFile: { originalFilename: string };
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  const filtered = orders.filter((order) => {
    const matchesStatus = !filter || order.productionStatus === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.uploadedFile.originalFilename.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <PageHeading title="Admin Dashboard" subtitle="Manage orders, review files, and update production status." />
        <div className="flex gap-3">
          <Button href="/admin/hero" variant="secondary">
            Hero Images
          </Button>
          <Button href="/admin/gallery" variant="secondary">
            Gallery Manager
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number, email, or filename"
            className="rounded-md border border-stone-700 bg-black px-3 py-2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-stone-700 bg-black px-3 py-2"
          >
            <option value="">All statuses</option>
            {Object.entries(PRODUCTION_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filtered.map((order) => (
          <Card key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href={`/admin/orders/${order.id}`} className="text-lg font-medium text-copper-light hover:underline">
                  {order.orderNumber}
                </Link>
                <p className="mt-1 text-sm text-stone-400">
                  {order.customerName} — {order.customerEmail}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {order.uploadedFile.originalFilename} · {formatDateTime(order.createdAt)} · {formatAud(order.totalPrice)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
                <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
