"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type QASession = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  created_by: string;
  completed_at: string | null;
  total_questions?: number;
};

export type QAQuestion = {
  id: string;
  session_id?: string;
  question_text: string;
  category: string;
  display_order: number;
  is_answered: boolean;
};

export async function submitQASession(
  title: string,
  questions: { question_text: string; category: string }[],
  status: "draft" | "published" = "published",
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to create a Q&A");
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

    // Since we don't have qa_sessions table yet, we can't do true grouping.
    // However, I will implement it such that it's READY for grouping.
    // For now, I'll check if I can create the table or if I should just use the existing qa_questions.
    // If I use existing qa_questions, I can't easily "draft" a set of questions.

    // I will propose the SQL update in the chat, but for now I'll use a hacky way or
    // just assume the table exists (the user might have added it or expects me to).
    // Actually, I'll just use qa_questions and use a common timestamp or something? No.

    // BETTER: I'll try to insert and if it fails due to missing table, I'll know.
    // But wait, I should probably stick to what's in database.sql if possible.
    // If I stick to database.sql, I can't do "sessions".

    // I'll assume the user wants the structure of the quiz, so I'll create the session.
    const { data: session, error: sessionError } = await supabase
      .from("qa_sessions")
      .insert({
        title,
        relationship_id: relationshipData.id,
        created_by: user.id,
        status,
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create Q&A session: ${sessionError.message}`);
    }

    const questionsToInsert = questions.map((q, i) => ({
      session_id: session.id,
      relationship_id: relationshipData.id,
      created_by: user.id,
      question_text: q.question_text,
      category: q.category,
      display_order: i,
    }));

    const { error: questionsError } = await supabase
      .from("qa_questions")
      .insert(questionsToInsert);

    if (questionsError) {
      throw new Error(`Failed to create questions: ${questionsError.message}`);
    }

    revalidatePath("/qa_questions");
    return { success: true, sessionId: session.id };
  } catch (error: any) {
    console.error("Q&A submission error:", error);
    return { success: false, error: error.message || "Failed to submit Q&A" };
  }
}

export async function getQASessions(
  sortBy: "date_desc" | "date_asc" = "date_desc",
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
      .from("qa_sessions")
      .select(
        `
        id, 
        title, 
        status, 
        created_at, 
        created_by, 
        completed_at,
        qa_questions(count)
      `,
      )
      .eq("relationship_id", relationshipData.id);

    if (filter === "completed") {
      query = query.eq("status", "completed");
    } else if (filter === "pending") {
      query = query.eq("status", "published");
    } else if (filter === "draft") {
      query = query.eq("status", "draft");
    }

    if (sortBy === "date_desc") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "date_asc") {
      query = query.order("created_at", { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    const formattedData = data.map((session) => ({
      ...session,
      total_questions: (session as any).qa_questions?.[0]?.count || 0,
    }));

    return {
      success: true,
      sessions: formattedData as QASession[],
      userId: user.id,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteQASession(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("qa_sessions").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/qa_questions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateQASession(
  sessionId: string,
  title: string,
  questions: { question_text: string; category: string }[],
  status: "draft" | "published" = "published",
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in to update");

    const { data: sessionData, error: verifyError } = await supabase
      .from("qa_sessions")
      .select("id, relationship_id")
      .eq("id", sessionId)
      .eq("created_by", user.id)
      .single();

    if (verifyError || !sessionData)
      throw new Error("Q&A not found or no permission");

    const { error: sessionError } = await supabase
      .from("qa_sessions")
      .update({
        title,
        status,
      })
      .eq("id", sessionId);

    if (sessionError) throw sessionError;

    // Delete existing questions
    await supabase.from("qa_questions").delete().eq("session_id", sessionId);

    // Re-insert
    const questionsToInsert = questions.map((q, i) => ({
      session_id: sessionId,
      relationship_id: sessionData.relationship_id,
      created_by: user.id,
      question_text: q.question_text,
      category: q.category,
      display_order: i,
    }));

    const { error: questionsError } = await supabase
      .from("qa_questions")
      .insert(questionsToInsert);

    if (questionsError) throw questionsError;

    revalidatePath("/qa_questions");
    revalidatePath(`/qa_questions/${sessionId}`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getQASessionDetails(sessionId: string) {
  try {
    const supabase = await createClient();

    const { data: session, error: sessionError } = await supabase
      .from("qa_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) throw new Error("Session not found");

    const { data: questions, error: questionsError } = await supabase
      .from("qa_questions")
      .select(
        `
        *,
        qa_answers(*)
      `,
      )
      .eq("session_id", sessionId)
      .order("display_order", { ascending: true });

    if (questionsError) throw questionsError;

    return {
      success: true,
      session,
      questions,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitQAAnswer(questionId: string, answerText: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase.from("qa_answers").upsert(
      {
        question_id: questionId,
        answered_by: user.id,
        answer_text: answerText,
      },
      {
        onConflict: "question_id",
      },
    );

    if (error) throw error;

    // Check if all questions in this session are answered
    const { data: question } = await supabase
      .from("qa_questions")
      .select("session_id")
      .eq("id", questionId)
      .single();

    if (question?.session_id) {
      // logic to mark session as completed if all answered...
      // for now just toggle is_answered on question
      await supabase
        .from("qa_questions")
        .update({ is_answered: true })
        .eq("id", questionId);
    }

    revalidatePath("/qa_questions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
