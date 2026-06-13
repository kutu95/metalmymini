import Link from "next/link";
import { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary: "bg-copper text-black hover:bg-copper-light",
    secondary: "border border-copper/40 text-copper-light hover:border-copper hover:bg-copper/10",
    ghost: "text-stone-300 hover:text-copper-light",
  }[variant];

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-copper/20 bg-charcoal p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold text-stone-100 md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-stone-400">{subtitle}</p>}
    </div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-copper/30 bg-copper/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-copper-light">
      {label}
    </span>
  );
}
