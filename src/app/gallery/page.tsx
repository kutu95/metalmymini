import { prisma } from "@/lib/db";
import { Card, PageHeading } from "@/components/ui";
import { formatDate, productLabel } from "@/lib/format";

async function getGalleryItems() {
  try {
    return await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
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
        subtitle="Photographs of minis I've finished at the bench — real work for real customers."
      />

      {items.length === 0 ? (
        <Card className="workshop-card">
          <p className="text-stone-400">
            I&apos;m building this gallery as I photograph completed pieces. Check back soon.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="workshop-card overflow-hidden p-0">
              <img
                src={`/api/files/gallery/${item.imagePath}`}
                alt={item.title}
                className="aspect-square w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-medium text-stone-100">{item.title}</h2>
                <p className="mt-1 text-sm text-copper-light">{productLabel(item.finishType)}</p>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.description}</p>
                )}
                <p className="mt-4 text-xs uppercase tracking-wide text-stone-500">
                  Finished {formatDate(item.createdAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
