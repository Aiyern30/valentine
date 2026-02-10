import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
type EnvelopeStatus = "idle" | "cracking" | "revealed";
export function AnimatedEnvelope() {
  const [status, setStatus] = useState<EnvelopeStatus>("idle");
  const handleOpen = () => {
    if (status !== "idle") return;
    // Sequence: Crack -> Split/Reveal
    setStatus("cracking");
    // Short delay for the "crack" animation before the big reveal
    setTimeout(() => {
      setStatus("revealed");
    }, 400);
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] w-full perspective-1000">
      {/* Ambient Particles/Stars (Decorative background elements) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </div>

      <div className="relative w-[340px] h-[240px] flex items-center justify-center">
        {/* --- EFFECTS LAYER --- */}

        {/* Glow Burst (Behind everything) */}
        <AnimatePresence>
          {status === "revealed" && (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.5, 2],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
              className="absolute z-0 w-64 h-64 rounded-full bg-linear-to-r from-amber-200 via-orange-400 to-transparent blur-3xl"
            />
          )}
        </AnimatePresence>

        {/* Shockwave Ripple */}
        <AnimatePresence>
          {status === "revealed" && (
            <motion.div
              initial={{
                scale: 0.5,
                opacity: 0,
                borderWidth: "4px",
              }}
              animate={{
                scale: 2.5,
                opacity: [0.8, 0],
                borderWidth: "0px",
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
              className="absolute z-0 w-full h-full rounded-full border-amber-100/50"
              style={{
                borderRadius: "50%",
              }}
            />
          )}
        </AnimatePresence>

        {/* --- CARD LAYER --- */}
        <motion.div
          className="absolute z-10 w-[300px] h-[200px] bg-[#FDFBF7] rounded-lg shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6 border border-stone-100"
          initial={{
            scale: 0.3,
            y: 50,
            rotateX: 15,
            opacity: 0,
          }}
          animate={
            status === "revealed"
              ? {
                  scale: 1,
                  y: 0,
                  rotateX: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    delay: 0.1, // Slight delay after split starts
                  },
                }
              : {}
          }
        >
          {/* Card Content */}
          <div className="border-2 border-double border-stone-200 w-full h-full p-4 flex flex-col items-center justify-center relative">
            <div className="absolute top-2 right-2 text-stone-300">
              <Sparkles size={16} />
            </div>
            <div className="absolute bottom-2 left-2 text-stone-300">
              <Sparkles size={16} />
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={
                status === "revealed"
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                delay: 0.4,
                duration: 0.8,
              }}
            >
              <Heart className="w-8 h-8 text-rose-400 fill-rose-100 mb-3 mx-auto" />
              <h3 className="font-serif text-xl text-stone-800 mb-2 font-medium tracking-wide">
                My Favorite Notification
              </h3>
              <p className="font-serif text-stone-500 text-sm italic leading-relaxed">
                "In a world of noise,
                <br />
                you are my clearest signal."
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* --- ENVELOPE LAYERS --- */}

        {/* Container for the envelope parts to handle the hover/float animation together */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none" // pointer-events-none to let clicks pass through to the button wrapper if needed, but we'll wrap this whole thing in a button
          animate={
            status === "idle"
              ? {
                  y: [0, -8, 0],
                }
              : {
                  y: 0,
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Top Half */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden origin-bottom"
            initial={{
              y: 0,
              opacity: 1,
            }}
            animate={
              (status === "revealed"
                ? {
                    y: -150,
                    opacity: 0,
                    maskImage:
                      "linear-gradient(to top, transparent, black 20%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent, black 20%)",
                  }
                : {}) as any
            }
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="w-full h-[240px] bg-linear-to-br from-[#9e1b32] to-[#7a1325] shadow-inner relative">
              {/* Flap Triangle (Top) */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

              {/* The triangular flap visual */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-170 border-l-transparent border-r-170 border-r-transparent border-t-140 border-t-[#b92b45] drop-shadow-md origin-top"></div>
            </div>
          </motion.div>

          {/* Bottom Half */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden origin-top"
            initial={{
              y: 0,
              opacity: 1,
            }}
            animate={
              (status === "revealed"
                ? {
                    y: 150,
                    opacity: 0,
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 20%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, black 20%)",
                  }
                : {}) as any
            }
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="w-full h-[240px] absolute bottom-0 bg-linear-to-tr from-[#8a1529] to-[#a31c35] shadow-inner flex items-end justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              {/* Bottom fold visual */}
              <div className="w-0 h-0 border-l-170 border-l-transparent border-r-170 border-r-transparent border-b-120 border-b-[#94182e]/80 absolute bottom-0"></div>
            </div>
          </motion.div>

          {/* Wax Seal (Attached to the split point) */}
          <motion.button
            onClick={handleOpen}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto group"
            initial={{
              scale: 1,
            }}
            animate={
              status === "cracking"
                ? {
                    scale: [1, 1.1, 0.9, 1.05],
                    rotate: [0, -3, 3, 0],
                  }
                : status === "revealed"
                  ? {
                      scale: 0,
                      opacity: 0,
                    }
                  : {
                      scale: 1,
                    }
            }
            transition={
              status === "cracking"
                ? {
                    duration: 0.3,
                  }
                : {
                    duration: 0.4,
                  }
            }
            whileHover={
              status === "idle"
                ? {
                    scale: 1.05,
                  }
                : {}
            }
          >
            {/* Seal Body */}
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-700 via-red-600 to-red-800 shadow-lg flex items-center justify-center border-2 border-red-900/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>

              {/* Inner Ring */}
              <div className="w-12 h-12 rounded-full border border-red-800/50 flex items-center justify-center bg-red-700/50 shadow-inner">
                <Heart className="w-6 h-6 text-red-900 fill-red-900 drop-shadow-sm opacity-80" />
              </div>

              {/* Shine/Highlight */}
              <div className="absolute top-2 left-3 w-4 h-2 bg-white/20 rounded-full blur-[1px] -rotate-12"></div>

              {/* Crack Overlay (Visible only when cracking) */}
              <AnimatePresence>
                {status === "cracking" && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full absolute stroke-white/80 stroke-2 fill-none"
                    >
                      <path d="M 50 10 L 45 40 L 55 60 L 40 90" />
                      <path d="M 20 50 L 50 50 L 80 50" />
                    </svg>
                    <motion.div
                      className="absolute inset-0 bg-white mix-blend-overlay"
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Hint Text */}
      <AnimatePresence>
        {status === "idle" && (
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 0.6,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="absolute bottom-20 text-stone-400 font-light tracking-widest text-sm uppercase"
          >
            Tap seal to open
          </motion.p>
        )}
      </AnimatePresence>

      {/* Reset Button (Optional, for demo purposes) */}
      <AnimatePresence>
        {status === "revealed" && (
          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 2,
              duration: 1,
            }}
            onClick={() => setStatus("idle")}
            className="absolute bottom-10 text-stone-500 hover:text-stone-300 text-xs tracking-widest uppercase transition-colors"
          >
            Close & Reset
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
