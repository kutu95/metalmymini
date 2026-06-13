"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/gallery", label: "Gallery" },
  { href: "/order", label: "Upload" },
  { href: "/order/status", label: "Track Order" },
];

export function Header({
  user,
}: {
  user?: { name: string; role: string } | null;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-copper/20 bg-charcoal/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide text-copper-light">
          Metal My Mini
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-copper-light ${
                pathname === link.href ? "text-copper-light" : "text-stone-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link href="/admin" className="text-sm text-copper-light hover:underline">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link href="/account/orders" className="text-sm text-stone-300 hover:text-copper-light">
                My Orders
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="text-sm text-stone-400 hover:text-copper-light">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-stone-300 hover:text-copper-light">
                Log in
              </Link>
              <Link
                href="/order"
                className="rounded-md bg-copper px-4 py-2 text-sm font-medium text-black transition hover:bg-copper-light"
              >
                Upload Your Mini
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
