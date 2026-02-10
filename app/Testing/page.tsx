"use client";

import AnimatedEnvelope from "@/components/AnimatedEnvelope";
import React from "react";

export default function EnvelopeDemo() {
  const handleEnvelopeOpen = () => {
    console.log("Envelope opened!");
    // You can trigger any action here, like fetching the message from the database
  };

  return (
    <AnimatedEnvelope
      recipientName="F.G."
      senderName="HHHH"
      onOpen={handleEnvelopeOpen}
    >
      {/* Your confession/message content goes here */}
      <div className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-3xl">💕</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          A Special Message for You
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed">
            Your confession message will appear here after the envelope opens...
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full hover:from-pink-600 hover:to-rose-500 transition">
            Reply
          </button>
          <button className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
            Save
          </button>
        </div>
      </div>
    </AnimatedEnvelope>
  );
}
