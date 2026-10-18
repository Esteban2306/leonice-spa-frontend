import type { Metadata } from "next";
import { Inria_Sans, Italiana } from "next/font/google";

import "@/src/globals.css";
import { QueryProvider } from "@/src/lib/query/query-provider";
import { SITE_DESCRIPTION, SITE_URL } from "@/src/features/landing/lib/seo";
import { SPA_NAME } from "@/src/features/landing/lib/site-config";

const inriaSans = Inria_Sans({
  variable: "--font-inria-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SPA_NAME, template: `%s · ${SPA_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SPA_NAME,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SPA_NAME,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      className={`${inriaSans.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
