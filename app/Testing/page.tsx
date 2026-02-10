"use client";

import AnimatedEnvelope from "@/components/AnimatedEnvelope";
import { motion } from "framer-motion";

export default function ConfessionView() {
  return (
    <AnimatedEnvelope
      recipientName="F.G."
      senderName="HHH"
      envelopeStyle="romantic"
      onOpen={() => {
        console.log("Envelope opened!");
        // Track in analytics, update database, etc.
      }}
    >
      {/* Your message content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Heart icon */}
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

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          A Special Message for You
        </h1>

        {/* Message */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-pink-500/20">
          <p className="text-gray-200 text-lg leading-relaxed text-center">
            Your heartfelt message goes here...
          </p>
        </div>

        {/* Action buttons */}
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
    </AnimatedEnvelope>
  );
}
