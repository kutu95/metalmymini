"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, PageHeading, StatusBadge } from "@/components/ui";
import { PRODUCTION_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { formatAud, formatDateTime, productLabel } from "@/lib/format";
import { FormField, inputClassName, selectClassName, textareaClassName } from "@/components/forms";

type OrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  country: string;
  productOption: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: string;
  productionStatus: string;
  termsAccepted: boolean;
  publicGalleryConsentAccepted: boolean;
  adminNotes?: string | null;
  customerNotes?: string | null;
  trackingNumber?: string | null;
  uploadedFile: { id: string; originalFilename: string };
  statusHistory: Array<{ status: string; note?: string | null; createdAt: string }>;
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    productionStatus: "",
    paymentStatus: "",
    adminNotes: "",
    customerNotes: "",
    trackingNumber: "",
    statusNote: "",
  });

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setForm({
          productionStatus: data.order.productionStatus,
          paymentStatus: data.order.paymentStatus,
          adminNotes: data.order.adminNotes ?? "",
          customerNotes: data.order.customerNotes ?? "",
          trackingNumber: data.order.trackingNumber ?? "",
          statusNote: "",
        });
      })
      .catch(() => setOrder(null));
  }, [params.id]);

  async function saveOrder(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save");
      return;
    }
    setOrder(data.order);
    setMessage("Order updated");
  }

  async function uploadPhoto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/orders/${params.id}/photos`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    setMessage(response.ok ? "Photo uploaded" : data.error ?? "Upload failed");
  }

  if (!order) return <p className="text-stone-400">Loading order...</p>;

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading title={order.orderNumber} subtitle={`${order.customerName} · ${order.customerEmail}`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]} />
              <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus as keyof typeof PRODUCTION_STATUS_LABELS]} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div><dt className="text-stone-500">Product</dt><dd>{productLabel(order.productOption)}</dd></div>
              <div><dt className="text-stone-500">Quantity</dt><dd>{order.quantity}</dd></div>
              <div><dt className="text-stone-500">Total</dt><dd>{formatAud(order.totalPrice)}</dd></div>
              <div><dt className="text-stone-500">Country</dt><dd>{order.country}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-stone-400">{order.shippingAddress}</p>
            <p className="mt-4 text-sm text-stone-500">
              Terms accepted: {order.termsAccepted ? "Yes" : "No"} · Gallery consent: {order.publicGalleryConsentAccepted ? "Yes" : "No"}
            </p>
            <a
              href={`/api/files/models/${order.uploadedFile.id}`}
              className="mt-4 inline-block text-sm text-copper-light hover:underline"
            >
              Download {order.uploadedFile.originalFilename}
            </a>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Status history</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              {order.statusHistory.map((entry, index) => (
                <li key={`${entry.createdAt}-${index}`}>
                  {PRODUCTION_STATUS_LABELS[entry.status as keyof typeof PRODUCTION_STATUS_LABELS]} — {formatDateTime(entry.createdAt)}
                  {entry.note ? ` (${entry.note})` : ""}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <form onSubmit={saveOrder} className="space-y-4">
              <FormField label="Production status">
                <select
                  value={form.productionStatus}
                  onChange={(e) => setForm({ ...form, productionStatus: e.target.value })}
                  className={selectClassName}
                >
                  {Object.entries(PRODUCTION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Payment status">
                <select
                  value={form.paymentStatus}
                  onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                  className={selectClassName}
                >
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Tracking number">
                <input value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} className={inputClassName} />
              </FormField>
              <FormField label="Admin notes">
                <textarea value={form.adminNotes} onChange={(e) => setForm({ ...form, adminNotes: e.target.value })} rows={3} className={textareaClassName} />
              </FormField>
              <FormField label="Customer-facing notes">
                <textarea value={form.customerNotes} onChange={(e) => setForm({ ...form, customerNotes: e.target.value })} rows={3} className={textareaClassName} />
              </FormField>
              <FormField label="Status change note">
                <input value={form.statusNote} onChange={(e) => setForm({ ...form, statusNote: e.target.value })} className={inputClassName} />
              </FormField>
              <Button type="submit">Save changes</Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-medium">Upload finished photo</h2>
            <form onSubmit={uploadPhoto} className="mt-4 space-y-4">
              <input name="image" type="file" accept="image/*" required className={inputClassName} />
              <label className="flex items-center gap-2 text-sm text-stone-300">
                <input name="published" type="checkbox" value="true" />
                Publish to public gallery
              </label>
              <Button type="submit" variant="secondary">Upload photo</Button>
            </form>
          </Card>

          {message && <p className="text-sm text-copper-light">{message}</p>}
        </div>
      </div>
    </div>
  );
}
