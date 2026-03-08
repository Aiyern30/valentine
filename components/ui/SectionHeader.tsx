"use client";

import { Bell } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ProfileDropdown } from "../ProfileDropdown";
import { createClient } from "@/lib/supabase/client";

interface SectionHeaderProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  button?: ReactNode;
}

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
};

type User = {
  id: string;
  user_metadata?: {
    avatar_url?: string | null;
  };
};

export function SectionHeader({
  icon,
  title,
  description,
  button,
}: SectionHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(authUser as User);

      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", authUser.id)
        .single();

      setProfile((data as Profile) || null);
    };

    loadUser();
  }, []);

  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  return (
    <header className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 sm:gap-3 truncate">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <span className="truncate">{title}</span>
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
        {user && (
          <ProfileDropdown
            user={{
              ...user,
              display_name: profile?.display_name,
              avatar_url: avatarUrl,
            }}
          />
        )}
        {button && <div>{button}</div>}
      </div>
    </header>
  );
}
