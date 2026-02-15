// components/dashboard/relationship-timer.tsx
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Heart, Edit2, Check, X } from "lucide-react";
import { updateAnniversaryDate } from "@/lib/actions";
export function RelationshipTimer({ startDate }: { startDate: string }) {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState(startDate);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const start = new Date(startDate).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - start;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const days = Math.floor(
        (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24),
      );
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeTogether({ years, days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  async function handleSaveDate() {
    setIsSaving(true);
    setError("");

    const result = await updateAnniversaryDate(editDate);

    if (result.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setIsEditing(false);
    setIsSaving(false);
    // Page will auto-refresh due to revalidatePath in the action
  }

  return (
    <div className="w-full bg-linear-to-r from-rose-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
      <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
        <Heart size={200} fill="currentColor" />
      </div>

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
          aria-label="Edit anniversary date"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-medium text-rose-100 mb-6 font-script">
          We've been loving each other for
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 w-full max-w-4xl text-center">
          <TimeUnit value={timeTogether.years} label="Years" />
          <TimeUnit value={timeTogether.days} label="Days" />
          <TimeUnit value={timeTogether.hours} label="Hours" />
          <TimeUnit value={timeTogether.minutes} label="Minutes" />
          <TimeUnit value={timeTogether.seconds} label="Seconds" />
        </div>

        {/* Anniversary Date Display/Edit */}
        <div className="mt-8 flex items-center gap-3 text-rose-200 text-sm">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-white">Since:</span>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="px-3 py-1.5 bg-white/20 border border-white/40 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isSaving}
              />
              <button
                onClick={handleSaveDate}
                disabled={isSaving}
                className="p-1.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditDate(startDate);
                  setError("");
                }}
                disabled={isSaving}
                className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <span>Since {new Date(startDate).toLocaleDateString()}</span>
              <Heart size={14} className="animate-pulse" fill="currentColor" />
            </>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-200 bg-red-500/20 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
      <span className="text-3xl md:text-5xl font-bold font-mono tabular-nums leading-none mb-2">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs md:text-sm uppercase tracking-wider text-rose-200">
        {label}
      </span>
    </div>
  );
}
