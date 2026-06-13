import Link from "next/link";
import { FOUNDER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-copper/20 bg-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-medium text-stone-200">Metal My Mini</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
            A small artisan workshop run by {FOUNDER.name}. Custom copper-plated tabletop
            miniatures, finished by hand and shipped worldwide.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-stone-400">
          <Link href="/how-it-works" className="hover:text-copper-light">
            How I Work
          </Link>
          <Link href="/order/status" className="hover:text-copper-light">
            Track Order
          </Link>
          <Link href="/gallery" className="hover:text-copper-light">
            Gallery
          </Link>
          <Link href="/order" className="hover:text-copper-light">
            Commission
          </Link>
        </div>
      </div>
    </footer>
  );
}
