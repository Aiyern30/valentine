import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ConfessionViewer from "./confession-viewer";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ConfessionPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  // Fetch confession by token
  const { data: confession, error } = await supabase
    .from("confessions")
    .select("*")
    .eq("link_token", token)
    .single();

  if (error || !confession) {
    notFound();
  }

  // Check if expired
  if (confession.expires_at && new Date(confession.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-zinc-900 dark:via-rose-950 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-rose-100 dark:border-rose-900/20 max-w-md text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Link Expired
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This confession link has expired and is no longer available.
          </p>
        </div>
      </div>
    );
  }

  // Mark as opened if not already
  if (!confession.is_opened) {
    await supabase
      .from("confessions")
      .update({
        is_opened: true,
        opened_at: new Date().toISOString(),
      })
      .eq("id", confession.id);
  }

  return <ConfessionViewer confession={confession} />;
}
