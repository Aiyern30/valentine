import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizBuilder } from "@/components/quiz/QuizBuilder";
import { Question } from "@/types/quiz";

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

  if (!user) return notFound();

  // Fetch the session
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) return notFound();

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

  return <QuizBuilder initialQuiz={initialQuiz} />;
}
