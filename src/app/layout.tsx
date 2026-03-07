import type { Metadata } from "next";
import { Geist, Geist_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "USC Formula Electric | Racing Excellence",
  description: "University of Southern California Formula Electric Racing Team - Engineering the future of motorsport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <ClientOnly
          fallback={
            <div className="min-h-screen bg-black" />
          }
        >
          <SmoothScroll>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </ClientOnly>
      </body>
    </html>
  );
}
