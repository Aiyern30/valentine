import React, { useEffect, useState } from "react";
import { motion, useAnimate, cubicBezier } from "framer-motion";
import { SparklesIcon } from "lucide-react";
export function AnimatedEnvelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, animate] = useAnimate();
  // Animation configurations
  const springConfig = {
    stiffness: 120,
    damping: 14,
    mass: 0.8,
  };
  const easeInOut = cubicBezier(0.4, 0, 0.2, 1);
  const handleToggle = async () => {
    if (isOpen) {
      // CLOSE SEQUENCE
      setIsOpen(false);
      // 1. Card slides back in + Envelope comes forward (Parallel)
      await Promise.all([
        animate(
          ".card-content",
          {
            y: 0,
            z: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
          },
          {
            duration: 0.6,
            ease: easeInOut,
          },
        ),
        animate(
          ".envelope-body",
          {
            z: 0,
            scale: 1,
            filter: "blur(0px)",
          },
          {
            duration: 0.6,
            ease: easeInOut,
          },
        ),
      ]);
      // 2. Bring flap forward again, then close it
      await animate(
        ".envelope-flap",
        {
          rotateX: 0,
          z: 0,
        },
        {
          duration: 0.4,
          ease: "easeOut",
        },
      );
      // 3. Envelope tilts back to neutral
      await animate(
        ".envelope-root",
        {
          rotateX: 0,
        },
        {
          duration: 0.3,
          ease: "easeOut",
        },
      );
    } else {
      // OPEN SEQUENCE
      setIsOpen(true);
      // 1. Tilt back
      await animate(
        ".envelope-root",
        {
          rotateX: 15,
        },
        {
          duration: 0.3,
          ease: "easeOut",
        },
      );
      // 2. Open Flap and push it behind the envelope
      await animate(
        ".envelope-flap",
        {
          rotateX: 180,
          z: -4,
        },
        {
          duration: 0.5,
          ease: "easeInOut",
        },
      );
      // 3. Card slides out + Envelope recedes (Parallel)
      animate(
        ".card-content",
        {
          y: -150,
          z: 80,
          scale: 1.1,
          rotateX: -10,
        },
        {
          type: "spring",
          ...springConfig,
        },
      );
      // Add a subtle rotation wiggle to the card as it emerges
      animate(
        ".card-content",
        {
          rotateY: [3, 0],
        },
        {
          duration: 0.8,
          ease: "easeOut",
        },
      );
      // Envelope recedes and blurs
      animate(
        ".envelope-body",
        {
          z: -100,
          scale: 0.9,
          filter: "blur(2px)",
        },
        {
          duration: 0.6,
          ease: easeInOut,
        },
      );
    }
  };
  return (
    <div className="relative w-full max-w-md mx-auto h-[400px] flex items-center justify-center perspective-1200">
      <div
        ref={scope}
        className="relative w-[320px] h-[220px] perspective-1200"
      >
        {/* Main Envelope Group that tilts */}
        <motion.div
          className="envelope-root relative w-full h-full preserve-3d cursor-pointer group"
          onClick={handleToggle}
          whileHover={
            !isOpen
              ? {
                  y: -4,
                }
              : {}
          }
          transition={{
            duration: 0.2,
          }}
        >
          {/* Envelope Body Wrapper - Moves backward on open */}
          <motion.div className="envelope-body absolute inset-0 preserve-3d">
            {/* 1. Back Panel (Interior) */}
            <div
              className="absolute inset-0 bg-[#D4C4B0] rounded-lg shadow-xl"
              style={{
                transform: "translateZ(-1px)",
              }}
            />

            {/* 2. The Card */}
            <motion.div
              className="card-content absolute left-4 right-4 top-2 bottom-2 bg-[#FAFAF7] rounded-md shadow-sm flex flex-col items-center justify-center p-6 text-center border border-[#E8E4DD] origin-bottom"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                zIndex: 10,
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center space-y-3 border border-[#F0EBE5] p-4">
                <div className="w-8 h-8 rounded-full bg-[#F5E6D3] flex items-center justify-center mb-1">
                  <SparklesIcon className="w-4 h-4 text-[#8C7B66]" />
                </div>
                <h3 className="font-serif text-xl text-[#5C4B38] tracking-wide">
                  You're Invited
                </h3>
                <div className="w-12 h-[1px] bg-[#D4C4B0] my-2" />
                <p className="text-[10px] uppercase tracking-widest text-[#8C7B66] font-medium">
                  Saturday, October 24
                </p>
                <p className="text-xs text-[#8C7B66] leading-relaxed max-w-[180px]">
                  Join us for an evening of celebration, music, and joy.
                </p>
              </div>

              {/* Paper texture overlay */}
              <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            </motion.div>

            {/* 3. Front Panel (The Pocket) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: "translateZ(1px)",
                zIndex: 20,
              }}
            >
              <div
                className="w-full h-full bg-gradient-to-br from-[#F5E6D3] to-[#EDD9C4] rounded-b-lg shadow-inner"
                style={{
                  clipPath:
                    "polygon(0 100%, 100% 100%, 100% 40%, 50% 65%, 0 40%)",
                  boxShadow: "inset 0 -10px 20px -10px rgba(0,0,0,0.1)",
                }}
              />
              {/* Side folds simulation for depth */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-20"
                style={{
                  clipPath:
                    "polygon(0 100%, 100% 100%, 100% 40%, 50% 65%, 0 40%)",
                }}
              />
            </div>

            {/* 4. The Flap - z-index changes based on open state */}
            <motion.div
              className="envelope-flap absolute top-0 left-0 w-full h-full origin-top preserve-3d"
              style={{
                transformStyle: "preserve-3d",
                zIndex: isOpen ? 5 : 30,
                transition: "z-index 0s",
              }}
            >
              {/* Flap Outer Face */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#F2E3D0] to-[#E6D2BC] rounded-t-lg backface-hidden"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 55%)",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                {/* Subtle crease line at top */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
              </div>

              {/* Flap Inner Face (visible when open) - sits flush against envelope back */}
              <div
                className="absolute inset-0 rounded-t-lg"
                style={{
                  clipPath: "polygon(0 100%, 100% 100%, 50% 25%)",
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(to bottom, #C9B89E, #BBA98F)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.12)",
                }}
              />
            </motion.div>

            {/* Shadow for the whole envelope */}
            <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/10 blur-xl rounded-[100%] transition-all duration-500 group-hover:bg-black/15 group-hover:blur-2xl" />
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .perspective-1200 {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
