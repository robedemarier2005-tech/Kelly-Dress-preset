import { Cormorant_Infant, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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
  title: "Kelly Dress | Robes de Mariée de Luxe & Haute Couture Parisienne",
  description: "Découvrez Kelly Dress, maison de haute couture parisienne créant des robes de mariée de luxe sur mesure. L'élégance, le raffinement et l'excellence artisanale.",
  openGraph: {
    title: "Kelly Dress | Robes de Mariée de Luxe & Haute Couture Parisienne",
    description: "Découvrez Kelly Dress, maison de haute couture parisienne créant des robes de mariée de luxe sur mesure. L'élégance, le raffinement et l'excellence artisanale.",
    url: "https://kellydress.com",
    siteName: "Kelly Dress",
    locale: "fr_FR",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorantInfant.variable} ${montserrat.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
