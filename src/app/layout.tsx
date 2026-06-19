import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Custom Copper-Plated Miniatures | Metal My Mini",
    template: "%s | Metal My Mini",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: SITE_NAME,
    title: "Custom Copper-Plated Miniatures | Metal My Mini",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Copper-Plated Miniatures | Metal My Mini",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser().catch(() => null);

  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="metalmymini.com"
          src="https://analytics.margies.app/js/script.js"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
