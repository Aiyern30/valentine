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
import { Home } from "lucide-react";
import { PartnerCard } from "@/components/PartnerCard";
import { redirect } from "next/navigation";
import { ProfileCompletionDialog } from "@/components/ProfileCompletionDialog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InvitePartnerCard } from "@/components/InvitePartnerCards";
export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getProfile(user.id);
  const profileComplete = await isProfileComplete(user.id);

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

  // ✅ Only fetch ACTIVE relationships (not pending)
  const relationship = await getRelationship(user.id);

  const milestones = await getMilestonesByUser(user.id, 5);

  const recentPhotos = relationship
    ? await getRecentPhotos(relationship.id)
    : [];

  const partner = relationship
    ? relationship.partner1_id === user.id
      ? relationship.partner2
      : relationship.partner1
    : null;

  const displayName =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SectionHeader
        icon={<Home className="w-6 h-6 text-white" />}
        title={
          <>
            Welcome back, <span className="text-rose-500">{displayName}</span>!
          </>
        }
        description={"Here's what's happening in your love life"}
      />

      {/* Main Feature: Timer or Setup CTA */}
      <section>
        {/* ✅ Only show timer if relationship exists AND is active */}
        {relationship && relationship.status === "active" ? (
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
          <RecentMemoriesSection
            photos={recentPhotos}
            currentUserId={user.id}
          />
        </div>

        {/* Right: Sidebar / Status */}
        <div className="space-y-6">
          {/* Partner Status Card */}
          {partner ? <PartnerCard partner={partner} /> : <InvitePartnerCard />}

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
