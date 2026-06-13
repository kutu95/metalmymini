"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/gallery", label: "Gallery" },
  { href: "/order", label: "Upload" },
  { href: "/order/status", label: "Track Order" },
];

function NavLink({
  href,
  label,
  pathname,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  className?: string;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm transition hover:text-copper-light ${
        active ? "text-copper-light" : "text-stone-300"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export function Header({
  user,
}: {
  user?: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative border-b border-copper/20 bg-charcoal/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide text-copper-light">
          Metal My Mini
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
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

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-copper/30 text-copper-light md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-copper/20 bg-charcoal px-4 py-6 shadow-xl md:hidden">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  pathname={pathname}
                  onClick={closeMenu}
                  className="text-base"
                />
              ))}
              {user?.role === "admin" && (
                <NavLink href="/admin" label="Admin" pathname={pathname} onClick={closeMenu} className="text-base" />
              )}
              {user ? (
                <>
                  <NavLink
                    href="/account/orders"
                    label="My Orders"
                    pathname={pathname}
                    onClick={closeMenu}
                    className="text-base"
                  />
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      className="text-base text-stone-400 transition hover:text-copper-light"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <NavLink href="/login" label="Log in" pathname={pathname} onClick={closeMenu} className="text-base" />
                  <Link
                    href="/order"
                    onClick={closeMenu}
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-copper px-4 py-3 text-sm font-medium text-black transition hover:bg-copper-light"
                  >
                    Upload Your Mini
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
