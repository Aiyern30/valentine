// app/api/invitations/send/route.ts
import { createClient } from "@/lib/supabase/server";
import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!,
);

export async function POST(req: Request) {
  const { inviteeEmail } = await req.json();
  const supabase = await createClient();

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
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
    console.error("Database error:", inviteError);
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

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `${inviterProfile?.display_name || "Someone"} invited you to connect!`;
    sendSmtpEmail.to = [{ email: inviteeEmail }];
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to bottom right, #fff1f2, #fce7f3); border-radius: 16px; padding: 32px; text-align: center;">
          <h2 style="color: #e11d48; margin-bottom: 16px;">You've been invited! 💕</h2>
          <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
            <strong>${inviterProfile?.display_name || "Someone special"}</strong> wants to connect with you on LoveSick.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 32px;">
            Click the button below to accept the invitation:
          </p>
          <a href="${inviteLink}" 
             style="display: inline-block; 
                    padding: 14px 28px; 
                    background-color: #f43f5e; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 12px; 
                    font-weight: 600;
                    font-size: 16px;">
            Accept Invitation
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
            This invitation expires in 7 days.
          </p>
        </div>
      </body>
      </html>
    `;
    sendSmtpEmail.sender = {
      name: "LoveSick",
      email: "noreply@lovesick.app",
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", data);

    return Response.json({ success: true, invitation });
  } catch (error) {
    console.error("❌ Email sending exception:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
