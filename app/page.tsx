import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/login-button";
import ValentineHero from "@/components/valentine-hero";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-300 min-h-150 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-pink-100 dark:border-pink-900/30">
        {/* Left Side - Hero/Decorative */}
        <div className="w-full lg:w-1/2 bg-rose-50 dark:bg-zinc-900/50 p-6 lg:p-0 relative flex items-center justify-center">
          <ValentineHero />
        </div>

        {/* Right Side - Login */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Sign in
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Start your romantic journey
                </p>
              </div>

              <div className="pt-8">
                <LoginButton />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-900 px-2 text-gray-400">
                    Trusted & Secure
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-400 max-w-xs mx-auto">
                By continuing, you agree to spread love and joy on this special
                day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
