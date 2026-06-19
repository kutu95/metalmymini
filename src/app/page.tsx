import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button, Card } from "@/components/ui";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { JsonLd } from "@/components/JsonLd";
import { TrustSignalGrid } from "@/components/workshop";
import {
  ABOUT_MAKER,
  FOUNDER,
  LEGAL_CHECKOUT_TEXT,
  PROCESS_STEPS,
  PRODUCTS,
  TRUST_SIGNALS,
} from "@/lib/constants";
import { productLabel } from "@/lib/format";
import { createPageMetadata, DEFAULT_DESCRIPTION, getHomeJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Custom Copper-Plated Miniatures",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

async function getHeroImages() {
  try {
    return await prisma.heroImage.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

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
  const [heroImages, gallery] = await Promise.all([getHeroImages(), getGalleryPreview()]);

  const heroSlides =
    heroImages.length > 0
      ? heroImages.map((image) => ({
          id: image.id,
          src: `/api/files/hero/${image.imagePath}`,
          alt: image.altText ?? "Copper-plated tabletop miniature",
        }))
      : [{ id: "fallback", src: "/hero.jpg", alt: "Copper-plated tabletop miniature" }];

  return (
    <>
      <JsonLd data={getHomeJsonLd()} />
      <div className="space-y-20">
      {/* 1. Product — Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-copper-light">
            Custom copper-plated miniatures
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-stone-100 md:text-5xl">
            Custom miniatures with a premium copper-plated finish.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-400">
            Upload your STL, OBJ, or 3MF. We print in UV resin, apply specialist copper plating,
            and finish each piece to a premium standard — worldwide shipping available.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/order">Upload Your Mini</Button>
            <Button href="/how-it-works" variant="secondary">
              How It Works
            </Button>
          </div>
        </div>
        <HeroSlideshow images={heroSlides} />
      </section>

      {/* Product — Finishes */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">Finish options</h2>
        <p className="mb-8 max-w-2xl text-stone-400">
          Two copper plating options for different display and handling requirements.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.values(PRODUCTS).map((product) => (
            <Card key={product.id}>
              <p className="text-sm uppercase tracking-wide text-copper-light">{product.priceDisplay}</p>
              <h3 className="mt-2 text-xl font-medium text-stone-100">{product.name}</h3>
              <p className="mt-3 leading-relaxed text-stone-400">{product.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Results — Gallery */}
      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-100">Completed work</h2>
            <p className="mt-2 text-stone-400">
              Real photographs of finished miniatures from customer orders.
            </p>
          </div>
          <Link href="/gallery" className="text-sm text-copper-light hover:underline">
            View gallery
          </Link>
        </div>
        {gallery.length === 0 ? (
          <Card>
            <p className="text-stone-400">Completed miniatures will appear here soon.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {gallery.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0">
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

      {/* Trust */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">Why Metal My Mini</h2>
        <p className="mb-8 max-w-2xl text-stone-400">
          A specialist service with expert review and premium finishing — backed by a real maker.
        </p>
        <TrustSignalGrid signals={TRUST_SIGNALS} />
      </section>

      {/* 3. Process */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">How it works</h2>
        <p className="mb-8 text-stone-400">From upload to delivery in six steps.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <Card key={step.step}>
              <p className="text-sm text-copper-light">Step {step.step}</p>
              <h3 className="mt-2 font-medium text-stone-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">{step.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Person — compact About the Maker */}
      <section className="rounded-xl border border-copper/15 bg-charcoal/50 p-8 md:p-10">
        <h2 className="text-lg font-semibold text-stone-100">About the maker</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone-400">{ABOUT_MAKER}</p>
        <p className="mt-4 text-sm text-stone-500">— {FOUNDER.name}, Metal My Mini</p>
      </section>

      {/* Order notes */}
      <section className="rounded-xl border border-copper/15 bg-charcoal/50 p-8 md:p-10">
        <h2 className="text-xl font-semibold text-stone-100">Before you order</h2>
        <ul className="mt-6 space-y-4 text-sm leading-relaxed text-stone-400">
          <li>{LEGAL_CHECKOUT_TEXT.review}</li>
          <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
          <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
        </ul>
        <div className="mt-8">
          <Button href="/order">Upload Your Mini</Button>
        </div>
      </section>
    </div>
    </>
  );
}
