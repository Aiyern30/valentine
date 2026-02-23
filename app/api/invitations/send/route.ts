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

  // Check if user already has an ACTIVE relationship OR is already partner2 in a relationship
  const { data: existingRelationship } = await supabase
    .from("relationships")
    .select("*")
    .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
    .single();

  if (existingRelationship) {
    // If user is partner2 in any relationship, they can't send invitations
    if (existingRelationship.partner2_id === user.id) {
      return Response.json(
        { error: "You are already in a relationship" },
        { status: 400 },
      );
    }

    // If user is partner1 AND the relationship is active (has both partners), they can't send new invitations
    if (
      existingRelationship.partner1_id === user.id &&
      existingRelationship.partner2_id !== null &&
      existingRelationship.status === "active"
    ) {
      return Response.json(
        { error: "You already have an active relationship" },
        { status: 400 },
      );
    }

    // If user is partner1 and relationship is pending (they set anniversary, now inviting partner) - ALLOW
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
    .select("display_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  const inviterName =
    inviterProfile?.display_name || inviterProfile?.username || "Someone";

  // ✅ Improved URL detection with fallback
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // If not set, try to get from request headers
  if (!baseUrl) {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  }

  const inviteLink = `${baseUrl}/invite/${invitationToken}`;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `${inviterName} invited you to LoveSick! 💕`;
    sendSmtpEmail.to = [{ email: inviteeEmail }];
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); padding: 40px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">💕 LoveSick</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">You've been invited!</h2>
                    
                    <p style="color: #4b5563; font-size: 16px; margin: 0 0 24px 0;">
                      <strong style="color: #e11d48; font-size: 18px;">${inviterName}</strong> wants to connect with you on <strong>LoveSick</strong>.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 15px; margin: 0 0 32px 0;">
                      LoveSick helps couples share memories, plan dates, and stay connected. Accept this invitation to start your journey together! ✨
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 0 0 32px 0;">
                          <a href="${inviteLink}" 
                             style="display: inline-block; 
                                    padding: 16px 40px; 
                                    background-color: #f43f5e; 
                                    color: white; 
                                    text-decoration: none; 
                                    border-radius: 12px; 
                                    font-weight: 600;
                                    font-size: 16px;
                                    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);">
                            Accept Invitation →
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Alternative Link -->
                    <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
                      Or copy this link: <br/>
                      <a href="${inviteLink}" style="color: #f43f5e; word-break: break-all;">${inviteLink}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
                      This invitation expires in 7 days.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      This email was sent from LoveSick because ${inviterName} invited you to connect.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // ✅ Use custom sender name from user's display name
    sendSmtpEmail.sender = {
      name: `${inviterName} (via LoveSick)`, // Shows who invited them
      email: "aiyern30@gmail.com",
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return Response.json({
      success: true,
      invitation,
      messageId: data.body.messageId,
    });
  } catch (error) {
    console.error("❌ Email sending exception:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
