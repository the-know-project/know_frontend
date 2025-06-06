import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "../lib/react-query-client";
import { Toaster } from "../shared/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

const Helvetica = localFont({
  src: [{ path: "/fonts/Helvetica.ttf", weight: "400", style: "normal" }],
  variable: "--helvetica",
});

export const metadata: Metadata = {
  title: "KNOW",
  description: "Ultimate Partner For Creatives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${Helvetica.variable} antialiased`}
        >
          <main>{children}</main>

          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
