import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Love Confessions",
  description:
    "Send and receive heartfelt love confessions. Create beautiful digital love letters with photos, themes, and personal messages.",
  keywords: [
    "love confession",
    "love letter",
    "digital love letter",
    "romantic message",
    "heartfelt confession",
  ],
};

export default function ConfessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
