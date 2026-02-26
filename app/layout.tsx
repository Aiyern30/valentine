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
  title: {
    default: "SweetDays - Celebrate Your Love Story",
    template: "%s | SweetDays",
  },
  description:
    "SweetDays - A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond one sweet day at a time.",
  keywords: [
    "relationship app",
    "couples app",
    "love journal",
    "relationship milestones",
    "couple memories",
    "sweetdays",
    "relationship tracker",
    "love diary",
    "couple diary",
    "relationship journal",
    "anniversary tracker",
  ],
  authors: [{ name: "SweetDays" }],
  creator: "SweetDays",
  publisher: "SweetDays",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SweetDays - Celebrate Your Love Story",
    description:
      "A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond.",
    type: "website",
    siteName: "SweetDays",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SweetDays - Celebrate Your Love Story",
    description:
      "A beautiful place to celebrate and cherish your relationship. Create memories, share milestones, and strengthen your bond.",
    creator: "@sweetdays",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SweetDays",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#f43f5e",
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
