"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SharedGoal = {
  id: string;
  relationship_id: string;
  created_by: string;
  title: string;
  description: string | null;
  category: string;
  goal_type: string;
  target_value: number | null;
  unit: string | null;
  frequency: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
  display_order: number;
};

export async function getSharedGoals(
  filter: "active" | "completed" | "all" = "active",
) {
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

    if (!relationshipData) return { success: false, goals: [] };

    let query = supabase
      .from("shared_goals")
      .select("*")
      .eq("relationship_id", relationshipData.id)
      .order("display_order", { ascending: true });

    if (filter === "active") {
      query = query.eq("status", "active");
    } else if (filter === "completed") {
      query = query.eq("status", "completed");
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, goals: data as SharedGoal[], userId: user.id };
  } catch (error: any) {
    return { success: false, error: error.message, goals: [] };
  }
}

export async function createSharedGoal(goal: Partial<SharedGoal>) {
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
      .from("shared_goals")
      .insert({
        ...goal,
        relationship_id: relationshipData.id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/shared_goals");
    return { success: true, goal: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSharedGoal(
  id: string,
  updates: Partial<SharedGoal>,
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("shared_goals")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/shared_goals");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSharedGoal(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("shared_goals").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/shared_goals");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addGoalCheckin(
  goalId: string,
  value: number,
  note?: string,
  mood?: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase.from("goal_checkins").insert({
      goal_id: goalId,
      user_id: user.id,
      value,
      note,
      mood,
    });

    if (error) throw error;

    revalidatePath("/shared_goals");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
