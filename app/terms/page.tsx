import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TermsDialog from "@/components/TermsDialog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read our terms and conditions for using SweetDays. Learn about our privacy policy and user agreements.",
  keywords: ["terms", "conditions", "privacy policy", "user agreement"],
};

export default async function TermsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check if user already accepted terms
  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted")
    .eq("id", user.id)
    .single();

  // If already accepted, redirect to dashboard
  if (profile?.terms_accepted) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100  flex items-center justify-center p-4">
      <TermsDialog open={true} />
    </main>
  );
}
