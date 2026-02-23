import { NavigationSidebar } from "@/components/NavigationSidebar";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavigationSidebar>{children}</NavigationSidebar>;
}
