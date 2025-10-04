import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import { Toaster } from "@/components/ui/sonner"

const manrope = Manrope({
  subsets: ["latin"]
})


export const metadata: Metadata = {
  title: "SiteScan",
  description: "Get concised, AI powered summary in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
