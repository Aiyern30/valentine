// app/api/invitations/accept/route.ts
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { token } = await req.json();
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the pending invitation
  const { data: invitation, error: inviteError } = await supabase
    .from("relationship_invitations")
    .select("*")
    .eq("invitation_token", token)
    .eq("status", "pending")
    .single();

  if (inviteError || !invitation) {
    return Response.json({ error: "Invalid or expired invitation" }, { status: 400 });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return Response.json({ error: "Invitation expired" }, { status: 400 });
  }

  const inviterId = invitation.inviter_id;
  const inviteeId = user.id;

  if (inviterId === inviteeId) {
    return Response.json({ error: "You cannot accept your own invitation" }, { status: 400 });
  }

  // Check if current user already has an active or pending relationship
  const { data: activeRel } = await supabase
    .from("relationships")
    .select("id")
    .or(`partner1_id.eq.${inviteeId},partner2_id.eq.${inviteeId}`)
    .in("status", ["active", "pending"])
    .maybeSingle();

  if (activeRel) {
    return Response.json({ error: "You are already in a relationship" }, { status: 400 });
  }

  // Check if they have an ended relationship together
  const { data: pastRel } = await supabase
    .from("relationships")
    .select("*")
    .or(`and(partner1_id.eq.${inviterId},partner2_id.eq.${inviteeId}),and(partner1_id.eq.${inviteeId},partner2_id.eq.${inviterId})`)
    .eq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let finalRelationshipId;

  if (pastRel) {
    // REACTIVATE past relationship
    finalRelationshipId = pastRel.id;

    // Delete any "pending" relationship created by inviter (via setAnniversary) so it doesn't get orphaned
    const { data: pendingRelForInviter } = await supabase
      .from("relationships")
      .select("id")
      .eq("partner1_id", inviterId)
      .is("partner2_id", null)
      .eq("status", "pending")
      .maybeSingle();

    if (pendingRelForInviter) {
      await supabase.from("relationships").delete().eq("id", pendingRelForInviter.id);
    }

    // Update past relationship to active
    const { error: updateRelError } = await supabase
      .from("relationships")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", pastRel.id);

    if (updateRelError) {
      console.error("❌ Error reactivating relationship:", updateRelError);
      return Response.json({ error: "Failed to reactivate relationship" }, { status: 500 });
    }
  } else {
    // Check if inviter has a pending relationship (from setAnniversary)
    const { data: pendingRel } = await supabase
      .from("relationships")
      .select("*")
      .eq("partner1_id", inviterId)
      .is("partner2_id", null)
      .eq("status", "pending")
      .maybeSingle();

    if (pendingRel) {
      // Connect to pending relationship
      finalRelationshipId = pendingRel.id;
      const { error: updatePendingError } = await supabase
        .from("relationships")
        .update({ partner2_id: inviteeId, status: "active", updated_at: new Date().toISOString() })
        .eq("id", pendingRel.id);

      if (updatePendingError) {
        console.error("❌ Error converting pending relationship:", updatePendingError);
        return Response.json({ error: "Failed to connect to relationship" }, { status: 500 });
      }
    } else {
      // Create a new relationship
      const { data: newRel, error: createError } = await supabase
        .from("relationships")
        .insert({
          partner1_id: inviterId,
          partner2_id: inviteeId,
          relationship_start_date: new Date().toISOString().split("T")[0],
          status: "active"
        })
        .select()
        .single();
      
      if (createError) {
        console.error("❌ Error creating new relationship:", createError);
        return Response.json({ error: "Failed to create relationship" }, { status: 500 });
      }
      finalRelationshipId = newRel.id;
    }
  }

  // Update invitation status
  const { error: acceptError } = await supabase
    .from("relationship_invitations")
    .update({
      status: "accepted",
      relationship_id: finalRelationshipId,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);
    
  if (acceptError) {
     console.error("❌ Error accepting invitation:", acceptError);
  }

  // Cancel any other pending invitations from the inviter
  await supabase
    .from("relationship_invitations")
    .update({ status: "cancelled" })
    .eq("inviter_id", inviterId)
    .eq("status", "pending")
    .neq("id", invitation.id);

  revalidatePath("/dashboard");

  return Response.json({ success: true, relationshipId: finalRelationshipId });
}
