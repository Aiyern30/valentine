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
    params.then((p) => setToken(p.token));
  }, [params]);

  useEffect(() => {
    if (!token) return; // Wait until token is set

    const verifyInvitation = async () => {
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

      if (error || !invitation) {
        console.error("Invitation lookup error:", error);
        setStatus("error");
        return;
      }

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        setStatus("expired");
        return;
      }

      setInviterName(
        invitation.inviter?.display_name ||
          invitation.inviter?.username ||
          "Someone",
      );
      setStatus("valid");
    };

    verifyInvitation();
  }, [token, supabase]);

  async function acceptInvitation() {
    setStatus("loading");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to signup/login with redirect back to this page
      router.push(`/auth/signup?redirect=/invite/${token}`);
      return;
    }

    // Create relationship
    const { data: invitation } = await supabase
      .from("relationship_invitations")
      .select("inviter_id, invitee_email")
      .eq("invitation_token", token)
      .single();

    // Add null check
    if (!invitation) {
      setStatus("error");
      return;
    }

    const { data: relationship, error: relError } = await supabase
      .from("relationships")
      .insert({
        partner1_id: invitation.inviter_id,
        partner2_id: user.id,
        relationship_start_date: new Date().toISOString().split("T")[0],
        status: "active",
      })
      .select()
      .single();

    if (relError || !relationship) {
      console.error("Relationship creation error:", relError);
      setStatus("error");
      return;
    }

    // Update invitation status
    await supabase
      .from("relationship_invitations")
      .update({
        status: "accepted",
        relationship_id: relationship.id,
        accepted_at: new Date().toISOString(),
      })
      .eq("invitation_token", token);

    // Redirect to dashboard
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
