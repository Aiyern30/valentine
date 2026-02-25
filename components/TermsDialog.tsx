"use client";

import { useState } from "react";
import { acceptTerms } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Shield, FileText, Lock } from "lucide-react";

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

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-125 max-h-[85vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Terms of Service & Privacy Policy
          </DialogTitle>
          <DialogDescription className="text-center">
            Please read and accept our terms to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Terms of Service */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-pink-600">
              <FileText className="h-5 w-5" />
              <h3 className="font-semibold text-base">Terms of Service</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-7">
              <p>
                1. <strong>Acceptance:</strong> By using our application, you agree to these terms and all applicable laws.
              </p>
              <p>
                2. <strong>User Conduct:</strong> You agree to use this platform respectfully and not engage in harmful activities.
              </p>
              <p>
                3. <strong>Content:</strong> You retain rights to your content but grant us license to display it within the app.
              </p>
              <p>
                4. <strong>Account:</strong> You are responsible for maintaining the security of your account.
              </p>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-pink-600">
              <Lock className="h-5 w-5" />
              <h3 className="font-semibold text-base">Privacy Policy</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-7">
              <p>
                1. <strong>Data Collection:</strong> We collect profile information, photos, and relationship data you provide.
              </p>
              <p>
                2. <strong>Data Usage:</strong> Your data is used solely to provide app functionality and improve your experience.
              </p>
              <p>
                3. <strong>Data Sharing:</strong> We do not sell or share your personal data with third parties.
              </p>
              <p>
                4. <strong>Data Security:</strong> We implement security measures to protect your information.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-pink-600 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-semibold text-pink-900 dark:text-pink-100">
                  Your Privacy Matters
                </p>
                <p className="text-pink-800 dark:text-pink-200">
                  Your romantic moments are private and secure. We use encryption and secure authentication to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            {isAccepting ? "Accepting..." : "I Accept"}
          </Button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 px-4">
            By clicking &ldquo;I Accept&rdquo;, you agree to our Terms of Service and Privacy Policy
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
