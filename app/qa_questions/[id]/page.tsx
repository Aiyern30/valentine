import { getQASessionDetails } from "@/lib/qa-actions";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { QABuilder } from "@/components/qa/QABuilder";
import { MessageCircle, Heart, CheckCircle2, Send } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { QAAnswerForm } from "@/components/qa/QAAnswerForm";

export default async function QADetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, session, questions, error } = await getQASessionDetails(id);

  if (!success || !session) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isCreator = session.created_by === user.id;

  // ─── Case 1: Creator view (Edit mode) ──────────────────────────────────
  if (isCreator && session.status !== "completed") {
    return (
      <div className="min-h-screen bg-rose-50/30">
        <div className="relative max-w-4xl mx-auto px-4 py-10 pb-32">
          <SectionHeader
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            title="Edit Q&A"
            description="Update your questions and let your partner answer again 💕"
            button={
              <a href="/qa_questions">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
              </a>
            }
          />
          <div className="mt-10">
            <QABuilder
              initialData={{ title: session.title, questions }}
              sessionId={session.id}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Case 2: Partner view (Answer mode) ─────────────────────────────────
  if (!isCreator && session.status === "published") {
    return (
      <div className="min-h-screen bg-rose-50/30">
        <div className="relative max-w-4xl mx-auto px-4 py-10 pb-32">
          <SectionHeader
            icon={<Heart className="w-6 h-6 text-white" />}
            title={session.title || "Partner Q&A"}
            description="Your partner wants to know you better! Answer these questions from the heart."
          />
          <div className="mt-10">
            <QAAnswerForm questions={questions} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Case 3: Completed View (Both parties) ──────────────────────────────
  return (
    <div className="min-h-screen bg-rose-50/20">
      <div className="relative max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {session.title}
          </h1>
          <p className="text-gray-500 italic">
            "Love is in the details of the heart."
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q: any, i: number) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  Question {i + 1}
                </span>
                {q.category && (
                  <span className="px-2 py-0.5 bg-gray-50 text-[10px] text-gray-400 rounded-full border border-gray-100 italic">
                    {q.category}
                  </span>
                )}
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                {q.question_text}
              </p>

              <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={14} className="text-rose-400" />
                  <span className="text-[10px] font-bold text-rose-400 uppercase">
                    Partner's Answer
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  {q.qa_answers?.[0]?.answer_text || "No answer yet..."}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="/qa_questions">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-rose-500"
            >
              Return to Dashboard
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
