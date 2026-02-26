import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Confession",
  description:
    "Open and view your heartfelt confession. Experience the love message created just for you.",
  keywords: [
    "view confession",
    "love letter",
    "romantic message",
    "open confession",
  ],
};

export default function ConfessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
