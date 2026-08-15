export function formatAud(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function productLabel(nameOrLegacy: string | null | undefined) {
  if (!nameOrLegacy) return "Product";
  if (nameOrLegacy === "cosmetic_copper") return "Display Copper";
  if (nameOrLegacy === "heavy_duty_copper") return "Thick Copper";
  return nameOrLegacy;
}
