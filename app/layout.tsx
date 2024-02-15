import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/nav";

export const metadata: Metadata = {
  title: "devgo",
  description: "Web Development and Design Studio",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}