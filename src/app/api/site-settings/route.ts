import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getHeroRotationMs,
  msToSeconds,
  secondsToMs,
  setHeroRotationMs,
} from "@/lib/site-settings";
import { heroRotationSchema } from "@/lib/validators";

export async function GET() {
  const heroRotationMs = await getHeroRotationMs();
  return NextResponse.json({
    heroRotationMs,
    heroRotationSeconds: msToSeconds(heroRotationMs),
  });
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
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
