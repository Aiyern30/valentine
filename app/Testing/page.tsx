"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";
import { AnimatedEnvelope as AnimatedEnvelope4 } from "@/components/AnimatedEnvelope/AnimatedEnvelope4";

type ComponentType = "version-1" | "version-2" | "version-3" | "version-4";

export default function ConfessionView() {
  const [activeComponent, setActiveComponent] =
    useState<ComponentType>("version-1");

  return (
    <div className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Switcher UI */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
        {(
          [
            "version-1",
            "version-2",
            "version-3",
            "version-4",
          ] as ComponentType[]
        ).map((type) => (
          <button
            key={type}
            onClick={() => setActiveComponent(type)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
              activeComponent === type
                ? "bg-pink-500 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {type.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl flex items-center justify-center">
        {activeComponent === "version-1" && <AnimatedEnvelope1 />}
        {activeComponent === "version-2" && <AnimatedEnvelope2 />}
        {activeComponent === "version-3" && <AnimatedEnvelope3 />}
        {activeComponent === "version-4" && <AnimatedEnvelope4 />}
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.1),transparent_50%)]" />
    </div>
  );
}
