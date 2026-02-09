"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export function RelationshipTimer({ startDate }: { startDate: string }) {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <div className="w-full bg-linear-to-r from-rose-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20" />
      <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
        <Heart size={200} fill="currentColor" />
      </div>

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

        <div className="mt-8 flex items-center gap-2 text-rose-200 text-sm">
          <span>Since {new Date(startDate).toLocaleDateString()}</span>
          <Heart size={14} className="animate-pulse" fill="currentColor" />
        </div>
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
