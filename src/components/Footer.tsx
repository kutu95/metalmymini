import { FOUNDER } from "@/lib/constants";
import { BUSINESS_LOCATION_DISPLAY } from "@/lib/seo";
import { EmailSignupForm } from "@/components/EmailSignupForm";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-copper/20 bg-black py-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <p className="font-medium text-stone-200">Metal My Mini</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
            Real copper-plated miniatures, made one at a time by {FOUNDER.name} in Melbourne.
          </p>
          <p className="mt-2 text-sm text-stone-600">{BUSINESS_LOCATION_DISPLAY}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-stone-400 md:flex-col md:gap-2">
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
          <Link href="/returns" className="hover:text-copper-light">
            Returns
          </Link>
          <Link href="/privacy" className="hover:text-copper-light">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-copper-light">
            Terms
          </Link>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-200">Stay informed</p>
          <p className="mt-2 text-sm text-stone-500">
            Get occasional updates about new finishes, gallery pieces, and when international shipping opens.
          </p>
          <div className="mt-4">
            <EmailSignupForm source="footer" buttonLabel="Notify me" />
          </div>
        </div>
      </div>
    </footer>
  );
}
