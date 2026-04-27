import type { Metadata } from "next";
import { Geist, Geist_Mono, Rajdhani, Inter_Tight, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingWrapper from "@/components/LoadingWrapper";
import StickyDonateButton from "@/components/StickyDonateButton";

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

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["300", "400", "500", "700"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${rajdhani.variable} ${interTight.variable} ${jetbrainsMono.variable} ${caveat.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <ClientOnly
          fallback={
            <div className="min-h-screen bg-black" />
          }
        >
          {/* Navigation MUST be outside LoadingWrapper to avoid transform breaking position:fixed */}
          <Navigation />
          <LoadingWrapper>
            <SmoothScroll>
              <main>
                {children}
              </main>
              <div className="relative" style={{ zIndex: 10 }}>
                <Footer />
              </div>
            </SmoothScroll>
          </LoadingWrapper>
          {/* Sticky donate CTA — also outside LoadingWrapper so position:fixed isn't broken by the parent transform */}
          <StickyDonateButton />
        </ClientOnly>
      </body>
    </html>
  );
}
