import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { subscribeSchema } from "@/lib/validators";

export async function GET() {
  try {
    await requireAdmin();
    const subscribers = await prisma.emailSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const firstName = parsed.data.firstName;
    const source = parsed.data.source ?? "other";

    const existing = await prisma.emailSubscriber.findUnique({ where: { email } });

    if (existing && !existing.unsubscribedAt) {
      await prisma.emailSubscriber.update({
        where: { email },
        data: {
          ...(firstName ? { firstName } : {}),
          ...(source ? { source } : {}),
        },
      });
      return NextResponse.json({ success: true });
    }

    if (existing) {
      await prisma.emailSubscriber.update({
        where: { email },
        data: {
          firstName: firstName ?? existing.firstName,
          source,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true });
    }

    await prisma.emailSubscriber.create({
      data: {
        email,
        firstName: firstName ?? null,
        source,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not process subscription." }, { status: 500 });
  }
}
