"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { FormField, inputClassName, textareaClassName } from "@/components/forms";
import { formatAud } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  priceDisplay: string;
  active: boolean;
  sortOrder: number;
  galleryItemId: string | null;
  thumbnailUrl: string | null;
};

type GalleryItem = {
  id: string;
  title: string;
  imagePath: string;
};

const emptyForm = {
  name: "",
  description: "",
  priceAud: 45,
  active: true,
  sortOrder: 0,
  galleryItemId: "",
};

export default function AdminPricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const [productsRes, galleryRes] = await Promise.all([
      fetch("/api/products?admin=1"),
      fetch("/api/gallery?admin=1"),
    ]);
    const productsData = await productsRes.json();
    const galleryData = await galleryRes.json();
    if (productsRes.ok) setProducts(productsData.products ?? []);
    else setMessage(productsData.error ?? "Unable to load products");
    if (galleryRes.ok) setGallery(galleryData.items ?? []);
  }

  useEffect(() => {
    load().catch(() => setMessage("Unable to load products"));
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      priceAud: product.priceCents / 100,
      active: product.active,
      sortOrder: product.sortOrder,
      galleryItemId: product.galleryItemId ?? "",
    });
    setMessage("");
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      name: form.name,
      description: form.description,
      priceAud: form.priceAud,
      active: form.active,
      sortOrder: form.sortOrder,
      galleryItemId: form.galleryItemId || null,
    };

    const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "Unable to save product");
      return;
    }

    setProducts(data.products ?? []);
    setMessage(editingId ? "Product updated." : "Product created.");
    startCreate();
  }

  async function toggleActive(product: Product) {
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to update product");
      return;
    }
    setProducts(data.products ?? []);
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading
        title="Products & pricing"
        subtitle="Manage coating products: name, price, gallery thumbnail, and whether they are offered to customers."
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {products.length === 0 ? (
            <Card>
              <p className="text-stone-400">No products yet. Create Display Copper or another finish on the right.</p>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-copper/20 bg-stone-950">
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-600">No image</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="font-medium text-stone-100">{product.name}</h2>
                        <p className="mt-1 text-sm text-copper-light">{formatAud(product.priceCents)}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide ${
                          product.active
                            ? "border-emerald-500/40 text-emerald-300"
                            : "border-stone-600 text-stone-500"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {product.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-stone-400">{product.description}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => startEdit(product)}>
                        Edit
                      </Button>
                      <Button variant="ghost" onClick={() => toggleActive(product)}>
                        {product.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium text-stone-100">
              {editingId ? "Edit product" : "Add product"}
            </h2>
            {editingId ? (
              <button type="button" onClick={startCreate} className="text-sm text-copper-light hover:underline">
                Cancel edit
              </button>
            ) : null}
          </div>

          <form onSubmit={saveProduct} className="space-y-4">
            <FormField label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={inputClassName}
                placeholder="Display Copper"
              />
            </FormField>
            <FormField label="Description" hint="Shown on the homepage and order form.">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className={textareaClassName}
              />
            </FormField>
            <FormField label="Price (AUD)">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  step={0.01}
                  value={form.priceAud}
                  onChange={(e) => setForm({ ...form, priceAud: Number(e.target.value) })}
                  className={`${inputClassName} pl-7`}
                  required
                />
              </div>
            </FormField>
            <FormField label="Sort order" hint="Lower numbers appear first.">
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Gallery thumbnail" hint="Pick an existing gallery photo.">
              <select
                value={form.galleryItemId}
                onChange={(e) => setForm({ ...form, galleryItemId: e.target.value })}
                className={inputClassName}
              >
                <option value="">No thumbnail</option>
                {gallery.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </FormField>
            {form.galleryItemId ? (
              <img
                src={`/api/files/gallery/${gallery.find((g) => g.id === form.galleryItemId)?.imagePath ?? ""}`}
                alt=""
                className="h-24 w-24 rounded-md border border-copper/20 object-cover"
              />
            ) : null}
            <label className="flex items-center gap-3 text-sm text-stone-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active — visible to customers on the site and order form
            </label>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
            </Button>
          </form>
          {message ? <p className="mt-4 text-sm text-copper-light">{message}</p> : null}
        </Card>
      </div>
    </div>
  );
}
