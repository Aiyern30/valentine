import { NavigationSidebar } from "@/components/NavigationSidebar";

export default function MilestonesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationSidebar>{children}</NavigationSidebar>;
}
