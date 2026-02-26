import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import "./markdown-preview.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SweetDays - Celebrate Your Love Story",
  description: "SweetDays - A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond one sweet day at a time.",
  keywords: ["relationship app", "couples app", "love journal", "relationship milestones", "couple memories", "sweetdays", "relationship tracker", "love diary"],
  authors: [{ name: "SweetDays" }],
  openGraph: {
    title: "SweetDays - Celebrate Your Love Story",
    description: "A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond.",
    type: "website",
    siteName: "SweetDays",
  },
  twitter: {
    card: "summary_large_image",
    title: "SweetDays - Celebrate Your Love Story",
    description: "A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
