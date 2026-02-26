import { getUser, getUserMilestones } from "@/lib/data";
import { redirect } from "next/navigation";
import { MilestonesList } from "@/components/milestones/MilestonesList";
import { MilestoneCalendar } from "@/components/milestones/MilestonesCalendar";
import { CreateMilestoneButton } from "@/components/milestones/CreateMilestonesButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Milestones",
  description:
    "Track and celebrate your special moments together. Mark important dates, anniversaries, and achievements in your relationship journey.",
  keywords: [
    "relationship milestones",
    "anniversary tracker",
    "couple achievements",
    "special moments",
    "relationship goals",
  ],
};

export default async function MilestonesPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const milestones = await getUserMilestones(user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}

      <SectionHeader
        icon={<Heart className="w-6 h-6 text-white" />}
        title={"Our Milestones"}
        description={"Track and celebrate your special moments together"}
        button={<CreateMilestoneButton />}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
          <p className="text-rose-100 text-sm font-medium">Total Milestones</p>
          <p className="text-3xl font-bold mt-2">{milestones.length}</p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">This Year</p>
          <p className="text-3xl font-bold mt-2">
            {
              milestones.filter(
                (m) =>
                  new Date(m.milestone_date).getFullYear() ===
                  new Date().getFullYear(),
              ).length
            }
          </p>
        </div>
        <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Upcoming</p>
          <p className="text-3xl font-bold mt-2">
            {
              milestones.filter((m) => new Date(m.milestone_date) > new Date())
                .length
            }
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Calendar View
        </h2>
        <MilestoneCalendar milestones={milestones} />
      </div>

      {/* List View */}
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700/50">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          All Milestones
        </h2>
        <MilestonesList milestones={milestones} />
      </div>
    </div>
  );
}
