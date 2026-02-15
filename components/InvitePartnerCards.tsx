/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Plus, Mail, Check, X } from "lucide-react";

export function InvitePartnerCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      }, 2000);
    } catch (error) {
      setStatus(error instanceof Error ? "error" : "idle");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <div className="bg-linear-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 text-gray-800 dark:text-gray-200 shadow-md relative overflow-hidden">
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
