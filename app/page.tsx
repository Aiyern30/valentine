import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/login-button";
import ValentineHero from "@/components/valentine-hero";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1200px] min-h-[600px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-pink-100 dark:border-pink-900/30">
        {/* Left Side - Hero/Decorative */}
        <div className="w-full lg:w-1/2 bg-rose-50 dark:bg-zinc-900/50 p-6 lg:p-0 relative flex items-center justify-center">
          <ValentineHero />
        </div>

        {/* Right Side - Login */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <div className="w-full max-w-sm space-y-8">
            {user ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-24 h-24 bg-linear-to-tr from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-rose-900/20">
                  <span className="text-4xl">🥰</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-rose-500 to-pink-600">
                    Welcome Back!
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <form action="/auth/signout" method="post">
                  <button className="w-full py-3 px-6 rounded-xl border-2 border-rose-100 hover:border-rose-200 text-rose-500 font-medium transition-all hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:border-rose-900/50">
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
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
                  By continuing, you agree to spread love and joy on this
                  special day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
