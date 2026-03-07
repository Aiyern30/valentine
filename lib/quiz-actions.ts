"use server";

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/types/quiz";
import { revalidatePath } from "next/cache";

export async function submitQuiz(
  title: string,
  questions: Question[],
  status: "draft" | "published" = "published",
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to create a quiz");
    }

    // Get user's active relationship
    const { data: relationshipData } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .single();

    if (!relationshipData) {
      throw new Error("No active relationship found");
    }

    // Create quiz session
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .insert({
        title,
        relationship_id: relationshipData.id,
        created_by: user.id,
        status,
        total_questions: questions.length,
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create quiz session: ${sessionError.message}`);
    }

    // Create questions
    const questionsToInsert = questions.map((q, i) => ({
      session_id: session.id,
      created_by: user.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options, // JsonB handles standard objects correctly
      correct_option: q.correct_option,
      display_order: i,
    }));

    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert);

    if (questionsError) {
      throw new Error(
        `Failed to create quiz questions: ${questionsError.message}`,
      );
    }

    revalidatePath("/quiz"); // Refresh whatever endpoints might be listing quizzes
    return { success: true, sessionId: session.id };
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return { success: false, error: error.message || "Failed to submit quiz" };
  }
}
