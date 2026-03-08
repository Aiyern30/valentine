import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { QuizBuilder } from "@/components/quiz/QuizBuilder";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Question } from "@/types/quiz";
import { getQuizResults } from "@/lib/quiz-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch session
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) return notFound();

  // If quiz is completed, show results to everyone in the relationship
  if (session.match_score !== null) {
    const results = await getQuizResults(id);
    if (!results.success) return notFound();
    return <QuizResults quiz={results as any} />;
  }

  // If draft, only creator can see
  if (session.created_by !== user.id && session.status === "draft") {
    return (
      <div className="min-h-screen pt-20 px-4 flex justify-center bg-rose-50/30">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-rose-200/50 text-center border border-rose-100">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-rose-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-rose-900 mb-3">
            Quiz Unavailable
          </h2>
          <p className="text-rose-600 mb-8">
            Your partner is still working on this quiz. Come back later!
          </p>
          <Link href="/quiz">
            <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch questions
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("session_id", session.id)
    .order("display_order", { ascending: true });

  const initialQuiz = {
    id: session.id,
    title: session.title,
    questions: questions as Question[],
  };

  // Enforce partner answers, creator edits
  if (session.created_by !== user.id) {
    return <QuizPlayer quiz={initialQuiz} />;
  }

  return <QuizBuilder initialQuiz={initialQuiz} />;
}
