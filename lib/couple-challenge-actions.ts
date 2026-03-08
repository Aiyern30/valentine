"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Challenge = {
  id: string;
  relationship_id: string;
  created_by: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration_days: number;
  due_at: string | null;
  status: string;
  partner1_completed: boolean;
  partner2_completed: boolean;
  proof_photos: string[];
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  display_order: number;
};

export async function getChallenges(
  sortBy: "date_desc" | "date_asc" | "title_asc" = "date_desc",
  filter: "all" | "active" | "completed" = "all",
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not logged in" };

    const { data: relationshipData } = await supabase
      .from("relationships")
      .select("id, partner1_id, partner2_id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .single();

    if (!relationshipData)
      return { success: false, error: "No active relationship" };

    let query = supabase
      .from("couple_challenges")
      .select("*")
      .eq("relationship_id", relationshipData.id);

    if (filter === "active") {
      query = query.eq("status", "active");
    } else if (filter === "completed") {
      query = query.eq("status", "completed");
    }

    if (sortBy === "date_desc") {
      query = query.order("display_order", { ascending: true }); // Default to our custom order
    } else if (sortBy === "date_asc") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "title_asc") {
      query = query.order("title", { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      challenges: data as Challenge[],
      userId: user.id,
      relationshipId: relationshipData.id,
      partnerId:
        relationshipData.partner1_id === user.id
          ? relationshipData.partner2_id
          : relationshipData.partner1_id,
      isPartner1: relationshipData.partner1_id === user.id,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createChallenge(payload: Partial<Challenge>) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not logged in");

    const { data: relationshipData } = await supabase
      .from("relationships")
      .select("id")
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .eq("status", "active")
      .single();

    if (!relationshipData) throw new Error("No active relationship");

    const { data, error } = await supabase
      .from("couple_challenges")
      .insert({
        ...payload,
        relationship_id: relationshipData.id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/couple_challenges");
    return { success: true, challenge: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateChallenge(id: string, payload: Partial<Challenge>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("couple_challenges")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/couple_challenges");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteChallenge(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("couple_challenges")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/couple_challenges");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleChallengeCompletion(
  id: string,
  partnerNumber: 1 | 2,
  completed: boolean,
) {
  try {
    const supabase = await createClient();
    const updateData: any = {};
    if (partnerNumber === 1) updateData.partner1_completed = completed;
    else updateData.partner2_completed = completed;

    const { data: challenge } = await supabase
      .from("couple_challenges")
      .select("partner1_completed, partner2_completed")
      .eq("id", id)
      .single();

    if (challenge) {
      const p1 = partnerNumber === 1 ? completed : challenge.partner1_completed;
      const p2 = partnerNumber === 2 ? completed : challenge.partner2_completed;

      if (p1 && p2) {
        updateData.status = "completed";
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.status = "active";
        updateData.completed_at = null;
      }
    }

    const { error } = await supabase
      .from("couple_challenges")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/couple_challenges");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
