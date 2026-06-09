import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteInfo } from "@/lib/content";
import { getSiteData } from "@/lib/get-site-data";

// Le contenu provient de Supabase (éditable via /admin) → toujours dynamique.
export const dynamic = "force-dynamic";

// ui-ux-pro-max skill → pairing « éditorial terroir » : Fraunces + Inter
// Fraunces (serif optique haute, italique élégant) pour les titres ;
// Inter (sans-serif neutre) pour le corps et l'interface.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vergerfrancoislegault.ca"),
  title: {
    default: "Autocueillette de pommes — Verger François Legault",
    template: "%s — Verger François Legault",
  },
  description:
    "Verger familial d'autocueillette à Mont-Saint-Hilaire. McIntosh, Lobo, Cortland, Empire, Honeycrisp. Cueillez vos pommes en toute tranquillité dès septembre.",
  keywords: [
    "autocueillette pommes",
    "verger Mont-Saint-Hilaire",
    "pommes Québec",
    "Honeycrisp",
    "cueillette de pommes Montérégie",
  ],
  alternates: {
    canonical: "https://vergerfrancoislegault.ca",
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: "Verger François Legault",
    title: "Autocueillette de pommes — Verger François Legault",
    description:
      "Cueillez vos pommes en toute tranquillité dans notre verger familial de Mont-Saint-Hilaire.",
    images: [
      {
        url: "/images/enseigne-verger-1.jpg",
        width: 1200,
        height: 630,
        alt: "L'enseigne du Verger François Legault, Mont-Saint-Hilaire",
      },
    ],
  },
  robots: { index: true, follow: true },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteInfo.nom,
  image: "https://vergerfrancoislegault.ca/images/cueillette-main-pommes.jpg",
  "@id": "https://vergerfrancoislegault.ca",
  url: "https://vergerfrancoislegault.ca",
  telephone: siteInfo.telephone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "111 Rang des Étangs",
    addressLocality: "Mont-Saint-Hilaire",
    addressRegion: "QC",
    postalCode: "J3G 4S6",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.5639,
    longitude: -73.1469,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday",
    ],
    opens: "08:00",
    closes: "17:00",
  },
  sameAs: [siteInfo.facebook, siteInfo.instagram],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteInfo: info, colors } = await getSiteData();

  // Les couleurs choisies dans /admin sont injectées en variables CSS sur
  // <body>. Comme les custom properties héritent, elles écrasent les valeurs
  // par défaut de globals.css pour tout le site (Header, Footer inclus).
  const colorVars = {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-text": colors.text,
  } as React.CSSProperties;

  return (
    <html lang="fr-CA" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* GSC VERIFICATION INSERT HERE */}
        {/* COOKIEYES INSERT HERE */}
        {/* GA4 INSERT HERE — charger APRÈS consentement CookieYes (Loi 25) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body style={colorVars}>
        <Header siteInfo={info} />
        <main>{children}</main>
        <Footer siteInfo={info} />
      </body>
    </html>
  );
}
