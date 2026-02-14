/* eslint-disable react/no-unescaped-entities */
import { RelationshipTimer } from "@/components/dashboard/relationship-timer";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { AnniversarySetup } from "@/components/dashboard/anniversary-setup";
import { RecentMemoriesSection } from "@/components/dashboard/recent-memories-section";
import {
  getUser,
  getRelationship,
  getMilestonesByUser,
  getRecentPhotos,
  isProfileComplete,
  getProfile,
} from "@/lib/data";
import { Bell, Plus } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ProfileCompletionDialog } from "@/components/ProfileCompletionDialog";

export default async function DashboardPage() {
  const user = await getUser();

  // Redirect to home if not authenticated
  if (!user) {
    redirect("/");
  }

  // Fetch profile from DB
  const profile = await getProfile(user.id);

  // Check if profile is complete
  const profileComplete = await isProfileComplete(user.id);

  // If profile is incomplete, show the completion dialog
  if (!profileComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <ProfileCompletionDialog userId={user.id} userEmail={user.email || ""} />
      </div>
    );
  }

  // Fetch real data (only if profile is complete)
  const relationship = await getRelationship(user.id);

  const milestones = await getMilestonesByUser(user.id, 5);

  const recentPhotos = relationship ? await getRecentPhotos(relationship.id) : [];

  // Determine partner info
  const partner = relationship
    ? relationship.partner1_id === user.id
      ? relationship.partner2
      : relationship.partner1
    : null;

  // Prefer DB profile for display name and avatar, fallback to user object
  const displayName =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0];
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, <span className="text-rose-500">{displayName}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening in your love life
          </p>
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

      {/* Main Feature: Timer or Setup CTA */}
      <section>
        {relationship ? (
          <RelationshipTimer startDate={relationship.relationship_start_date} />
        ) : (
          <AnniversarySetup />
        )}
      </section>

      {/* Quick Actions - Always Visible */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Quick Actions
        </h2>
        <DashboardActions />
      </section>

      {/* Two Column Layout - Always Visible with Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Events */}
        <div className="lg:col-span-2 space-y-8">
          <UpcomingEvents milestones={milestones} />

          {/* Recent Memories */}
          <RecentMemoriesSection photos={recentPhotos} currentUserId={user.id} />
        </div>

        {/* Right: Sidebar / Status */}
        <div className="space-y-6">
          {/* Partner Status Card */}
          {partner ? (
            <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-medium opacity-90 mb-4">
                  Partner Status
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl overflow-hidden">
                    {partner?.avatar_url ? (
                      <Image
                        src={partner.avatar_url}
                        alt="Partner"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <span>❤️</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {partner?.display_name || "My Love"}
                    </p>
                    <p className="text-indigo-100 text-sm">loves you very much</p>
                  </div>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
          ) : (
            <div className="bg-linear-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 text-gray-800 dark:text-gray-200 shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-4">Invite Partner</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Connect with your special someone to unlock shared features.
                </p>
                <button className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </div>
          )}

          {/* Daily Quote/Confession Teaser */}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-3xl p-6 border border-rose-100 dark:border-rose-900/30">
            <h3 className="text-rose-600 dark:text-rose-400 font-script text-xl mb-3">
              Daily Inspiration
            </h3>
            <p className="italic text-gray-700 dark:text-gray-300 mb-4">
              "In all the world, there is no heart for me like yours. In all the
              world, there is no love for you like mine."
            </p>
            <p className="text-xs text-rose-500 font-medium uppercase tracking-wide">
              — Maya Angelou
            </p>
          </div>

          {!relationship && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/30">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Getting Started
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Set your anniversary date
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Invite your partner
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Upload your first photo
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
