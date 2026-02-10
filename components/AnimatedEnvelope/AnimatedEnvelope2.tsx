import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Heart } from "lucide-react";
import { LoveCard } from "./LoveCard";
import { SparkleParticles } from "./SparkleParticles";
type AnimationStage =
  | "idle"
  | "seal-dissolve"
  | "flap-open"
  | "card-rise"
  | "envelope-fade"
  | "floating";
export function AnimatedEnvelope() {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [showSparkles, setShowSparkles] = useState(false);
  const handleOpen = async () => {
    if (stage !== "idle") return;
    // Sequence orchestration
    setStage("seal-dissolve");
    // Wait for seal to dissolve (800ms)
    setTimeout(() => {
      setStage("flap-open");
    }, 800);
    // Wait for flap to open (800ms) then start rising
    setTimeout(() => {
      setStage("card-rise");
    }, 1400); // 800 + 600 overlap
    // Wait for rise to complete then fade envelope/center card
    setTimeout(() => {
      setStage("envelope-fade");
    }, 2400); // 1400 + 1000
    // Trigger sparkles and final float
    setTimeout(() => {
      setShowSparkles(true);
      setStage("floating");
    }, 3000);
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Main Container - holds everything centered */}
      <div className="relative w-[320px] h-[220px] md:w-[360px] md:h-[240px]">
        {/* Sparkles Layer - Centered */}
        <SparkleParticles active={showSparkles} />

        {/*
          ENVELOPE STRUCTURE
          Z-Index Layering (Back to Front):
          1. Envelope Back
          2. Card (initially)
          3. Envelope Front Pocket
          4. Envelope Flap
         */}

        {/* 1. Envelope Back */}
        <motion.div
          className="absolute inset-0 bg-[#f5e6d0] rounded-md shadow-2xl"
          initial={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          animate={
            stage === "envelope-fade" || stage === "floating"
              ? {
                  opacity: 0,
                  scale: 0.8,
                  y: 100,
                }
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }
          }
          transition={{
            duration: 0.8,
          }}
        />

        {/* 2. The Card */}
        <motion.div
          className="absolute left-4 right-4 h-[90%] bg-white rounded-lg shadow-md origin-center"
          style={{
            top: "5%",
            zIndex:
              stage === "card-rise" ||
              stage === "floating" ||
              stage === "envelope-fade"
                ? 50
                : 5,
          }}
          initial={{
            y: 0,
            scale: 1,
            rotate: 0,
          }}
          animate={
            stage === "idle" ||
            stage === "seal-dissolve" ||
            stage === "flap-open"
              ? {
                  y: 0,
                }
              : stage === "card-rise"
                ? {
                    y: -120,
                    rotate: [0, -2, 2, 0],
                    transition: {
                      y: {
                        duration: 1.2,
                        ease: easeInOut,
                      },
                      rotate: {
                        duration: 1.2,
                        ease: easeInOut,
                        times: [0, 0.3, 0.7, 1],
                      },
                    },
                  }
                : stage === "envelope-fade"
                  ? {
                      y: -50,
                      scale: 1.1,
                      transition: {
                        duration: 1,
                      },
                    }
                  : stage === "floating"
                    ? {
                        y: [-50, -60, -50],
                        scale: 1.1,
                        transition: {
                          y: {
                            repeat: Infinity,
                            duration: 3,
                            ease: easeInOut,
                          },
                          scale: {
                            duration: 0.5,
                          }, // Ensure scale sticks
                        },
                      }
                    : {}
          }
        >
          <LoveCard />
        </motion.div>

        {/* 3. Envelope Front Pocket */}
        {/* This covers the bottom half of the card */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 10,
            clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(to bottom, #ede0cc, #f5e6d0)",
          }}
          initial={{
            opacity: 1,
            y: 0,
          }}
          animate={
            stage === "envelope-fade" || stage === "floating"
              ? {
                  opacity: 0,
                  y: 100,
                }
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          transition={{
            duration: 0.8,
          }}
        >
          {/* Subtle shadow inside the pocket */}
          <div
            className="absolute inset-0 bg-black/5"
            style={{
              clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)",
            }}
          />
        </motion.div>

        {/* 4. Envelope Flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[60%] origin-top z-20"
          initial={{
            rotateX: 0,
          }}
          animate={
            stage === "idle" || stage === "seal-dissolve"
              ? {
                  rotateX: 0,
                }
              : {
                  rotateX: 180,
                }
          }
          transition={{
            duration: 0.8,
            ease: easeInOut,
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Flap Outer Side (Visible when closed) */}
          <div
            className="absolute inset-0 bg-[#e8d5bc] rounded-t-md backface-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
              zIndex: 2,
            }}
          >
            {/* Shadow for depth */}
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Flap Inner Side (Visible when open, removed after fully opened) */}
          {stage !== "envelope-fade" && stage !== "floating" && (
            <div
              className="absolute inset-0 bg-[#f5e6d0] rounded-t-md"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                zIndex: 1,
              }}
            />
          )}

          {/* The Seal */}
          <AnimatePresence>
            {(stage === "idle" || stage === "seal-dissolve") && (
              <motion.div
                className="absolute top-[90%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                onClick={handleOpen}
                initial={{
                  scale: 1,
                  opacity: 1,
                }}
                animate={
                  stage === "idle"
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0px rgba(232, 160, 180, 0)",
                          "0 0 15px rgba(232, 160, 180, 0.6)",
                          "0 0 0px rgba(232, 160, 180, 0)",
                        ],
                      }
                    : {
                        scale: 1.5,
                        opacity: 0,
                      }
                }
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={
                  stage === "idle"
                    ? {
                        repeat: Infinity,
                        duration: 2,
                      }
                    : {
                        duration: 0.6,
                      }
                }
              >
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-rose-300 to-rose-500 shadow-lg flex items-center justify-center border-2 border-rose-200/50">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  {stage === "idle" && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-rose-200/80 text-xs font-serif tracking-widest uppercase"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: 1,
                      }}
                    >
                      Click to Open
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
