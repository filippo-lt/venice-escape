import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323, Caveat, EB_Garamond } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Le Sette Àncore della Serenissima",
  description:
    "Un'avventura SCUMM per le calli di Venezia. Anno Domini MCCXCVII.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a0f08",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${pressStart.variable} ${vt323.variable} ${caveat.variable} ${garamond.variable}`}
    >
      <body className="crt min-h-screen bg-black text-white-text">
        {children}
      </body>
    </html>
  );
}
