import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/login-button";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-zinc-900">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm lg:flex-col">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-400">
          Valentine App
        </h1>

        <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg flex flex-col items-center gap-6">
          {user ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                ❤️
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Welcome Back!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <form action="/auth/signout" method="post">
                <button className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Sign In
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Login to access your valentine wishes
                </p>
              </div>
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
