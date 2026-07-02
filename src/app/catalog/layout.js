export const metadata = {
  openGraph: {
    title: "Catalogue — Kelly Dress",
    description: "Découvrez notre collection de robes de mariée d'exception. Créations haute couture sur mesure dans notre atelier parisien.",
    url: "https://www.kellydress.co/catalog",
    siteName: "Kelly Dress",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/logo-modified.png",
        width: 1200,
        height: 630,
        alt: "Kelly Dress — Catalogue Haute Couture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalogue — Kelly Dress",
    description: "Découvrez notre collection de robes de mariée d'exception. Créations haute couture sur mesure dans notre atelier parisien.",
    images: ["/images/logo-modified.png"],
  },
};

export default function CatalogLayout({ children }) {
  return children;
}
