/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { RelationshipTimer } from "@/components/dashboard/relationship-timer";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import {
  getUser,
  getRelationship,
  getMilestones,
  getRecentPhotos,
  isProfileComplete,
} from "@/lib/data";
import { Bell, CalendarHeart, Image as ImageIcon, Plus } from "lucide-react";
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

  // Check if profile is complete
  const profileComplete = await isProfileComplete(user.id);

  // If profile is incomplete, show the completion dialog
  if (!profileComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <ProfileCompletionDialog
          userId={user.id}
          userEmail={user.email || ""}
        />
      </div>
    );
  }

  // Fetch real data (only if profile is complete)
  const relationship = await getRelationship(user.id);
  const milestones = relationship ? await getMilestones(relationship.id, 5) : []; // Limit to 5
  const recentPhotos = relationship
    ? await getRecentPhotos(relationship.id)
    : [];

  // Determine partner info
  const partner = relationship
    ? relationship.partner1_id === user.id
      ? relationship.partner2
      : relationship.partner1
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back,{" "}
            <span className="text-rose-500">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening in your love life
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <ProfileDropdown user={user} />
        </div>
      </header>

      {/* Main Feature: Timer or Setup CTA */}
      <section>
        {relationship ? (
          <RelationshipTimer startDate={relationship.relationship_start_date} />
        ) : (
          <div className="w-full bg-linear-to-r from-rose-400 to-pink-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col items-center text-center justify-center min-h-50">
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2">
                <CalendarHeart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">When did your story begin?</h2>
              <p className="text-rose-100 max-w-md mx-auto">
                Set your anniversary date to start tracking your time together
                and unlock all features.
              </p>
              <button className="bg-white text-rose-500 hover:bg-rose-50 px-6 py-2.5 rounded-full font-semibold shadow-sm transition-all hover:scale-105 active:scale-95">
                Set Anniversary Date
              </button>
            </div>
          </div>
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
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Memories</h3>
              <button className="text-sm text-rose-500 font-medium hover:underline">
                View Gallery
              </button>
            </div>
            {recentPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentPhotos.map((photo: any) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-900 overflow-hidden relative group cursor-pointer"
                  >
                    <Image
                      src={photo.photo_url}
                      alt={photo.caption || "Memory"}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <span className="text-white font-medium text-xs backdrop-blur-md px-2 py-1 rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
                <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No photos uploaded yet
                </p>
                <button className="mt-2 text-rose-500 text-sm hover:underline font-medium">
                  Upload your first photo
                </button>
              </div>
            )}
          </div>
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
                    <p className="text-indigo-100 text-sm">
                      loves you very much
                    </p>
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
