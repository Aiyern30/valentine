/* eslint-disable react/no-unescaped-entities */
// components/dashboard/partner-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, UserX, AlertTriangle } from "lucide-react";
import { removePartner } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface PartnerCardProps {
  partner: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  async function handleRemovePartner() {
    setIsRemoving(true);
    setError("");

    try {
      const result = await removePartner();

      if (result.error) {
        setError(result.error);
        setIsRemoving(false);
        return;
      }

      // Success - the page will automatically refresh due to revalidatePath
      router.refresh();
    } catch (error) {
      console.error("Error removing partner:", error);
      setError("Failed to remove partner. Please try again.");
      setIsRemoving(false);
    }
  }

  return (
    <>
      <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium opacity-90">Partner Status</h3>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Partner options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden z-20">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowRemoveDialog(true);
                      }}
                      className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                      Remove Partner
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl overflow-hidden">
              {partner?.avatar_url ? (
                <Image
                  src={partner.avatar_url}
                  alt="Partner"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>❤️</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">
                {partner?.display_name || partner?.username || "My Love"}
              </p>
              <p className="text-indigo-100 text-sm">loves you very much</p>
            </div>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Remove Confirmation Dialog */}
      {showRemoveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Remove Partner?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {partner?.display_name ||
                      partner?.username ||
                      "your partner"}
                  </span>
                  ?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This will end your relationship. Your shared memories will be
                  archived, and you'll be able to invite someone new.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRemoveDialog(false);
                  setError("");
                }}
                disabled={isRemoving}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemovePartner}
                disabled={isRemoving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Removing...
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    Remove Partner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
