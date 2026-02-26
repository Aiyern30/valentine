import { getUser, getProfile, getPartnerProfile } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileCard } from "@/components/profile/profile-card";
import { User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile and view your partner's information. Update your details and relationship settings.",
  keywords: ["profile", "user profile", "couple profile", "account settings", "relationship settings"],
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const userProfile = await getProfile(user.id);
  const partnerProfile = await getPartnerProfile(user.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-rose-950 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={<User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />}
          title="Profile"
          description="Manage your profile and view your partner's information"
        />

        <div className="grid grid-cols-1 gap-6 md:gap-8 px-0 sm:px-2 md:px-4 py-6 md:py-8">
          {/* Your Profile */}
          <ProfileCard profile={userProfile} isOwn={true} />

          {/* Partner's Profile */}
          {partnerProfile ? (
            <ProfileCard profile={partnerProfile} isOwn={false} />
          ) : (
            <div className="bg-linear-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 p-6 sm:p-8 md:p-12 flex items-center justify-center hover:shadow-xl transition-shadow min-h-80 sm:min-h-96">
              <div className="text-center px-4">
                <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-3 sm:mb-4 bg-linear-to-br from-pink-200 to-rose-200 dark:from-pink-900/30 dark:to-rose-900/30 rounded-full flex items-center justify-center">
                  <User className="w-8 sm:w-10 h-8 sm:h-10 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  No Partner Yet
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                  Once you connect with a partner, their profile will appear
                  here and you can see their information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
