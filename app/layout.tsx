import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header, WhatsAppFab } from "@/components/layout/LayoutParts";
import { MobileCallFab } from "@/components/layout/MobileCallFab";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "DSE Consultancy | Website Development, SMM And SEO",
    template: "%s | DSE Consultancy"
  },
  description:
    "DSE Consultancy connects website development, social media management and SEO for local businesses that want stronger visibility, trust and enquiries.",
  openGraph: {
    title: "DSE Consultancy",
    description:
      "Connected website development, social media management and SEO for growing local businesses.",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Montserrat:wght@600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
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
