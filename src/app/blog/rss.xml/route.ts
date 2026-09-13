import { NextResponse } from "next/server";
import { listAllPublishedPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await listAllPublishedPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const date = (post.publishedAt ?? post.updatedAt).toUTCString();
      return `<item>
        <title>${xmlEscape(post.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${date}</pubDate>
        <description>${xmlEscape(post.excerpt || post.title)}</description>
      </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} journal`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Writing about copper-plated miniatures from Metal My Mini.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
