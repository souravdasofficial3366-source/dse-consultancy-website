import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header, WhatsAppFab } from "@/components/layout/LayoutParts";
import { MobileCallFab } from "@/components/layout/MobileCallFab";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "DSE Consultancy | Website for Shops from ₹3,999",
    template: "%s | DSE Consultancy"
  },
  description:
    "Affordable websites for small Indian shops, clinics, stores, and local businesses. Get a website from ₹3,999 with 1 year of free Google ranking help.",
  openGraph: {
    title: "DSE Consultancy",
    description:
      "Get a fast business website and help customers find your shop on Google.",
    url: siteConfig.siteUrl,
    siteName: "DSE Consultancy",
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="page-shell">
          <Header />
          {children}
          <Footer />
          <MobileCallFab />
          <WhatsAppFab />
        </div>
      </body>
    </html>
  );
}
