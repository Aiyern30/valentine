/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { getUser, getProfile, getPartnerProfile } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProfileCard } from "@/components/profile/profile-card";
import { User } from "lucide-react";

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
    <div className="space-y-6">
      <SectionHeader
        icon={<User className="w-8 h-8" />}
        title="Profile"
        description="Manage your profile and view your partner's information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-6 pb-8">
        {/* Your Profile */}
        <ProfileCard
          profile={userProfile}
          isOwn={true}
        />

        {/* Partner's Profile */}
        {partnerProfile ? (
          <ProfileCard profile={partnerProfile} isOwn={false} />
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Partner Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Once you're in a relationship, your partner's profile will
                appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
