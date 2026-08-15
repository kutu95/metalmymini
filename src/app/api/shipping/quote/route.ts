import { NextRequest, NextResponse } from "next/server";
import { quoteDomesticParcel } from "@/lib/auspost";
import { shippingQuoteSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const postcode = request.nextUrl.searchParams.get("postcode") ?? "";
    const quantity = request.nextUrl.searchParams.get("quantity") ?? "1";
    const parsed = shippingQuoteSchema.safeParse({ postcode, quantity });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const quote = await quoteDomesticParcel({
      toPostcode: parsed.data.postcode,
      quantity: parsed.data.quantity,
    });

    return NextResponse.json({
      shippingPriceCents: quote.amountCents,
      shippingPriceAud: quote.amountCents / 100,
      serviceName: quote.serviceName,
      deliveryTime: quote.deliveryTime ?? null,
      fromPostcode: quote.fromPostcode,
      toPostcode: quote.toPostcode,
      weightKg: quote.weightKg,
      serviceCode: quote.serviceCode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to quote shipping";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
