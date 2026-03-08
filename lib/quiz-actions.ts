"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Question } from "@/types/quiz";
import { revalidatePath } from "next/cache";

export type QuizSession = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  total_questions: number;
  created_by: string;
  match_score: number | null;
  completed_at: string | null;
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

export async function getQuizzes(
  sortBy: "date_desc" | "date_asc" | "score_desc" | "score_asc" = "date_desc",
  filter: "all" | "completed" | "pending" | "draft" = "all",
) {
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

    let query = supabase
      .from("quiz_sessions")
      .select(
        "id, title, status, created_at, total_questions, created_by, match_score, completed_at",
      )
      .eq("relationship_id", relationshipData.id);

    // Filter logic
    if (filter === "completed") {
      query = query.eq("status", "completed");
    } else if (filter === "pending") {
      query = query.eq("status", "published");
    } else if (filter === "draft") {
      query = query.eq("status", "draft");
    }

    // Sort logic
    if (sortBy === "date_desc") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "date_asc") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "score_desc") {
      query = query.order("match_score", {
        ascending: false,
        nullsFirst: false,
      });
    } else if (sortBy === "score_asc") {
      query = query.order("match_score", {
        ascending: true,
        nullsFirst: false,
      });
    }

    const { data, error } = await query;

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

export async function updateQuizTitle(id: string, title: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("quiz_sessions")
      .update({ title })
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

    // Update session title and question count
    const { error: sessionError } = await supabase
      .from("quiz_sessions")
      .update({
        title,
        status,
        total_questions: questions.length,
      })
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

export async function submitQuizResponses(
  sessionId: string,
  responses: { question_id: string; selected_option: string }[],
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to answer a quiz");
    }

    // Check if already answered - check both score AND existing responses
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("match_score")
      .eq("id", sessionId)
      .single();

    if (session?.match_score !== null) {
      throw new Error(
        "You have already answered this quiz. Answers cannot be changed.",
      );
    }

    const { count: existingRespCount } = await supabase
      .from("quiz_responses")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .eq("answered_by", user.id);

    if (existingRespCount && existingRespCount > 0) {
      throw new Error("You have already submitted answers for this quiz.");
    }

    // Fetch questions to calculate if match
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("id, correct_option")
      .eq("session_id", sessionId);

    if (questionsError || !questions) {
      throw new Error("Failed to fetch questions for validation");
    }

    let matchCount = 0;
    const responsesToInsert = responses.map((r) => {
      const q = questions.find((sq) => sq.id === r.question_id);
      const isMatch = q ? q.correct_option === r.selected_option : false;
      if (isMatch) matchCount++;

      return {
        session_id: sessionId,
        question_id: r.question_id,
        answered_by: user.id,
        selected_option: r.selected_option,
        is_match: isMatch,
      };
    });

    // Use upsert to handle existing responses gracefully.
    // The conflict target is likely question_id + answered_by.
    const { error: insertError } = await supabase
      .from("quiz_responses")
      .upsert(responsesToInsert, {
        onConflict: "question_id,answered_by",
      });

    if (insertError) {
      throw new Error(`Failed to save responses: ${insertError.message}`);
    }

    // Calculate match score
    const matchScore =
      questions.length > 0 ? (matchCount / questions.length) * 100 : 0;

    // Update match score and status using ADMIN client to bypass RLS
    // Partners usually don't have update permission on sessions they didn't create
    const adminSupabase = await createAdminClient();
    const { error: updateError } = await adminSupabase
      .from("quiz_sessions")
      .update({
        match_score: matchScore,
        completed_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Update match score error:", updateError);
      throw new Error(`Failed to update quiz status: ${updateError.message}`);
    }

    // Force revalidation for the specific quiz and the dashboard
    revalidatePath("/quiz", "layout");
    revalidatePath(`/quiz/${sessionId}`, "layout");

    return { success: true, matchScore };
  } catch (error: any) {
    console.error("Quiz submit answers error:", error);
    return {
      success: false,
      error: error.message || "Failed to submit answers",
    };
  }
}

export async function getQuizResults(sessionId: string) {
  try {
    const supabase = await createClient();

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) throw new Error("Quiz not found");

    // Fetch questions
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("session_id", sessionId)
      .order("display_order", { ascending: true });

    if (questionsError) throw questionsError;

    // Fetch responses (partner's answers)
    const { data: responses, error: responsesError } = await supabase
      .from("quiz_responses")
      .select("*")
      .eq("session_id", sessionId);

    if (responsesError) throw responsesError;

    return {
      success: true,
      session,
      questions: questions as Question[],
      responses,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
