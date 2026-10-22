import type { Metadata, Viewport } from "next";
import { Archivo, Outfit, Parkinsans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";
import { Analytics, GtmNoScript } from "@/components/Analytics";
import { JsonLd } from "@/components/ui";
import { organizationSchema } from "@/lib/seo";
import { SITE_URL, site } from "@/lib/site";

// Brand fonts, as used on the existing cleantique.co.ke theme.
const archivo = Archivo({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-archivo", display: "swap" });
const parkinsans = Parkinsans({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-parkinsans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} | Cleaning, Pest Control, Moving & Logistics in Nairobi`, template: `%s | ${site.name}` },
  description:
    "Professional cleaning, fumigation and pest control, home and office moving, and goods transport for homes and businesses in Nairobi.",
  applicationName: site.name,
  formatDetection: { telephone: false },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#173A06",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${archivo.variable} ${parkinsans.variable} ${outfit.variable}`}>
      <body>
        <GtmNoScript />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileContactBar />
        <div className="h-[62px] bg-brand-900 lg:hidden" aria-hidden="true" />
        <JsonLd data={organizationSchema()} />
        <Analytics />
      </body>
    </html>
  );
}
