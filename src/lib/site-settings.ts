import { prisma } from "@/lib/db";

export const HERO_ROTATION_MS_KEY = "hero_rotation_ms";
export const DEFAULT_HERO_ROTATION_MS = 2500;
export const MIN_HERO_ROTATION_MS = 1000;
export const MAX_HERO_ROTATION_MS = 60_000;

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

export const ORDER_BANNER_ENABLED_KEY = "order_banner_enabled";
export const ORDER_BANNER_MESSAGE_KEY = "order_banner_message";
export const ORDERING_PAUSED_KEY = "ordering_paused";
export const ORDERING_PAUSED_MESSAGE_KEY = "ordering_paused_message";

export const DEFAULT_ORDERING_PAUSED_MESSAGE =
  "I'm not taking new orders right now. Leave your email and I'll let you know when ordering opens again.";

export type OrderPageSettings = {
  bannerEnabled: boolean;
  bannerMessage: string;
  orderingPaused: boolean;
  orderingPausedMessage: string;
};

function parseBoolSetting(value: string | undefined) {
  return value === "true" || value === "1";
}

async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getOrderPageSettings(): Promise<OrderPageSettings> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            ORDER_BANNER_ENABLED_KEY,
            ORDER_BANNER_MESSAGE_KEY,
            ORDERING_PAUSED_KEY,
            ORDERING_PAUSED_MESSAGE_KEY,
          ],
        },
      },
    });
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    const pausedMessage = map[ORDERING_PAUSED_MESSAGE_KEY]?.trim();
    return {
      bannerEnabled: parseBoolSetting(map[ORDER_BANNER_ENABLED_KEY]),
      bannerMessage: map[ORDER_BANNER_MESSAGE_KEY] ?? "",
      orderingPaused: parseBoolSetting(map[ORDERING_PAUSED_KEY]),
      orderingPausedMessage: pausedMessage || DEFAULT_ORDERING_PAUSED_MESSAGE,
    };
  } catch {
    return {
      bannerEnabled: false,
      bannerMessage: "",
      orderingPaused: false,
      orderingPausedMessage: DEFAULT_ORDERING_PAUSED_MESSAGE,
    };
  }
}

export async function setOrderPageSettings(input: Partial<OrderPageSettings>) {
  if (input.bannerEnabled !== undefined) {
    await upsertSetting(ORDER_BANNER_ENABLED_KEY, input.bannerEnabled ? "true" : "false");
  }
  if (input.bannerMessage !== undefined) {
    await upsertSetting(ORDER_BANNER_MESSAGE_KEY, input.bannerMessage);
  }
  if (input.orderingPaused !== undefined) {
    await upsertSetting(ORDERING_PAUSED_KEY, input.orderingPaused ? "true" : "false");
  }
  if (input.orderingPausedMessage !== undefined) {
    await upsertSetting(ORDERING_PAUSED_MESSAGE_KEY, input.orderingPausedMessage);
  }
  return getOrderPageSettings();
}

export async function isOrderingPaused() {
  const settings = await getOrderPageSettings();
  return settings.orderingPaused;
}
