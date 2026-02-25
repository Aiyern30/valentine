"use client";

import { useState } from "react";
import { acceptTerms } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Shield, FileText, Lock, Heart, Loader2 } from "lucide-react";

interface TermsDialogProps {
  open: boolean;
}

export default function TermsDialog({ open }: TermsDialogProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsAccepting(true);
    const result = await acceptTerms();
    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    }
    setIsAccepting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800 flex flex-col">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 border-b border-gray-50 dark:border-zinc-800 flex flex-col items-center gap-3 shrink-0">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
              Terms of Service & Privacy Policy
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please read and accept our terms to continue
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Terms of Service */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Terms of Service
                </h3>
              </div>
              <div className="pl-13 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    1. Acceptance:
                  </strong>{" "}
                  By using our application, you agree to these terms and all
                  applicable laws.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    2. User Conduct:
                  </strong>{" "}
                  You agree to use this platform respectfully and not engage in
                  harmful activities.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    3. Content:
                  </strong>{" "}
                  You retain rights to your content but grant us license to
                  display it within the app.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    4. Account:
                  </strong>{" "}
                  You are responsible for maintaining the security of your
                  account.
                </p>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Privacy Policy
                </h3>
              </div>
              <div className="pl-13 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    1. Data Collection:
                  </strong>{" "}
                  We collect profile information, photos, and relationship data
                  you provide.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    2. Data Usage:
                  </strong>{" "}
                  Your data is used solely to provide app functionality and
                  improve your experience.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    3. Data Sharing:
                  </strong>{" "}
                  We do not sell or share your personal data with third parties.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    4. Data Security:
                  </strong>{" "}
                  We implement security measures to protect your information.
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-linear-to-br from-pink-50 via-rose-50 to-pink-50 dark:from-pink-900/10 dark:via-rose-900/10 dark:to-pink-900/10 border-2 border-pink-200 dark:border-pink-800/50 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    Your Privacy Matters
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your romantic moments are private and secure. We use
                    encryption and secure authentication to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 pt-4 sm:pt-6 border-t border-gray-50 dark:border-zinc-800 space-y-3 shrink-0">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full px-8 py-4 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAccepting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Accepting...
              </>
            ) : (
              <>I Accept</>
            )}
          </button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By clicking &ldquo;I Accept&rdquo;, you agree to our Terms of
            Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
