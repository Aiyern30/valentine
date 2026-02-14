import { Bell } from "lucide-react";
import { ReactNode } from "react";
import { ProfileDropdown } from "../ProfileDropdown";
import { getProfile, getUser } from "@/lib/data";
import { redirect } from "next/navigation";

interface SectionHeaderProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

export async function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  const profile = await getProfile(user.id);

  const avatarUrl =
    profile?.avatar_url || user.user_metadata?.avatar_url || null;

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
            {icon}
          </div>
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <ProfileDropdown
          user={{
            ...user,
            display_name: profile?.display_name,
            avatar_url: avatarUrl,
          }}
        />
      </div>
    </header>
  );
}
