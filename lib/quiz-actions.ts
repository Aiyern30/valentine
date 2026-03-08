"use server";

import { createClient } from "@/lib/supabase/server";
import { Question } from "@/types/quiz";
import { revalidatePath } from "next/cache";

export type QuizSession = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  total_questions: number;
  created_by: string;
};

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

    const { data: relationshipData } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .single();

    if (!relationshipData) {
      throw new Error("No active relationship found");
    }

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

    const questionsToInsert = questions.map((q, i) => ({
      session_id: session.id,
      created_by: user.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
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

    revalidatePath("/quiz");
    return { success: true, sessionId: session.id };
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return { success: false, error: error.message || "Failed to submit quiz" };
  }
}

export async function getQuizzes() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not logged in" };

    const { data: relationshipData } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .single();

    if (!relationshipData)
      return { success: false, error: "No active relationship" };

    const { data, error } = await supabase
      .from("quiz_sessions")
      .select("id, title, status, created_at, total_questions, created_by")
      .eq("relationship_id", relationshipData.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, quizzes: data as QuizSession[], userId: user.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteQuiz(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("quiz_sessions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/quiz");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQuiz(
  sessionId: string,
  title: string,
  questions: Question[],
  status: "draft" | "published" = "published",
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in to update a quiz");

    // Verify session belongs to user
    const { data: sessionData, error: verifyError } = await supabase
      .from("quiz_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("created_by", user.id)
      .single();

    if (verifyError || !sessionData)
      throw new Error("Quiz not found or you don't have permission");

    // Update session title
    const { error: sessionError } = await supabase
      .from("quiz_sessions")
      .update({ title, status })
      .eq("id", sessionId);

    if (sessionError)
      throw new Error(`Failed to update quiz session: ${sessionError.message}`);

    // Delete existing questions
    await supabase.from("quiz_questions").delete().eq("session_id", sessionId);

    // Re-insert new questions
    const questionsToInsert = questions.map((q, i) => ({
      session_id: sessionId,
      created_by: user.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      correct_option: q.correct_option,
      display_order: i,
    }));

    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(questionsToInsert);

    if (questionsError)
      throw new Error(`Failed to update questions: ${questionsError.message}`);

    revalidatePath("/quiz");
    revalidatePath(`/quiz/${sessionId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Quiz update error:", error);
    return { success: false, error: error.message || "Failed to update quiz" };
  }
}
