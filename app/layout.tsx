import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sai Kumar Bonakurthi | SAP Developer",
  description: "SAP August Developer Challenge — Week 4 business card",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
