import "./globals.css";
import ShaderBackground from "@/components/ShaderBackground";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Aadesh Salunke — Colorist Portfolio",
  description: "A professional portfolio site for Aadesh Salunke displaying cinematic look development, film color grading, and restoration workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Fullscreen WebGL Generative Background Shader */}
        <ShaderBackground />
        
        {/* Navigation Navbar overlay */}
        <Nav />
        
        {/* Page Contents overlay */}
        <div className="content-wrapper">
          {children}
        </div>
        
        {/* Footer overlay */}
        <Footer />
      </body>
    </html>
  );
}
