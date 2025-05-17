import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Garamond from Google Fonts (EB Garamond is a good web alternative)
import { EB_Garamond } from 'next/font/google';
const garamond = EB_Garamond({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "NSTrade Leaderboard",
  description: "Compare and analyze trading strategy performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`} style={{ '--garamond-font': garamond.style.fontFamily } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
