import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface EnvelopeProps {
  recipientName: string;
  senderName: string;
  onOpen?: () => void;
  children?: React.ReactNode;
}

export default function RealisticEnvelope({
  recipientName,
  senderName,
  onOpen,
  children,
}: EnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpen = () => {
    if (!isOpened && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpened(true);
        onOpen?.();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400/20 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 0.5, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: -30,
              transition: { duration: 0.4 },
            }}
            className="relative w-full max-w-3xl"
          >
            {/* Ambient glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-3xl rounded-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main envelope container */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer"
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[16/10] p-8 md:p-12">
                {/* 3D Perspective container */}
                <div
                  className="relative w-full h-full"
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Envelope back (main body) */}
                  <div className="absolute inset-0 border-2 border-pink-500/30 rounded-2xl" />

                  {/* Bottom flap shadows */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="flapGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                        <stop
                          offset="50%"
                          stopColor="rgba(236, 72, 153, 0.2)"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(139, 92, 246, 0.3)"
                        />
                      </linearGradient>
                    </defs>

                    {/* Bottom left flap line */}
                    <line
                      x1="0"
                      y1="100"
                      x2="50"
                      y2="50"
                      stroke="rgba(236, 72, 153, 0.4)"
                      strokeWidth="0.3"
                    />

                    {/* Bottom right flap line */}
                    <line
                      x1="100"
                      y1="100"
                      x2="50"
                      y2="50"
                      stroke="rgba(236, 72, 153, 0.4)"
                      strokeWidth="0.3"
                    />
                  </svg>

                  {/* Top flap - This is the key part with 3D rotation! */}
                  <motion.div
                    className="absolute inset-x-0 top-0 bottom-1/2 overflow-visible"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "bottom center",
                    }}
                    animate={
                      isAnimating
                        ? {
                            rotateX: [-180],
                            z: [100],
                          }
                        : {
                            rotateX: [0],
                          }
                    }
                    transition={{
                      duration: 1.2,
                      ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
                    }}
                  >
                    {/* Flap front face */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 50"
                      preserveAspectRatio="none"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Flap triangle with gradient */}
                      <motion.path
                        d="M 0 0 L 50 50 L 100 0 Z"
                        fill="url(#flapGradient)"
                        stroke="rgba(236, 72, 153, 0.5)"
                        strokeWidth="0.5"
                        animate={
                          isAnimating
                            ? {
                                fill: "rgba(139, 92, 246, 0.1)",
                              }
                            : {}
                        }
                      />

                      {/* Left flap edge */}
                      <line
                        x1="0"
                        y1="0"
                        x2="50"
                        y2="50"
                        stroke="rgba(236, 72, 153, 0.6)"
                        strokeWidth="0.4"
                      />

                      {/* Right flap edge */}
                      <line
                        x1="100"
                        y1="0"
                        x2="50"
                        y2="50"
                        stroke="rgba(236, 72, 153, 0.6)"
                        strokeWidth="0.4"
                      />
                    </svg>

                    {/* Flap back face (visible when flipped) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-pink-900/40"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "rotateX(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    />
                  </motion.div>

                  {/* Letter/Paper inside (reveals when opening) */}
                  <motion.div
                    className="absolute inset-0 m-auto w-[90%] h-[85%] bg-gradient-to-br from-pink-50/5 to-purple-50/5 rounded-lg border border-pink-300/20"
                    initial={{ y: 0, opacity: 0 }}
                    animate={
                      isAnimating
                        ? {
                            y: -30,
                            opacity: 0.3,
                          }
                        : {
                            y: 0,
                            opacity: 0,
                          }
                    }
                    transition={{
                      duration: 1,
                      delay: 0.3,
                    }}
                  />

                  {/* Heart seal in center */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    animate={
                      isAnimating
                        ? {
                            scale: [1, 0.8, 0],
                            opacity: [1, 1, 0],
                            rotate: [0, 180, 360],
                          }
                        : {
                            scale: [1, 1.05, 1],
                          }
                    }
                    transition={
                      isAnimating
                        ? {
                            duration: 0.8,
                          }
                        : {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                  >
                    <div className="relative">
                      {/* Seal glow */}
                      <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-60" />

                      {/* Seal */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl">
                        <motion.span
                          className="text-3xl md:text-4xl"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          ♥
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Text labels */}
                  <motion.div
                    className="absolute top-[30%] left-1/2 -translate-x-1/2 text-center z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-pink-200 text-lg md:text-2xl font-light tracking-wide">
                      To: <span className="font-semibold">{recipientName}</span>
                    </p>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-center z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-pink-200 text-lg md:text-2xl font-light tracking-wide">
                      From: <span className="font-semibold">{senderName}</span>
                    </p>
                  </motion.div>
                </div>

                {/* Tap to open indicator */}
                <motion.div
                  className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isAnimating ? 0 : 1,
                    y: isAnimating ? 10 : 0,
                  }}
                  transition={{ delay: 0.5 }}
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
                    <ChevronDown className="w-6 h-6 text-pink-300" />
                  </motion.div>
                  <span className="text-sm md:text-base font-medium text-pink-300">
                    Tap to open
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 100,
              delay: 0.2,
            }}
            className="w-full max-w-3xl"
          >
            {/* Content glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-3xl rounded-3xl"
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

            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-pink-500/30 shadow-2xl p-8 md:p-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
