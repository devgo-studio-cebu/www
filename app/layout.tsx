import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/nav";
import Footer from "@/components/footer/foot";

export const metadata: Metadata = {
  title: "DEVGO",
  description: "Web Development and Design Studio",
  icons: '/logo.svg'
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}