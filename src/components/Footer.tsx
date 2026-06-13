import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-copper/20 bg-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-stone-400 md:flex-row md:items-center md:justify-between">
        <p>Custom copper-plated tabletop miniatures. Worldwide shipping.</p>
        <div className="flex gap-4">
          <Link href="/how-it-works" className="hover:text-copper-light">
            How It Works
          </Link>
          <Link href="/order/status" className="hover:text-copper-light">
            Track Order
          </Link>
          <Link href="/gallery" className="hover:text-copper-light">
            Gallery
          </Link>
        </div>
      </div>
    </footer>
  );
}
