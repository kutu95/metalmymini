import { prisma } from "@/lib/db";
import { Card, PageHeading } from "@/components/ui";
import { formatDate, productLabel } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Finished pieces from real orders. Each one is a customer's own model, printed and copper-plated here.",
  path: "/gallery",
});

async function getGalleryItems() {
  try {
    return await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      <PageHeading
        title="Gallery"
        subtitle="Finished pieces from real orders. Each one is a customer's own model, printed and copper-plated here."
      />

      {items.length === 0 ? (
        <Card>
          <p className="text-stone-400">Finished pieces will show up here as I complete orders.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden p-0">
              <img
                src={`/api/files/gallery/${item.imagePath}`}
                alt={item.title}
                className="aspect-square w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-medium text-stone-100">{item.title}</h2>
                <p className="mt-1 text-sm text-copper-light">
                  {productLabel(item.product?.name)} · Completed {formatDate(item.createdAt)}
                </p>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
