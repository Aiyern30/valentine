/* eslint-disable @typescript-eslint/no-explicit-any */
import { getQuizzes } from "@/lib/quiz-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Users } from "lucide-react";
import { DashboardQuizCard } from "@/components/quiz/DashboardQuizCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuizFilters } from "@/components/quiz/QuizFilters";
import { Suspense } from "react";
import { NavigationSidebar } from "@/components/NavigationSidebar";

export const dynamic = "force-dynamic";

export default async function QuizDashboard({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const sortBy = params?.sortBy || "date_desc";
  const filter = params?.filter || "all";

  const { success, quizzes, error, userId } = await getQuizzes(
    sortBy as any,
    filter as any,
  );

  if (!success || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 text-center max-w-sm w-full">
          <p className="text-rose-600 font-medium">
            {error || "Please log in to view quizzes"}
          </p>
          <Link href="/login" className="mt-4 block">
            <Button className="w-full bg-pink-600 hover:bg-pink-500">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ownQuizzes = quizzes?.filter((q) => q.created_by === userId) || [];
  const partnerQuizzes =
    quizzes?.filter((q) => q.created_by !== userId && q.status !== "draft") ||
    [];

  return (
    <NavigationSidebar>
      <div className="min-h-screen pb-32">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-pink-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-100 h-75 bg-violet-600/8 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <SectionHeader
            icon={<Heart className="w-6 h-6 text-white" />}
            title="Your Quizzes"
            description={
              "Manage your created quizzes or start a new challenge!"
            }
            button={
              <Link href="/quiz/new">
                <Button className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20 w-full md:w-auto">
                  <Plus size={16} className="mr-2" />
                  Create Quiz
                </Button>
              </Link>
            }
          />

          {/* Sorting and Filtering UI */}
          <Suspense
            fallback={
              <div className="h-16 mb-8 bg-rose-50/50 rounded-2xl animate-pulse" />
            }
          >
            <QuizFilters />
          </Suspense>

          {!success ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
              Error loading quizzes: {error}
            </div>
          ) : !quizzes || quizzes.length === 0 ? (
            <div className="text-center py-20 px-4 border-2 border-dashed border-rose-200 rounded-2xl bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-rose-900 mb-2">
                No quizzes found!
              </h3>
              <p className="text-rose-500 text-sm max-w-sm mx-auto mb-6">
                {filter !== "all"
                  ? "Try changing your filters to see more results."
                  : "Create your first quiz and test how well your partner knows you."}
              </p>
              {filter === "all" && (
                <Link href="/quiz/new">
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800"
                  >
                    Create your first quiz
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Own Quizzes Section */}
              {ownQuizzes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Heart size={20} className="text-pink-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Created by You
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ownQuizzes.map((quiz) => (
                      <DashboardQuizCard
                        key={quiz.id}
                        quiz={quiz}
                        userId={userId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Partner Quizzes Section */}
              {partnerQuizzes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Users size={20} className="text-violet-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Created by Partner
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partnerQuizzes.map((quiz) => (
                      <DashboardQuizCard
                        key={quiz.id}
                        quiz={quiz}
                        userId={userId}
                        isPartnerQuiz
                      />
                    ))}
                  </div>
                </div>
              )}

              {ownQuizzes.length === 0 && partnerQuizzes.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-rose-400 italic">
                    No quizzes match your current filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </NavigationSidebar>
  );
}
