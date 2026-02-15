/* eslint-disable react/no-unescaped-entities */
// app/invite/[token]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [status, setStatus] = useState<
    "loading" | "valid" | "expired" | "error"
  >("loading");

  const [inviterName, setInviterName] = useState("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();
  const supabase = createClient();

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => {
      console.log("📍 Token from params:", p.token);
      setToken(p.token);
    });
  }, [params]);

  useEffect(() => {
    if (!token) {
      console.log("⏳ Waiting for token...");
      return;
    }

    const verifyInvitation = async () => {
      console.log("🔍 Verifying invitation with token:", token);

      const { data: invitation, error } = await supabase
        .from("relationship_invitations")
        .select(
          `
          *,
          inviter:profiles!inviter_id(display_name, username)
        `,
        )
        .eq("invitation_token", token)
        .eq("status", "pending")
        .single();

      console.log("📧 Invitation data:", invitation);
      console.log("❌ Error:", error);

      if (error || !invitation) {
        console.error("Invitation lookup error:", error);
        setStatus("error");
        return;
      }

      // Check if expired
      const expiryDate = new Date(invitation.expires_at);
      const now = new Date();
      console.log("⏰ Expiry date:", expiryDate);
      console.log("⏰ Current date:", now);
      console.log("⏰ Is expired?", expiryDate < now);

      if (expiryDate < now) {
        setStatus("expired");
        return;
      }

      const name =
        invitation.inviter?.display_name ||
        invitation.inviter?.username ||
        "Someone";

      console.log("👤 Inviter name:", name);
      setInviterName(name);
      setStatus("valid");
    };

    verifyInvitation();
  }, [token, supabase]);

  async function acceptInvitation() {
    console.log("✅ Accepting invitation...");
    setStatus("loading");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("👤 Current user:", user);

    if (!user) {
      console.log("❌ No user, redirecting to signup");
      router.push(`/auth/signup?redirect=/invite/${token}`);
      return;
    }

    // Get invitation details
    const { data: invitation, error: invError } = await supabase
      .from("relationship_invitations")
      .select("inviter_id, invitee_email")
      .eq("invitation_token", token)
      .single();

    console.log("📧 Invitation details:", invitation);
    console.log("❌ Invitation error:", invError);

    if (!invitation) {
      console.error("❌ No invitation found");
      setStatus("error");
      return;
    }

    // ✅ IMPORTANT: Check if inviter has a pending relationship with an anniversary date
    const { data: existingRelationship, error: existingError } = await supabase
      .from("relationships")
      .select("id, relationship_start_date, partner1_id")
      .eq("partner1_id", invitation.inviter_id)
      .eq("status", "pending")
      .is("partner2_id", null)
      .maybeSingle();

    console.log("🔗 Existing relationship:", existingRelationship);
    console.log("❌ Existing relationship error:", existingError);

    let relationshipId;

    if (existingRelationship) {
      // ✅ Update existing relationship - keeps the original anniversary date!
      console.log("🔄 Updating existing relationship...");
      console.log(
        "📅 Using anniversary date:",
        existingRelationship.relationship_start_date,
      );

      const { data: updatedRel, error: updateError } = await supabase
        .from("relationships")
        .update({
          partner2_id: user.id,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRelationship.id)
        .select()
        .single();

      console.log("✅ Updated relationship:", updatedRel);
      console.log("❌ Update error:", updateError);

      if (updateError || !updatedRel) {
        console.error("Relationship update error:", updateError);
        setStatus("error");
        return;
      }

      relationshipId = updatedRel.id;
    } else {
      // ❌ Fallback: If no pending relationship exists, create new one
      // This should rarely happen - only if inviter didn't set anniversary first
      console.log(
        "➕ Creating new relationship (no pending relationship found)...",
      );

      const { data: newRel, error: relError } = await supabase
        .from("relationships")
        .insert({
          partner1_id: invitation.inviter_id,
          partner2_id: user.id,
          relationship_start_date: new Date().toISOString().split("T")[0],
          status: "active",
        })
        .select()
        .single();

      console.log("✅ New relationship:", newRel);
      console.log("❌ Create error:", relError);

      if (relError || !newRel) {
        console.error("Relationship creation error:", relError);
        setStatus("error");
        return;
      }

      relationshipId = newRel.id;
    }

    // Update invitation status
    console.log("📝 Updating invitation status...");
    const { error: updateInviteError } = await supabase
      .from("relationship_invitations")
      .update({
        status: "accepted",
        relationship_id: relationshipId,
        accepted_at: new Date().toISOString(),
      })
      .eq("invitation_token", token);

    console.log("❌ Update invite error:", updateInviteError);

    console.log("🎉 Success! Redirecting to dashboard...");
    router.push("/dashboard?welcome=true");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invitation Expired
          </h1>
          <p className="text-gray-600">
            This invitation link has expired. Please ask your partner to send a
            new one.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Invitation
          </h1>
          <p className="text-gray-600">
            This invitation link is invalid or has already been used.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-rose-50 to-pink-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            You're Invited!
          </h1>
          <p className="text-gray-600">
            <span className="font-semibold text-rose-600">{inviterName}</span>{" "}
            wants to connect with you
          </p>
        </div>

        <button
          onClick={acceptInvitation}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-medium transition-colors"
        >
          Accept Invitation
        </button>
      </div>
    </div>
  );
}
