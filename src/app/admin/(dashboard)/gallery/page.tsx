"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { productLabel } from "@/lib/format";
import { FormField, inputClassName, selectClassName, textareaClassName } from "@/components/forms";

type GalleryItem = {
  id: string;
  title: string;
  description?: string | null;
  finishType: string;
  imagePath: string;
  published: boolean;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [message, setMessage] = useState("");

  async function loadItems() {
    const response = await fetch("/api/gallery?admin=1");
    const data = await response.json();
    setItems(data.items ?? []);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function createItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("published", formData.get("published") ? "true" : "false");
    const response = await fetch("/api/gallery", { method: "POST", body: formData });
    const data = await response.json();
    setMessage(response.ok ? "Gallery item created" : data.error ?? "Unable to create item");
    if (response.ok) {
      event.currentTarget.reset();
      loadItems();
    }
  }

  async function togglePublish(item: GalleryItem) {
    await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, published: !item.published }),
    });
    loadItems();
  }

  async function deleteItem(id: string) {
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadItems();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading title="Gallery Manager" subtitle="Add, edit, publish, or remove gallery items." />

      <Card className="mb-8">
        <form onSubmit={createItem} className="grid gap-4 md:grid-cols-2">
          <FormField label="Title">
            <input name="title" required className={inputClassName} />
          </FormField>
          <FormField label="Finish type">
            <select name="finishType" className={selectClassName}>
              <option value="cosmetic_copper">Cosmetic Copper Finish</option>
              <option value="heavy_duty_copper">Heavy-Duty Copper Finish</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Description">
              <textarea name="description" rows={3} className={textareaClassName} />
            </FormField>
          </div>
          <FormField label="Image">
            <input name="image" type="file" accept="image/*" required className={inputClassName} />
          </FormField>
          <label className="flex items-center gap-2 self-end text-sm text-stone-300">
            <input name="published" type="checkbox" />
            Publish immediately
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Add gallery item</Button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-copper-light">{message}</p>}
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden p-0">
            <img src={`/api/files/gallery/${item.imagePath}`} alt={item.title} className="aspect-square w-full object-cover" />
            <div className="p-4">
              <h2 className="font-medium text-stone-100">{item.title}</h2>
              <p className="text-sm text-stone-400">{productLabel(item.finishType)}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => togglePublish(item)}>
                  {item.published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="ghost" onClick={() => deleteItem(item.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
