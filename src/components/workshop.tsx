import { ReactNode } from "react";

type PhotoPlaceholderProps = {
  label: string;
  caption?: string;
  aspect?: "square" | "portrait" | "wide";
  className?: string;
  children?: ReactNode;
};

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/10]",
};

export function PhotoPlaceholder({
  label,
  caption,
  aspect = "square",
  className = "",
  children,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-copper/20 bg-stone-950 ${aspectClasses[aspect]} ${className}`}
    >
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-stone-900/60 to-black p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-copper/30 bg-copper/5">
          <svg
            className="text-copper/50"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="M21 16l-5.5-5.5a2 2 0 0 0-2.8 0L3 18" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-[0.15em] text-copper-light">{label}</p>
        {caption && <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-500">{caption}</p>}
        {children}
      </div>
    </div>
  );
}

export function TrustSignalGrid({
  signals,
}: {
  signals: ReadonlyArray<{ title: string; detail: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {signals.map((signal) => (
        <div
          key={signal.title}
          className="rounded-xl border border-copper/15 bg-charcoal p-5"
        >
          <p className="font-medium text-stone-100">{signal.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">{signal.detail}</p>
        </div>
      ))}
    </div>
  );
}
