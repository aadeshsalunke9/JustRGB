import { Bebas_Neue, Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import RgbStrip from "@/components/RgbStrip";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import FilmGrain from "@/components/FilmGrain";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400"],
});

export const metadata = {
  title: "JUST RGB — Cinematic Colorist Portfolio",
  description: "A premium cinematic dark-themed colorist portfolio displaying color grade sheets, log-to-graded stills, and case studies by Aadesh Salunke.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${cormorantGaramond.variable} ${dmMono.variable}`}>
      <body>
        <RgbStrip />
        <Nav />
        <Cursor />
        <FilmGrain />
        {children}
        <Footer />
      </body>
    </html>
  );
}
