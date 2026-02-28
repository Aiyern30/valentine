"use client";

import { useEffect, useState, useCallback } from "react";
import { AchievementDefinition } from "@/lib/pet-achievements";

interface AchievementUnlockDialogProps {
  achievement: AchievementDefinition | null;
  onClose: () => void;
}

export default function AchievementUnlockDialog({
  achievement,
  onClose,
}: AchievementUnlockDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to finish
  }, [onClose]);

  useEffect(() => {
    if (achievement) {
      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => {
        clearTimeout(visibilityTimer);
        clearTimeout(timer);
      };
    }
  }, [achievement, handleClose]);

  if (!achievement) return null;

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 via-orange-500 to-red-600",
  };

  const rarityGlow = {
    common: "shadow-gray-500/50",
    rare: "shadow-blue-500/50",
    epic: "shadow-purple-500/50",
    legendary: "shadow-yellow-500/50",
  };

  const bgColor =
    rarityColors[achievement.rarity as keyof typeof rarityColors] ||
    rarityColors.common;
  const glowColor =
    rarityGlow[achievement.rarity as keyof typeof rarityGlow] ||
    rarityGlow.common;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <div className="relative">
          {/* Glow effect */}
          <div
            className={`absolute inset-0 bg-linear-to-r ${bgColor} blur-md ${glowColor} shadow-2xl animate-pulse`}
          />

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden min-w-100 max-w-md">
            {/* Header with linear */}
            <div
              className={`bg-linear-to-r ${bgColor} p-6 text-white text-center relative overflow-hidden`}
            >
              {/* Sparkle animation */}

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">
                  🎉 Achievement Unlocked! 🎉
                </h2>
                <p className="text-sm opacity-90 uppercase tracking-wider">
                  {achievement.rarity}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon with animation */}
              <div className="mb-4 animate-bounce-slow">
                <span className="text-8xl drop-shadow-lg">
                  {achievement.icon}
                </span>
              </div>

              {/* Achievement name */}
              <h3 className="text-3xl font-bold mb-3 text-gray-800">
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-lg">
                {achievement.description}
              </p>

              {/* Category badge */}
              <div className="flex justify-center gap-2 mb-6">
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {achievement.category}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className={`w-full py-3 rounded-lg text-white font-semibold bg-linear-to-r ${bgColor} hover:opacity-90 transition-opacity`}
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-twinkle {
          animation: twinkle linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
