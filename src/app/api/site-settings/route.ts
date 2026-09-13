import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getHeroRotationMs,
  getOrderPageSettings,
  msToSeconds,
  secondsToMs,
  setHeroRotationMs,
  setOrderPageSettings,
} from "@/lib/site-settings";
import { siteSettingsPatchSchema } from "@/lib/validators";

async function publicSettings() {
  const [heroRotationMs, orderPage] = await Promise.all([getHeroRotationMs(), getOrderPageSettings()]);
  return {
    heroRotationMs,
    heroRotationSeconds: msToSeconds(heroRotationMs),
    ...orderPage,
  };
}

export async function GET() {
  return NextResponse.json(await publicSettings());
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = siteSettingsPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    if (parsed.data.heroRotationSeconds !== undefined) {
      await setHeroRotationMs(secondsToMs(parsed.data.heroRotationSeconds));
    }

    const hasOrderPageUpdate =
      parsed.data.bannerEnabled !== undefined ||
      parsed.data.bannerMessage !== undefined ||
      parsed.data.orderingPaused !== undefined ||
      parsed.data.orderingPausedMessage !== undefined;

    if (hasOrderPageUpdate) {
      await setOrderPageSettings({
        bannerEnabled: parsed.data.bannerEnabled,
        bannerMessage: parsed.data.bannerMessage,
        orderingPaused: parsed.data.orderingPaused,
        orderingPausedMessage: parsed.data.orderingPausedMessage,
      });
    }

    return NextResponse.json(await publicSettings());
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
