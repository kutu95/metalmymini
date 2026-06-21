import { FOUNDER } from "@/lib/constants";
import { BUSINESS_LOCATION_DISPLAY } from "@/lib/seo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-copper/20 bg-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-medium text-stone-200">Metal My Mini</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
            Specialist copper-plated tabletop miniatures. Operated by {FOUNDER.name} — premium
            finishing with expert review on every order.
          </p>
          <p className="mt-2 text-sm text-stone-600">{BUSINESS_LOCATION_DISPLAY}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-stone-400">
          <Link href="/how-it-works" className="hover:text-copper-light">
            How It Works
          </Link>
          <Link href="/order/status" className="hover:text-copper-light">
            Track Order
          </Link>
          <Link href="/gallery" className="hover:text-copper-light">
            Gallery
          </Link>
          <Link href="/order" className="hover:text-copper-light">
            Order
          </Link>
        </div>
      </div>
    </footer>
  );
}
