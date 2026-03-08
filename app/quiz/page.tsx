import { getQuizzes } from "@/lib/quiz-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Plus, Trash2, Edit2, Play, Users } from "lucide-react";
import { format } from "date-fns";
import { QuizDeleteButton } from "@/components/quiz/QuizDeleteButton";

export default async function QuizDashboard() {
  const { success, quizzes, error, userId } = await getQuizzes();

  const ownQuizzes = quizzes?.filter((q) => q.created_by === userId) || [];
  const partnerQuizzes = quizzes?.filter((q) => q.created_by !== userId) || [];

  return (
    <div className="min-h-screen pb-32">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-pink-500" fill="currentColor" />
              <span className="text-xs text-rose-500 uppercase tracking-widest font-medium">
                双人默契大比拼
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Your Quizzes
            </h1>
            <p className="text-rose-600 text-sm">
              Manage your created quizzes or start a new challenge!
            </p>
          </div>

          <Link href="/quiz/new">
            <Button className="bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20 w-full md:w-auto">
              <Plus size={16} className="mr-2" />
              Create Quiz
            </Button>
          </Link>
        </div>

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
              No quizzes yet!
            </h3>
            <p className="text-rose-500 text-sm max-w-sm mx-auto mb-6">
              Create your first quiz and test how well your partner knows you.
            </p>
            <Link href="/quiz/new">
              <Button
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800"
              >
                Create your first quiz
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Own Quizzes Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart size={20} className="text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Created by You
                </h2>
              </div>
              {ownQuizzes.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-rose-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <p className="text-rose-500 text-sm">
                    You haven't created any quizzes yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownQuizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="bg-white/95 border-rose-200 shadow-xl shadow-rose-200/20 hover:border-rose-300 transition-all"
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-lg text-rose-900 line-clamp-2">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-1.5 shrink-0 ml-4">
                            {quiz.match_score !== null ? (
                              <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] uppercase tracking-wider font-bold shadow-sm">
                                {Math.round(quiz.match_score)}% Score
                              </span>
                            ) : quiz.status === "draft" ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] uppercase tracking-wider font-semibold">
                                Draft
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] uppercase tracking-wider font-semibold">
                                Published
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between text-xs text-rose-500 border-b border-rose-100 pb-3">
                            <span>{quiz.total_questions} Questions</span>
                            <span>
                              {format(new Date(quiz.created_at), "MMM d, yyyy")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Link
                              href={`/quiz/${quiz.id}`}
                              className="flex-1 mr-2"
                            >
                              <Button
                                variant="secondary"
                                className="w-full bg-rose-50 text-rose-700 hover:bg-rose-100"
                                size="sm"
                              >
                                {quiz.match_score !== null ? (
                                  <>
                                    <Play size={13} className="mr-1.5" /> View
                                    Results
                                  </>
                                ) : quiz.status === "draft" ? (
                                  <>
                                    <Edit2 size={13} className="mr-1.5" /> Edit
                                  </>
                                ) : (
                                  <>
                                    <Play size={13} className="mr-1.5" /> View /
                                    Play
                                  </>
                                )}
                              </Button>
                            </Link>
                            {quiz.match_score === null && (
                              <QuizDeleteButton id={quiz.id} />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Partner Quizzes Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Users size={20} className="text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Created by Partner
                </h2>
              </div>
              {partnerQuizzes.length === 0 ? (
                <div className="text-center py-10 px-4 border-2 border-dashed border-violet-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                  <p className="text-violet-500 text-sm">
                    Your partner hasn't created any quizzes yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerQuizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="bg-white/95 border-violet-200 shadow-xl shadow-violet-200/20 hover:border-violet-300 transition-all"
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-lg text-violet-900 line-clamp-2">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-1.5 shrink-0 ml-4">
                            {quiz.match_score !== null ? (
                              <span className="px-2 py-0.5 rounded-full bg-violet-500 text-white text-[10px] uppercase tracking-wider font-bold shadow-sm">
                                {Math.round(quiz.match_score)}% Score
                              </span>
                            ) : quiz.status === "draft" ? (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-semibold">
                                Draft
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] uppercase tracking-wider font-semibold">
                                Published
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between text-xs text-violet-500 border-b border-violet-100 pb-3">
                            <span>{quiz.total_questions} Questions</span>
                            <span>
                              {format(new Date(quiz.created_at), "MMM d, yyyy")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            {quiz.match_score !== null ? (
                              <Link
                                href={`/quiz/${quiz.id}`}
                                className="flex-1"
                              >
                                <Button
                                  variant="secondary"
                                  className="w-full bg-violet-50 text-violet-700 hover:bg-violet-100"
                                  size="sm"
                                >
                                  <Play size={13} className="mr-1.5" /> View
                                  Results
                                </Button>
                              </Link>
                            ) : quiz.status === "draft" ? (
                              <Button
                                variant="secondary"
                                className="w-full bg-slate-50 text-slate-500 hover:bg-slate-50 cursor-not-allowed opacity-75"
                                size="sm"
                                disabled
                              >
                                <Play size={13} className="mr-1.5" /> Partner's
                                Draft
                              </Button>
                            ) : (
                              <Link
                                href={`/quiz/${quiz.id}`}
                                className="flex-1"
                              >
                                <Button
                                  variant="secondary"
                                  className="w-full bg-violet-50 text-violet-700 hover:bg-violet-100"
                                  size="sm"
                                >
                                  <Play size={13} className="mr-1.5" /> Play
                                  Quiz
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
