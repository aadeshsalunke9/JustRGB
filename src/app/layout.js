import "./globals.css";
import "./mobile.css";
import RgbStrip from "@/components/RgbStrip";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import FilmGrain from "@/components/FilmGrain";
import Footer from "@/components/Footer";

export const metadata = {
  title: "JUST RGB — Cinematic Colorist Portfolio",
  description: "A premium cinematic dark-themed colorist portfolio displaying color grade sheets, log-to-graded stills, and case studies by Aadesh Salunke.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
