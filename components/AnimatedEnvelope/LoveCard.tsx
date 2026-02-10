import React from "react";
import { Heart } from "lucide-react";
export function LoveCard() {
  return (
    <div className="w-full h-full bg-[#fffcf5] rounded-lg shadow-sm border border-[#e8d5bc] p-6 flex flex-col items-center text-center overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-rose-200 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-amber-100 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full justify-between py-2">
        <div className="text-rose-400 mb-2">
          <Heart className="w-6 h-6 fill-current opacity-80" />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-serif text-slate-800 font-medium tracking-wide">
            My Dearest,
          </h2>

          <div className="w-12 h-px bg-rose-300 mx-auto my-4" />

          <p className="font-serif text-slate-600 leading-relaxed text-sm md:text-base italic">
            "In all the world, there is no heart for me like yours. In all the
            world, there is no love for you like mine."
          </p>

          <p className="font-serif text-slate-600 leading-relaxed text-sm md:text-base mt-4">
            Every moment with you is a treasure I hold dear.
          </p>
        </div>

        <div className="mt-6 pt-4 w-full border-t border-rose-100/50">
          <p className="font-serif text-slate-800 text-lg font-medium signature">
            Forever Yours
          </p>
        </div>
      </div>

      {/* Corner flourishes */}
      <svg
        className="absolute top-3 left-3 w-8 h-8 text-rose-200 opacity-60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 12C0 5.37258 5.37258 0 12 0" />
      </svg>
      <svg
        className="absolute top-3 right-3 w-8 h-8 text-rose-200 opacity-60 transform rotate-90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 12C0 5.37258 5.37258 0 12 0" />
      </svg>
      <svg
        className="absolute bottom-3 left-3 w-8 h-8 text-rose-200 opacity-60 transform -rotate-90"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 12C0 5.37258 5.37258 0 12 0" />
      </svg>
      <svg
        className="absolute bottom-3 right-3 w-8 h-8 text-rose-200 opacity-60 transform rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 12C0 5.37258 5.37258 0 12 0" />
      </svg>
    </div>
  );
}
