import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await logoutUser();
  return NextResponse.redirect(new URL("/", request.url));
}
