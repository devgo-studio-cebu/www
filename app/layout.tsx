import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devgo",
  description: "Web Development and Design Studio",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}