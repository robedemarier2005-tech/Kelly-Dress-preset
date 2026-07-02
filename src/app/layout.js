import { Cormorant_Infant, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CopyProtection from "../components/CopyProtection";
import StyledJsxRegistry from "./registry";

const cormorantInfant = Cormorant_Infant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://www.kellydress.co"),
  title: "Kelly Dress",
  description: "Maison de haute couture parisienne créant des robes de mariée de luxe sur mesure. L'élégance et l'excellence artisanale pour votre jour unique.",
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Kelly Dress",
    description: "Maison de haute couture parisienne créant des robes de mariée de luxe sur mesure.",
    url: "https://www.kellydress.co",
    siteName: "Kelly Dress",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "Kelly Dress - Haute Couture Parisienne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelly Dress",
    description: "Maison de haute couture parisienne créant des robes de mariée de luxe sur mesure.",
    images: ["/images/image.png"],
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorantInfant.variable} ${montserrat.variable}`}>
      <body>
        <CopyProtection />
        <StyledJsxRegistry>
        <Providers>
          {children}
        </Providers>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
