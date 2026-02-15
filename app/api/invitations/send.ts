// api/invitations/send.ts
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { inviteeEmail } = await req.json();
  const supabase = await createClient(); // Add await here

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has a relationship
  const { data: existingRelationship } = await supabase
    .from("relationships")
    .select("*")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .single();

  if (existingRelationship) {
    return Response.json(
      { error: "You already have an active relationship" },
      { status: 400 },
    );
  }

  // Check for pending invitation
  const { data: pendingInvite } = await supabase
    .from("relationship_invitations")
    .select("*")
    .eq("inviter_id", user.id)
    .eq("status", "pending")
    .single();

  if (pendingInvite) {
    return Response.json(
      { error: "You already have a pending invitation" },
      { status: 400 },
    );
  }

  // Generate unique token
  const invitationToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Create invitation record
  const { data: invitation, error: inviteError } = await supabase
    .from("relationship_invitations")
    .insert({
      inviter_id: user.id,
      invitee_email: inviteeEmail,
      invitation_token: invitationToken,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (inviteError) {
    return Response.json(
      { error: "Failed to create invitation" },
      { status: 500 },
    );
  }

  // Get inviter profile
  const { data: inviterProfile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .single();

  // Send email
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`;

  await resend.emails.send({
    from: "lovesick@gmail.com",
    to: inviteeEmail,
    subject: `${inviterProfile?.display_name || "Someone"} invited you to connect!`,
    html: `
      <h2>You've been invited! 💕</h2>
      <p>${inviterProfile?.display_name || "Someone special"} wants to connect with you on LoveSick.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #f43f5e; color: white; text-decoration: none; border-radius: 8px;">Accept Invitation</a>
      <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
    `,
  });

  return Response.json({ success: true, invitation });
}
