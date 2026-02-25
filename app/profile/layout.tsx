import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavigationSidebar } from "@/components/NavigationSidebar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">{children}</div>
    </NavigationSidebar>
  );
}
