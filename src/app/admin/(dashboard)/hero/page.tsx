"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, PageHeading } from "@/components/ui";
import { FormField, inputClassName } from "@/components/forms";

type HeroImage = {
  id: string;
  imagePath: string;
  altText?: string | null;
  sortOrder: number;
  published: boolean;
};

export default function AdminHeroPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadImages() {
    const response = await fetch("/api/hero-images?admin=1");
    const data = await response.json();
    setImages(data.images ?? []);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function uploadImages(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/hero-images", { method: "POST", body: formData });
    const data = await response.json();
    setLoading(false);
    setMessage(
      response.ok
        ? `Uploaded ${data.images?.length ?? 0} image(s)`
        : data.error ?? "Unable to upload images",
    );

    if (response.ok) {
      event.currentTarget.reset();
      loadImages();
    }
  }

  async function togglePublish(image: HeroImage) {
    await fetch("/api/hero-images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...image, published: !image.published }),
    });
    loadImages();
  }

  async function moveImage(id: string, direction: "up" | "down") {
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const current = images[index];
    const swap = images[swapIndex];

    await Promise.all([
      fetch("/api/hero-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, sortOrder: swap.sortOrder }),
      }),
      fetch("/api/hero-images", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...swap, sortOrder: current.sortOrder }),
      }),
    ]);
    loadImages();
  }

  async function deleteImage(id: string) {
    await fetch("/api/hero-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadImages();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-copper-light hover:underline">
        ← Back to dashboard
      </Link>
      <PageHeading
        title="Hero Images"
        subtitle="Manage homepage hero images. Multiple images rotate every 2.5 seconds."
      />

      <Card className="mb-8">
        <form onSubmit={uploadImages} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="Images" hint="Select one or more JPG, PNG, or WebP files.">
              <input
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                required
                className={inputClassName}
              />
            </FormField>
          </div>
          <FormField label="Alt text (optional)" hint="Used for accessibility on all uploaded images.">
            <input name="altText" className={inputClassName} />
          </FormField>
          <label className="flex items-center gap-2 self-end text-sm text-stone-300">
            <input name="published" type="checkbox" defaultChecked />
            Publish immediately
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload hero images"}
            </Button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm text-copper-light">{message}</p>}
      </Card>

      {images.length === 0 ? (
        <Card>
          <p className="text-stone-400">
            No hero images uploaded yet. The homepage will fall back to{" "}
            <code className="text-stone-300">public/hero.jpg</code> until images are added here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Card key={image.id} className="overflow-hidden p-0">
              <img
                src={`/api/files/hero/${image.imagePath}`}
                alt={image.altText ?? "Hero image"}
                className="aspect-square w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-stone-400">
                  Order {image.sortOrder + 1}
                  {!image.published && " · Unpublished"}
                </p>
                {image.altText && (
                  <p className="mt-1 text-sm text-stone-500">{image.altText}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => moveImage(image.id, "up")} disabled={index === 0}>
                    ↑
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => moveImage(image.id, "down")}
                    disabled={index === images.length - 1}
                  >
                    ↓
                  </Button>
                  <Button variant="secondary" onClick={() => togglePublish(image)}>
                    {image.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="ghost" onClick={() => deleteImage(image.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
