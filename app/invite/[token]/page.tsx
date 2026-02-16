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

    // ✅ Use server-side API to handle invitation acceptance (bypasses RLS issues)
    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ API Error:", result.error);
        setStatus("error");
        return;
      }

      console.log("🎉 Success! Relationship created:", result.relationshipId);
      console.log("🎉 Redirecting to dashboard...");
      router.push("/dashboard?welcome=true");
    } catch (error) {
      console.error("❌ Network error accepting invitation:", error);
      setStatus("error");
    }
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
