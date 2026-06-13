import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button, Card } from "@/components/ui";
import { PhotoPlaceholder, TrustSignalGrid } from "@/components/workshop";
import {
  FOUNDER,
  FOUNDER_POINTS,
  LEGAL_CHECKOUT_TEXT,
  PROCESS_STEPS,
  PRODUCTS,
  TRUST_SIGNALS,
  WORKSHOP_STORY,
} from "@/lib/constants";
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
    <div className="space-y-20">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-copper-light">
            Shay&apos;s workshop
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-stone-100 md:text-5xl">
            Commission a copper-plated miniature from a maker who plays the game too.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-400">
            Send me your STL, OBJ, or 3MF. I&apos;ll print it in resin, plate it in copper, and
            finish it by hand — one piece at a time, at my bench.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/order">Commission Your Mini</Button>
            <Button href="/how-it-works" variant="secondary">
              How I Work
            </Button>
          </div>
        </div>
        <PhotoPlaceholder
          aspect="square"
          label="Finished piece"
          caption="Close-up of a completed copper-plated miniature — real photo coming soon."
        />
      </section>

      {/* Meet Shay */}
      <section className="workshop-card grid gap-10 rounded-2xl border border-copper/20 bg-charcoal/60 p-8 md:grid-cols-[minmax(0,240px)_1fr] md:p-10">
        <PhotoPlaceholder
          aspect="portrait"
          label="Portrait"
          caption="Photo of Shay — coming soon."
          className="mx-auto w-full max-w-[240px]"
        />
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-copper-light">Meet {FOUNDER.name}</p>
          <h2 className="mt-2 text-3xl font-semibold text-stone-100">
            The person behind your miniature
          </h2>
          <p className="mt-4 text-stone-400">{FOUNDER.tagline}</p>
          <ul className="mt-6 space-y-3">
            {FOUNDER_POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-stone-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Workshop story */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-stone-100 md:text-3xl">
            {WORKSHOP_STORY.heading}
          </h2>
          <div className="mt-6 space-y-4 text-stone-400 leading-relaxed">
            {WORKSHOP_STORY.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PhotoPlaceholder
            aspect="wide"
            label="At the bench"
            caption="Workbench photo — coming soon."
            className="sm:col-span-2"
          />
          <PhotoPlaceholder
            aspect="square"
            label="Plating detail"
            caption="Close-up of copper finish."
          />
          <PhotoPlaceholder
            aspect="square"
            label="In the workshop"
            caption="Behind-the-scenes."
          />
        </div>
      </section>

      {/* Trust */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">Why people trust the workshop</h2>
        <p className="mb-8 max-w-2xl text-stone-400">
          No automated queue. No anonymous fulfilment centre. Just me, your file, and the bench.
        </p>
        <TrustSignalGrid signals={TRUST_SIGNALS} />
      </section>

      {/* Finishes */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">Choose your finish</h2>
        <p className="mb-8 text-stone-400">Two copper options — both finished by hand.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.values(PRODUCTS).map((product) => (
            <Card key={product.id} className="workshop-card">
              <p className="text-sm uppercase tracking-wide text-copper-light">{product.priceDisplay}</p>
              <h3 className="mt-2 text-xl font-medium text-stone-100">{product.name}</h3>
              <p className="mt-3 leading-relaxed text-stone-400">{product.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section>
        <h2 className="mb-2 text-2xl font-semibold text-stone-100">From your file to your table</h2>
        <p className="mb-8 text-stone-400">What happens after you send me a model.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <Card key={step.step} className="workshop-card">
              <p className="text-sm text-copper-light">Step {step.step}</p>
              <h3 className="mt-2 font-medium text-stone-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">{step.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-100">Pieces from the bench</h2>
            <p className="mt-2 text-stone-400">Real photographs of minis I&apos;ve finished for customers.</p>
          </div>
          <Link href="/gallery" className="text-sm text-copper-light hover:underline">
            View gallery
          </Link>
        </div>
        {gallery.length === 0 ? (
          <Card className="workshop-card">
            <p className="text-stone-400">
              Finished pieces will appear here as I photograph them. Check back soon.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {gallery.map((item) => (
              <Card key={item.id} className="workshop-card overflow-hidden p-0">
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

      {/* Before you commission */}
      <section className="workshop-card rounded-2xl border border-copper/20 bg-charcoal/80 p-8 md:p-10">
        <h2 className="text-xl font-semibold text-stone-100">Before you commission</h2>
        <p className="mt-2 text-sm text-stone-500">A few honest notes from me.</p>
        <ul className="mt-6 space-y-4 text-sm leading-relaxed text-stone-400">
          <li>{LEGAL_CHECKOUT_TEXT.review}</li>
          <li>{LEGAL_CHECKOUT_TEXT.gallery}</li>
          <li>{LEGAL_CHECKOUT_TEXT.contact}</li>
        </ul>
        <div className="mt-8">
          <Button href="/order">Start Your Commission</Button>
        </div>
      </section>
    </div>
  );
}
