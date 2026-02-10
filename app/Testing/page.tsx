"use client";

import React, { useState } from "react";
import RealisticEnvelope from "@/components/RealisticEnvelope";
import SuperRealisticEnvelope from "@/components/SuperRealisticEnvelope";
import { motion } from "framer-motion";
import { AnimatedEnvelope } from "@/components/AnimatedEnvelope/AnimatedEnvelope";

type ComponentType = "animated" | "realistic" | "super-realistic";

export default function ConfessionView() {
  const [activeComponent, setActiveComponent] =
    useState<ComponentType>("animated");

  const messageContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-4xl">💕</span>
        </motion.div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        A Special Message for You
      </h1>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-pink-500/20">
        <p className="text-gray-200 text-lg leading-relaxed text-center">
          Your heartfelt message goes here...
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Send Reply
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gray-700 text-white rounded-full font-medium hover:bg-gray-600 transition-colors"
        >
          Save
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="relative">
      {/* Switcher UI */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
        {(["animated", "realistic", "super-realistic"] as ComponentType[]).map(
          (type) => (
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
          ),
        )}
      </div>

      {activeComponent === "animated" && <AnimatedEnvelope />}

      {activeComponent === "realistic" && (
        <RealisticEnvelope recipientName="F.G." senderName="HHH">
          {messageContent}
        </RealisticEnvelope>
      )}

      {activeComponent === "super-realistic" && (
        <SuperRealisticEnvelope recipientName="F.G." senderName="HHH">
          {messageContent}
        </SuperRealisticEnvelope>
      )}
    </div>
  );
}
