import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveBlogImage } from "@/lib/storage";
import { blogImageUrl } from "@/lib/blog-html";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const saved = await saveBlogImage(image);
    return NextResponse.json({
      filename: saved.storedFilename,
      url: blogImageUrl(saved.storedFilename),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload image";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
