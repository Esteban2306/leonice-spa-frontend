import type { Metadata } from "next";
import { Inria_Sans, Italiana } from "next/font/google";

import "@/src/globals.css";
import { QueryProvider } from "@/src/lib/query/query-provider";

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
  title: "Leonice Spa",
  description: "Administración Leonice Spa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inriaSans.variable} ${italiana.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
