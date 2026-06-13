import { ReactNode } from "react";

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-200">{label}</span>
      {children}
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export const inputClassName =
  "w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-stone-100 outline-none ring-copper/40 placeholder:text-stone-600 focus:border-copper focus:ring-2";

export const textareaClassName =
  "w-full rounded-md border border-stone-700 bg-black px-3 py-2 text-stone-100 outline-none ring-copper/40 placeholder:text-stone-600 focus:border-copper focus:ring-2";

export const selectClassName = inputClassName;
