import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  audToCents,
  centsToAud,
  formatPriceDisplay,
  getDisplayCopperPriceCents,
  getHeroRotationMs,
  msToSeconds,
  secondsToMs,
  setDisplayCopperPriceCents,
  setHeroRotationMs,
} from "@/lib/site-settings";
import { displayCopperPriceSchema, heroRotationSchema } from "@/lib/validators";

export async function GET() {
  const [heroRotationMs, displayCopperPriceCents] = await Promise.all([
    getHeroRotationMs(),
    getDisplayCopperPriceCents(),
  ]);

  return NextResponse.json({
    heroRotationMs,
    heroRotationSeconds: msToSeconds(heroRotationMs),
    displayCopperPriceCents,
    displayCopperPriceAud: centsToAud(displayCopperPriceCents),
    displayCopperPriceDisplay: formatPriceDisplay(displayCopperPriceCents),
  });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if ("displayCopperPriceAud" in body) {
      const parsed = displayCopperPriceSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
      }

      const displayCopperPriceCents = await setDisplayCopperPriceCents(
        audToCents(parsed.data.displayCopperPriceAud),
      );
      return NextResponse.json({
        displayCopperPriceCents,
        displayCopperPriceAud: centsToAud(displayCopperPriceCents),
        displayCopperPriceDisplay: formatPriceDisplay(displayCopperPriceCents),
      });
    }

    const parsed = heroRotationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const heroRotationMs = await setHeroRotationMs(secondsToMs(parsed.data.heroRotationSeconds));
    return NextResponse.json({
      heroRotationMs,
      heroRotationSeconds: msToSeconds(heroRotationMs),
    });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
