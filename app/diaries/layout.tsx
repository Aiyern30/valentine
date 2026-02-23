import { NavigationSidebar } from "@/components/NavigationSidebar";

export default function DiariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationSidebar>{children}</NavigationSidebar>;
}
