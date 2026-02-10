import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface EnvelopeProps {
  recipientName: string;
  senderName: string;
  onOpen?: () => void;
  children?: React.ReactNode;
  envelopeStyle?: "romantic" | "elegant" | "modern" | "playful";
}

export default function AnimatedEnvelope({
  recipientName,
  senderName,
  onOpen,
  children,
  envelopeStyle = "romantic",
}: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpen = () => {
    if (!isOpened && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpened(true);
        onOpen?.();
      }, 1200);
    }
  };

  const styles = {
    romantic: {
      bg: "from-purple-900 via-pink-900 to-purple-900",
      cardBg: "from-gray-800/90 to-gray-900/90",
      border: "border-pink-500/40",
      glow: "from-pink-500/30 to-purple-500/30",
      seal: "from-pink-500 to-rose-500",
      text: "text-pink-300",
    },
    elegant: {
      bg: "from-gray-900 via-slate-900 to-gray-900",
      cardBg: "from-slate-800/90 to-slate-900/90",
      border: "border-amber-500/40",
      glow: "from-amber-500/30 to-yellow-500/30",
      seal: "from-amber-500 to-yellow-500",
      text: "text-amber-200",
    },
    modern: {
      bg: "from-slate-900 via-blue-900 to-slate-900",
      cardBg: "from-slate-800/90 to-blue-900/90",
      border: "border-blue-500/40",
      glow: "from-blue-500/30 to-cyan-500/30",
      seal: "from-blue-500 to-cyan-500",
      text: "text-blue-200",
    },
    playful: {
      bg: "from-purple-900 via-fuchsia-900 to-purple-900",
      cardBg: "from-fuchsia-800/90 to-purple-900/90",
      border: "border-fuchsia-500/40",
      glow: "from-fuchsia-500/30 to-pink-500/30",
      seal: "from-fuchsia-500 to-pink-500",
      text: "text-fuchsia-200",
    },
  };

  const style = styles[envelopeStyle];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${style.bg} flex items-center justify-center p-4 overflow-hidden`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400/30 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-2xl"
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${style.glow} blur-3xl rounded-3xl`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Envelope Card */}
            <motion.div
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer bg-gradient-to-br ${style.cardBg} backdrop-blur-xl rounded-3xl border-2 ${style.border} shadow-2xl overflow-hidden`}
            >
              {/* Envelope SVG */}
              <div className="relative aspect-[3/2] p-8">
                <svg
                  viewBox="0 0 600 400"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Envelope body */}
                  <motion.rect
                    x="80"
                    y="120"
                    width="440"
                    height="280"
                    rx="12"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={style.text}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />

                  {/* Bottom flap lines */}
                  <motion.line
                    x1="80"
                    y1="400"
                    x2="300"
                    y2="260"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={style.text}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <motion.line
                    x1="520"
                    y1="400"
                    x2="300"
                    y2="260"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={style.text}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />

                  {/* Top flap - Animated */}
                  <motion.g
                    initial={{ rotateX: 0 }}
                    animate={
                      isAnimating
                        ? {
                            rotateX: -180,
                            y: -20,
                          }
                        : {}
                    }
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ transformOrigin: "300px 120px" }}
                  >
                    <motion.path
                      d="M 80 120 L 300 260 L 520 120 Z"
                      fill="currentColor"
                      className={`${style.text} opacity-20`}
                      stroke="currentColor"
                      strokeWidth="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isAnimating ? 0 : 0.3 }}
                    />
                    <motion.line
                      x1="80"
                      y1="120"
                      x2="300"
                      y2="260"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={style.text}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.line
                      x1="520"
                      y1="120"
                      x2="300"
                      y2="260"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={style.text}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </motion.g>

                  {/* Heart seal */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={
                      isAnimating
                        ? { scale: 0, opacity: 0 }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: 0.5, delay: isAnimating ? 0 : 1 }}
                  >
                    <defs>
                      <radialGradient id="sealGradient">
                        <stop offset="0%" stopColor="rgba(236, 72, 153, 1)" />
                        <stop offset="100%" stopColor="rgba(219, 39, 119, 1)" />
                      </radialGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="300"
                      cy="260"
                      r="35"
                      fill="url(#sealGradient)"
                      filter="url(#glow)"
                    />
                    <motion.text
                      x="300"
                      y="274"
                      textAnchor="middle"
                      fontSize="32"
                      fill="white"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ♥
                    </motion.text>
                  </motion.g>

                  {/* Text labels */}
                  <motion.text
                    x="300"
                    y="200"
                    textAnchor="middle"
                    className={`${style.text} text-2xl font-light`}
                    fill="currentColor"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    To: {recipientName}
                  </motion.text>

                  <motion.text
                    x="300"
                    y="330"
                    textAnchor="middle"
                    className={`${style.text} text-2xl font-light`}
                    fill="currentColor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    From: {senderName}
                  </motion.text>
                </svg>

                {/* Tap to open indicator */}
                <motion.div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isAnimating ? 0 : 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className={`w-6 h-6 ${style.text}`} />
                  </motion.div>
                  <span className={`text-sm font-medium ${style.text}`}>
                    Tap to open
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
            }}
            className="w-full max-w-3xl"
          >
            {/* Glow for content */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${style.glow} blur-3xl rounded-3xl`}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div
              className={`relative bg-gradient-to-br ${style.cardBg} backdrop-blur-xl rounded-3xl border-2 ${style.border} shadow-2xl p-8 md:p-12`}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
