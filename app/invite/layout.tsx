import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Invitation",
  description:
    "Accept your partner's invitation to join SweetDays and start your journey together.",
  keywords: ["partner invite", "relationship invite", "couple app invitation"],
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
