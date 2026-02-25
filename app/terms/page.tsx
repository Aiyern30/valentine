import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TermsDialog from "@/components/TermsDialog";

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
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
      <TermsDialog open={true} />
    </main>
  );
}
