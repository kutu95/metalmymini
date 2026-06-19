import { NextResponse } from "next/server";
import { getLlmsTxt } from "@/lib/llms";

export async function GET() {
  return new NextResponse(getLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
