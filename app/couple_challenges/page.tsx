import { getChallenges } from "@/lib/couple-challenge-actions";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { ChallengeDashboard } from "@/components/challenges/ChallengeDashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CoupleChallengesPage() {
  const { success, challenges, userId, error, isPartner1 } =
    await getChallenges();

  if (!success || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50/30 px-4">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-rose-100 text-center max-w-md w-full backdrop-blur-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl animate-bounce">🔐</span>
          </div>
          <p className="text-rose-600 font-bold text-xl mb-6">
            {error || "Your love story needs to sign in first"}
          </p>
          <Link href="/login" className="block">
            <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold h-12 rounded-2xl shadow-lg shadow-pink-200">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <NavigationSidebar>
      <div className="min-h-screen pb-32 bg-rose-50/20">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/8 blur-[100px] rounded-full" />
        </div>

        <ChallengeDashboard
          initialChallenges={challenges || []}
          userId={userId}
          isPartner1={!!isPartner1}
        />
      </div>
    </NavigationSidebar>
  );
}
