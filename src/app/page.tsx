import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button, Card } from "@/components/ui";
import { LEGAL_CHECKOUT_TEXT, PROCESS_STEPS, PRODUCTS } from "@/lib/constants";
import { productLabel } from "@/lib/format";

async function getGalleryPreview() {
  try {
    return await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const gallery = await getGalleryPreview();

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-copper-light">
            Custom copper-plated miniatures
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-stone-100 md:text-5xl">
            Turn your custom tabletop miniature into copper-plated metal.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-400">
            Upload your STL, OBJ, or 3MF. We print in UV resin, copper plate, finish, and ship
            worldwide. Built for DND players and collectors who want something beyond standard
            plastic.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/order">Upload Your Mini</Button>
            <Button href="/how-it-works" variant="secondary">
              How It Works
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-copper/30 bg-gradient-to-br from-charcoal to-black p-8">
          <div className="aspect-square rounded-xl border border-dashed border-copper/40 bg-black/40 p-8 text-center">
            <p className="text-sm uppercase tracking-widest text-copper-light">Craft preview</p>
            <p className="mt-6 text-stone-400">
              Premium copper finish on custom resin prints. Your hero, plated in metal.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-stone-100">Finish Options</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.values(PRODUCTS).map((product) => (
            <Card key={product.id}>
              <p className="text-sm uppercase tracking-wide text-copper-light">{product.priceDisplay}</p>
              <h3 className="mt-2 text-xl font-medium text-stone-100">{product.name}</h3>
              <p className="mt-3 text-stone-400">{product.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-stone-100">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <Card key={step.step}>
              <p className="text-sm text-copper-light">Step {step.step}</p>
              <h3 className="mt-2 font-medium text-stone-100">{step.title}</h3>
              <p className="mt-2 text-sm text-stone-400">{step.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-stone-100">Gallery</h2>
          <Link href="/gallery" className="text-sm text-copper-light hover:underline">
            View all
          </Link>
        </div>
        {gallery.length === 0 ? (
          <Card>
            <p className="text-stone-400">Completed miniatures will appear here soon.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {gallery.map((item) => (
              <Card key={item.id} className="p-0 overflow-hidden">
                <img
                  src={`/api/files/gallery/${item.imagePath}`}
                  alt={item.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-stone-100">{item.title}</h3>
                  <p className="mt-1 text-sm text-stone-400">{productLabel(item.finishType)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-copper/20 bg-charcoal p-8">
        <h2 className="text-xl font-semibold text-stone-100">Before you order</h2>
        <ul className="mt-4 space-y-3 text-sm text-stone-400">
          <li>{LEGAL_CHECKOUT_TEXT.review}</li>
          <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
          <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
        </ul>
      </section>
    </div>
  );
}
