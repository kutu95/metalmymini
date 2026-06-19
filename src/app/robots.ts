import type { MetadataRoute } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://metalmymini.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
