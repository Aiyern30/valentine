import { getSharedGoals } from "@/lib/goal-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Target, Plus, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { GoalCard } from "@/components/goals/GoalCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Suspense } from "react";
import { NavigationSidebar } from "@/components/NavigationSidebar";

export const dynamic = "force-dynamic";

export default async function SharedGoalsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params?.filter || "active";

  const { success, goals, error, userId } = await getSharedGoals(filter as any);

  if (!success || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 text-center max-w-sm w-full">
          <p className="text-rose-600 font-medium">
            {error || "Please log in to view Shared Goals"}
          </p>
          <Link href="/login" className="mt-4 block">
            <Button className="w-full bg-rose-600 hover:bg-rose-500 text-white">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeGoals = goals?.filter((g) => g.status === "active") || [];
  const achievedGoals = goals?.filter((g) => g.status === "completed") || [];

  return (
    <NavigationSidebar>
      <div className="min-h-screen pb-32">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-sky-600/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <SectionHeader
            icon={<Target className="w-6 h-6 text-white" />}
            title="Grow Together"
            description={
              "Dream high, start small. Track your shared achievements and habits."
            }
            button={
              <Link href="/shared_goals/new">
                <Button className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 w-full md:w-auto">
                  <Plus size={16} className="mr-2" />
                  New Shared Goal
                </Button>
              </Link>
            }
          />

          {/* Filters (Simplified for now) */}
          <div className="flex gap-4">
            <Link href="/shared_goals?filter=active">
              <Button
                variant={filter === "active" ? "default" : "outline"}
                className={cn(
                  "rounded-xl",
                  filter === "active"
                    ? "bg-rose-600"
                    : "border-rose-100 text-rose-600 hover:bg-rose-50",
                )}
              >
                Active Goals
              </Button>
            </Link>
            <Link href="/shared_goals?filter=completed">
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                className={cn(
                  "rounded-xl",
                  filter === "completed"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "border-emerald-100 text-emerald-600 hover:bg-emerald-50",
                )}
              >
                Achieved
              </Button>
            </Link>
          </div>

          {!goals || goals.length === 0 ? (
            <div className="text-center py-20 px-4 border-2 border-dashed border-rose-200 rounded-3xl bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-rose-900 mb-2">
                No goals planted yet!
              </h3>
              <p className="text-rose-500 text-sm max-w-sm mx-auto mb-6">
                {filter === "completed"
                  ? "Finish your first goal to see it here! ✨"
                  : "Start your journey together by setting your first shared goal."}
              </p>
              {filter === "active" && (
                <Link href="/shared_goals/new">
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800"
                  >
                    Set a Goal
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Active Goals Section */}
              {(filter === "active" || filter === "all") &&
                activeGoals.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-rose-100 rounded-lg">
                        <TrendingUp size={20} className="text-rose-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Currently Building
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeGoals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} userId={userId} />
                      ))}
                    </div>
                  </div>
                )}

              {/* Achieved Section */}
              {(filter === "completed" || filter === "all") &&
                achievedGoals.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Sparkles size={20} className="text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Celebrated Achievements
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {achievedGoals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} userId={userId} />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </NavigationSidebar>
  );
}

// Helper for cn
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
