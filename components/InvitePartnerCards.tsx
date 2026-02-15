/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Mail,
  Check,
  X,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PendingInvitation {
  id: string;
  invitee_email: string;
  created_at: string;
  expires_at: string;
  status: string;
}

export function InvitePartnerCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [pendingInvitations, setPendingInvitations] = useState<
    PendingInvitation[]
  >([]);

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(
    null,
  );
  const [cancellingEmail, setCancellingEmail] = useState<string>("");

  const supabase = createClient();

  // Function for other components to use (not in useEffect)
  const fetchPendingInvitations = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("relationship_invitations")
        .select("id, invitee_email, created_at, expires_at, status")
        .eq("inviter_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPendingInvitations(data);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  }, [supabase]);

  // Fetch pending invitations and setup real-time subscription
  useEffect(() => {
    // Define async logic directly in useEffect
    const loadInvitations = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("relationship_invitations")
          .select("id, invitee_email, created_at, expires_at, status")
          .eq("inviter_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setPendingInvitations(data);
        }
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };

    loadInvitations();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("invitation-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "relationship_invitations",
        },
        () => {
          fetchPendingInvitations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPendingInvitations, supabase]);

  async function sendInvitation() {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/invitations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send invitation");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setEmail("");
        fetchPendingInvitations(); // Refresh the list
      }, 2000);
    } catch (error) {
      setStatus(error instanceof Error ? "error" : "idle");
      setErrorMessage("Network error. Please try again.");
    }
  }

  function openCancelDialog(invitationId: string, email: string) {
    setInvitationToCancel(invitationId);
    setCancellingEmail(email);
    setCancelDialogOpen(true);
  }

  async function confirmCancelInvitation() {
    if (!invitationToCancel) return;

    try {
      await supabase
        .from("relationship_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitationToCancel);

      fetchPendingInvitations();
      setCancelDialogOpen(false);
      setInvitationToCancel(null);
      setCancellingEmail("");
    } catch (error) {
      console.error("Error cancelling invitation:", error);
    }
  }

  function getTimeRemaining(expiresAt: string): string {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return "Expires soon";
  }

  // If there are pending invitations, show them
  if (pendingInvitations.length > 0) {
    return (
      <>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 text-gray-800 dark:text-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Pending Invitations</h3>
            <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full">
              {pendingInvitations.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white dark:bg-zinc-700/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        {getTimeRemaining(invitation.expires_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {invitation.invitee_email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Sent{" "}
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      openCancelDialog(invitation.id, invitation.invitee_email)
                    }
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Cancel invitation"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Waiting for your partner to accept the invitation
          </p>
        </div>

        {/* Cancel Confirmation Dialog */}
        {cancelDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    Cancel Invitation?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to cancel the invitation sent to{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {cancellingEmail}
                    </span>
                    ?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    They will no longer be able to use this invitation link.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCancelDialogOpen(false);
                    setInvitationToCancel(null);
                    setCancellingEmail("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium transition-colors"
                >
                  Keep Invitation
                </button>
                <button
                  onClick={confirmCancelInvitation}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // If no pending invitations, show the invite button
  return (
    <>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 text-gray-800 dark:text-gray-200 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-medium mb-4">Invite Partner</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Connect with your special someone to unlock shared features.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Send Invite
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Invite Your Partner</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">
                  Invitation sent successfully!
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter your partner's email address. They'll receive an
                  invitation link to join you.
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-rose-500 outline-none"
                    disabled={status === "loading"}
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
                )}

                <button
                  onClick={sendInvitation}
                  disabled={!email || status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-medium transition-colors"
                >
                  {status === "loading" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
