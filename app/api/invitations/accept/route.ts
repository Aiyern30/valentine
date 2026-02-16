// app/api/invitations/accept/route.ts
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { token } = await req.json();
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  console.log("🎯 Server-side invitation acceptance for token:", token);

  // Get current user (using standard client for auth)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("❌ Authentication error:", authError);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("👤 Current user:", user.id);

  // Get invitation details (using admin client to ensure we see it)
  const { data: invitation, error: invError } = await adminSupabase
    .from("relationship_invitations")
    .select(
      "id, inviter_id, invitee_email, status, relationship_id, expires_at",
    )
    .eq("invitation_token", token)
    .eq("status", "pending")
    .single();

  if (invError || !invitation) {
    console.error("❌ Invitation error:", invError);
    return Response.json(
      { error: "Invalid or expired invitation" },
      { status: 400 },
    );
  }

  console.log("📧 Invitation found:", invitation);

  // Check if invitation has expired
  if (new Date(invitation.expires_at) < new Date()) {
    return Response.json({ error: "Invitation has expired" }, { status: 400 });
  }

  let relationshipId = invitation.relationship_id;
  let targetRelationship = null;

  // 1. Try to use the specific relationship linked to the invitation
  if (relationshipId) {
    console.log("🔗 Using relationship ID from invitation:", relationshipId);
    const { data: rel } = await adminSupabase
      .from("relationships")
      .select("*")
      .eq("id", relationshipId)
      .single();

    if (rel) {
      targetRelationship = rel;
    }
  }

  // 2. Fallback: Search for pending relationship if no direct link or link failed
  if (!targetRelationship) {
    console.log(
      "🔍 Searching for pending relationship for inviter:",
      invitation.inviter_id,
    );
    const { data: pendingRelationships } = await adminSupabase
      .from("relationships")
      .select("*")
      .eq("partner1_id", invitation.inviter_id)
      .eq("status", "pending")
      .is("partner2_id", null)
      .order("created_at", { ascending: true });

    if (pendingRelationships && pendingRelationships.length > 0) {
      targetRelationship = pendingRelationships[0];
      relationshipId = targetRelationship.id;
      console.log("🎯 Found pending relationship via search:", relationshipId);
    }
  }

  if (targetRelationship) {
    console.log(
      "📅 Preserving anniversary date:",
      targetRelationship.relationship_start_date,
    );

    // Clean up any existing active relationships for the inviter first
    // (Ensure they don't end up with multiple active ones)
    const { data: activeRelationships } = await adminSupabase
      .from("relationships")
      .select("id")
      .eq("partner1_id", invitation.inviter_id)
      .eq("status", "active")
      .not("partner2_id", "is", null);

    if (activeRelationships && activeRelationships.length > 0) {
      console.log("🧹 Cleaning up duplicate active relationships...");
      for (const duplicate of activeRelationships) {
        await adminSupabase
          .from("relationships")
          .delete()
          .eq("id", duplicate.id);
        console.log(`🗑️ Deleted duplicate: ${duplicate.id}`);
      }
    }

    // Update the pending relationship to active and add the partner
    const { data: updatedRel, error: updateError } = await adminSupabase
      .from("relationships")
      .update({
        partner2_id: user.id,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", relationshipId)
      .select()
      .single();

    if (updateError || !updatedRel) {
      console.error("❌ Failed to update relationship:", updateError);
      return Response.json(
        { error: "Failed to create relationship" },
        { status: 500 },
      );
    }

    console.log("✅ Successfully updated existing relationship to active");
    relationshipId = updatedRel.id;
  } else {
    // 3. Fallback: Create new relationship (Only if no pending one exists)
    console.log("⚠️ No pending relationship found, creating new one");

    const { data: newRel, error: relError } = await adminSupabase
      .from("relationships")
      .insert({
        partner1_id: invitation.inviter_id,
        partner2_id: user.id,
        relationship_start_date: new Date().toISOString().split("T")[0],
        status: "active",
      })
      .select()
      .single();

    if (relError || !newRel) {
      console.error("❌ Failed to create relationship:", relError);
      return Response.json(
        { error: "Failed to create relationship" },
        { status: 500 },
      );
    }

    relationshipId = newRel.id;
  }

  // Update invitation status
  const { error: updateInviteError } = await adminSupabase
    .from("relationship_invitations")
    .update({
      status: "accepted",
      relationship_id: relationshipId,
      accepted_at: new Date().toISOString(),
    })
    .eq("invitation_token", token);

  if (updateInviteError) {
    console.error("❌ Failed to update invitation:", updateInviteError);
    // Don't return error here as the relationship is already created/updated
  }

  console.log("🎉 Invitation accepted successfully!");
  return Response.json({ success: true, relationshipId });
}
