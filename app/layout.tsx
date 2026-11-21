import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";

const afacad = Afacad({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tvtn Erp",
  description: "Educational Management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`${afacad.className} text-xl `)} suppressHydrationWarning>
        {children}
        <NextTopLoader showSpinner={false} />
        <Toaster />
      </body>
    </html>
  );
}
