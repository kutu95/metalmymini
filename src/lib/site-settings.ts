import { prisma } from "@/lib/db";
import { PRODUCTS } from "@/lib/constants";

export const HERO_ROTATION_MS_KEY = "hero_rotation_ms";
export const DEFAULT_HERO_ROTATION_MS = 2500;
export const MIN_HERO_ROTATION_MS = 1000;
export const MAX_HERO_ROTATION_MS = 60_000;

export const DISPLAY_COPPER_PRICE_CENTS_KEY = "display_copper_price_cents";
export const DEFAULT_DISPLAY_COPPER_PRICE_CENTS = PRODUCTS.cosmetic_copper.priceCents;
export const MIN_DISPLAY_COPPER_PRICE_CENTS = 100; // $1
export const MAX_DISPLAY_COPPER_PRICE_CENTS = 500_000; // $5,000

export function msToSeconds(ms: number) {
  return Math.round(ms / 100) / 10;
}

export function secondsToMs(seconds: number) {
  return Math.round(seconds * 1000);
}

export function clampHeroRotationMs(ms: number) {
  if (!Number.isFinite(ms)) return DEFAULT_HERO_ROTATION_MS;
  return Math.min(MAX_HERO_ROTATION_MS, Math.max(MIN_HERO_ROTATION_MS, Math.round(ms)));
}

export function clampDisplayCopperPriceCents(cents: number) {
  if (!Number.isFinite(cents)) return DEFAULT_DISPLAY_COPPER_PRICE_CENTS;
  return Math.min(
    MAX_DISPLAY_COPPER_PRICE_CENTS,
    Math.max(MIN_DISPLAY_COPPER_PRICE_CENTS, Math.round(cents)),
  );
}

export function centsToAud(cents: number) {
  return Math.round(cents) / 100;
}

export function audToCents(aud: number) {
  return Math.round(aud * 100);
}

export function formatPriceDisplay(cents: number) {
  const aud = centsToAud(cents);
  const formatted = Number.isInteger(aud) ? String(aud) : aud.toFixed(2);
  return `AUD $${formatted}`;
}

export async function getHeroRotationMs() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: HERO_ROTATION_MS_KEY },
    });
    if (!setting) return DEFAULT_HERO_ROTATION_MS;
    return clampHeroRotationMs(Number(setting.value));
  } catch {
    return DEFAULT_HERO_ROTATION_MS;
  }
}

export async function setHeroRotationMs(ms: number) {
  const value = String(clampHeroRotationMs(ms));
  await prisma.siteSetting.upsert({
    where: { key: HERO_ROTATION_MS_KEY },
    create: { key: HERO_ROTATION_MS_KEY, value },
    update: { value },
  });
  return Number(value);
}

export async function getDisplayCopperPriceCents() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: DISPLAY_COPPER_PRICE_CENTS_KEY },
    });
    if (!setting) return DEFAULT_DISPLAY_COPPER_PRICE_CENTS;
    return clampDisplayCopperPriceCents(Number(setting.value));
  } catch {
    return DEFAULT_DISPLAY_COPPER_PRICE_CENTS;
  }
}

export async function setDisplayCopperPriceCents(cents: number) {
  const value = String(clampDisplayCopperPriceCents(cents));
  await prisma.siteSetting.upsert({
    where: { key: DISPLAY_COPPER_PRICE_CENTS_KEY },
    create: { key: DISPLAY_COPPER_PRICE_CENTS_KEY, value },
    update: { value },
  });
  return Number(value);
}

export async function getDisplayCopperProduct() {
  const priceCents = await getDisplayCopperPriceCents();
  return {
    ...PRODUCTS.cosmetic_copper,
    priceCents,
    priceDisplay: formatPriceDisplay(priceCents),
  };
}
