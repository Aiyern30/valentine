import { getQASessions } from "@/lib/qa-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Sparkles, Heart } from "lucide-react";
import { DashboardQACard } from "@/components/qa/DashboardQACard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QAFilters } from "@/components/qa/QAFilters";
import { Suspense } from "react";
import { NavigationSidebar } from "@/components/NavigationSidebar";

export const dynamic = "force-dynamic";

export default async function QADashboard({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const sortBy = params?.sortBy || "date_desc";
  const filter = params?.filter || "all";

  const { success, sessions, error, userId } = await getQASessions(
    sortBy as any,
    filter as any,
  );

  if (!success || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-100 text-center max-w-sm w-full">
          <p className="text-rose-600 font-medium">
            {error || "Please log in to view Q&A"}
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

  const ownSessions = sessions?.filter((s) => s.created_by === userId) || [];
  const partnerSessions =
    sessions?.filter((s) => s.created_by !== userId && s.status !== "draft") ||
    [];

  return (
    <NavigationSidebar>
      <div className="min-h-screen pb-32">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-amber-600/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <SectionHeader
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            title="Heartfelt Q&A"
            description={
              "Ask your partner deep questions and share heartfelt answers."
            }
            button={
              <Link href="/qa_questions/new">
                <Button className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 w-full md:w-auto">
                  <Plus size={16} className="mr-2" />
                  Ask Questions
                </Button>
              </Link>
            }
          />

          <Suspense
            fallback={
              <div className="h-16 mb-8 bg-rose-50/50 rounded-2xl animate-pulse" />
            }
          >
            <QAFilters />
          </Suspense>

          {!success ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
              Error loading Q&A: {error}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-20 px-4 border-2 border-dashed border-rose-200 rounded-3xl bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-rose-900 mb-2">
                No Q&A found!
              </h3>
              <p className="text-rose-500 text-sm max-w-sm mx-auto mb-6">
                {filter !== "all"
                  ? "Try changing your filters to see more results."
                  : "Start by asking your partner some heartfelt questions."}
              </p>
              {filter === "all" && (
                <Link href="/qa_questions/new">
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800"
                  >
                    Create first Q&A
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Own Section */}
              {ownSessions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Heart size={20} className="text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Sent by You
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownSessions.map((session) => (
                      <DashboardQACard
                        key={session.id}
                        session={session}
                        userId={userId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Partner Section */}
              {partnerSessions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <MessageCircle size={20} className="text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Sent by Partner
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partnerSessions.map((session) => (
                      <DashboardQACard
                        key={session.id}
                        session={session}
                        userId={userId}
                        isPartnerQA
                      />
                    ))}
                  </div>
                </div>
              )}

              {ownSessions.length === 0 && partnerSessions.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-rose-400 italic">
                    No items match your current filters.
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
