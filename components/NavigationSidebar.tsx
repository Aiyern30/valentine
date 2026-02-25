"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Image,
  Heart,
  MessageCircle,
  BookOpen,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Milestones", href: "/milestones", icon: Heart },
  { name: "Confessions", href: "/confessions", icon: MessageCircle },
  { name: "Diaries", href: "/diaries", icon: BookOpen },
  { name: "Profile", href: "/profile", icon: User },
];

interface NavigationSidebarProps {
  children: React.ReactNode;
}

interface SidebarContentProps {
  mobile?: boolean;
  pathname: string;
  setSidebarOpen: (open: boolean) => void;
}

function SidebarContent({
  mobile = false,
  pathname,
  setSidebarOpen,
}: SidebarContentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSidebarOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            LoveLink
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={cn(
                    "group flex gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-rose-500",
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-rose-100 dark:border-rose-900/30 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Made with ❤️ for couples
        </p>
      </div>
    </div>
  );
}

export function NavigationSidebar({ children }: NavigationSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DrawerTrigger asChild>
            <button className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh]">
            <SidebarContent
              mobile
              pathname={pathname}
              setSidebarOpen={setMobileMenuOpen}
            />
          </DrawerContent>
        </Drawer>
      </div>

      <div className="lg:flex lg:min-h-screen">
        {/* Desktop sidebar - always visible */}
        <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 lg:w-64">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-sm">
            <SidebarContent
              pathname={pathname}
              setSidebarOpen={setMobileMenuOpen}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:ml-64">
          <div className="pt-16 lg:pt-0">{children}</div>
        </div>
      </div>
    </>
  );
}
