"use client";

import type { CSSProperties } from "react";

const HEART_STYLES: CSSProperties[] = Array.from({ length: 6 }, () => ({
  left: `${20 + Math.random() * 60}%`,
  top: `${20 + Math.random() * 60}%`,
  animationDuration: `${3 + Math.random() * 2}s`,
  animationDelay: `${Math.random()}s`,
  transform: `scale(${0.5 + Math.random() * 0.5})`,
}));

export default function ValentineHero() {
  return (
    <div className="relative w-full h-full min-h-125 flex items-center justify-center overflow-hidden bg-rose-50/50 dark:bg-rose-950/20">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[50%] left-[40%] w-125 h-125 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 bg-red-300/20 rounded-full blur-3xl animate-pulse" />

      {/* Central 3D-ish Composition */}
      <div className="relative flex flex-col items-center transition-all duration-1000 transform translate-y-0 opacity-100">
        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {HEART_STYLES.map((style, i) => (
            <div key={i} className="absolute animate-bounce" style={style}>
              <span className="text-4xl drop-shadow-lg">❤️</span>
            </div>
          ))}
        </div>

        {/* Main "Heart" and Text */}
        <div className="z-10 p-12 text-center">
          <div className="mb-6 relative inline-block">
            <h2 className="text-2xl md:text-3xl font-script text-rose-600 dark:text-rose-400 -rotate-6 transform">
              Happy
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-rose-500 via-red-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm pb-2">
              Valentines Day
            </h1>
          </div>

          <div className="relative w-48 h-48 mx-auto my-8 perspective-1000">
            {/* CSS Based 3D Heart Representation */}
            <div className="relative w-full h-full animate-pulse-slow">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full drop-shadow-2xl filter saturate-150"
              >
                <defs>
                  <linearGradient
                    id="heartGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#ff3366", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#ff0033", stopOpacity: 1 }}
                    />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  fill="url(#heartGradient)"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              {/* Shine effect */}
              <div className="absolute top-8 left-8 w-8 h-8 bg-white/40 rounded-full blur-md" />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {["L", "O", "V", "E"].map((letter, i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-yellow-300 to-yellow-600 rounded-lg text-white font-bold text-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
