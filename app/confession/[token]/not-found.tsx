import Link from "next/link";

/* eslint-disable react/no-unescaped-entities */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-zinc-900 dark:via-rose-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 md:p-12 shadow-xl border border-rose-100 dark:border-rose-900/20 max-w-md text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Confession Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The confession you're looking for doesn't exist or the link is
          invalid.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-medium shadow-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
