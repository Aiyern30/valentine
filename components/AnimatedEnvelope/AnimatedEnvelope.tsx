import React, { useState } from "react";
import { motion } from "framer-motion";
export function AnimatedEnvelope() {
  const [isOpen, setIsOpen] = useState(false);
  // Animation Variants
  const flapVariants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    open: {
      rotateX: 180,
      zIndex: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };
  const cardVariants = {
    closed: {
      y: 0,
      opacity: 1,
      rotate: 0,
      zIndex: 10,
      transition: {
        duration: 0.5,
      },
    },
    open: {
      y: -180,
      zIndex: 40,
      rotate: -2,
      transition: {
        delay: 0.6,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };
  const shadowVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
    },
    open: {
      opacity: 0.2,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
      },
    },
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] perspective-1000">
      {/* Interaction Wrapper */}
      <div
        className="relative w-[320px] h-[220px] cursor-pointer group"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Hover Scale Effect (only when closed) */}
        <motion.div
          className="relative w-full h-full"
          animate={isOpen ? "open" : "closed"}
          whileHover={
            !isOpen
              ? {
                  scale: 1.02,
                }
              : {}
          }
          transition={{
            duration: 0.2,
          }}
        >
          {/* ENVELOPE BACK (Base) */}
          <div className="absolute inset-0 bg-[#D4A574] rounded-md shadow-lg border border-[#C09060] z-0" />

          {/* CARD (Content) */}
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute left-1/2 top-2 w-[280px] h-[360px] bg-[#FEFCF3] rounded-lg p-6 flex flex-col items-center text-center shadow-sm border border-[#E6E0D0] origin-bottom"
            style={{
              x: "-50%",
            }}
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-noise opacity-30 rounded-lg pointer-events-none" />

            {/* Card Content */}
            <div className="relative z-10 mt-8">
              <div className="w-12 h-12 bg-[#F0E6D2] rounded-full mx-auto mb-4 flex items-center justify-center text-[#8B4513] opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="font-['Caveat'] text-3xl text-[#5D4037] mb-3 font-bold">
                You've got mail!
              </h2>
              <p className="font-['Lora'] text-sm text-[#8D6E63] leading-relaxed">
                We are delighted to invite you to our special event. Please join
                us for an evening of celebration and joy.
              </p>
              <div className="mt-6 w-full h-px bg-[#E6E0D0]" />
              <p className="font-['Caveat'] text-xl text-[#5D4037] mt-4">
                With love, <br /> The Team
              </p>
            </div>
          </motion.div>

          {/* ENVELOPE FRONT (Pocket) */}
          {/* This covers the bottom part of the card so it looks like it's inside */}
          <div
            className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none"
            style={{
              background: `linear-gradient(to top right, #D4A574 50%, transparent 50%),
                           linear-gradient(to top left, #D4A574 50%, transparent 50%)`,
              backgroundSize: "100% 100%",
              clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)",
              // Note: Using a simpler approach for the pocket shape to ensure it covers correctly
            }}
          >
            {/* We use SVG for better control over the envelope pocket shape */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 320 220"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 drop-shadow-md"
            >
              <path
                d="M0,0 L160,110 L320,0 L320,220 L0,220 Z"
                fill="#D4A574"
                stroke="#C09060"
                strokeWidth="1"
              />
              <path
                d="M0,220 L160,110 L320,220"
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* ENVELOPE FLAP (Top Triangle) */}
          <motion.div
            variants={flapVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute top-0 left-0 w-full h-[110px] z-30 origin-top"
            style={{
              transformStyle: "preserve-3d",
              // The flap is hinged at the top of the envelope body
            }}
          >
            {/* Front of Flap (matches envelope color) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: "#DEB887",
                backfaceVisibility: "hidden",
                borderTop: "1px solid #C09060",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
              }}
            >
              <div className="absolute inset-0 bg-noise opacity-20" />
            </div>

            {/* Back of Flap (visible when open) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                backgroundColor: "#C49A6C",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>

          {/* Shadow under the card when it rises */}
          <motion.div
            variants={shadowVariants}
            className="absolute bottom-[-20px] left-1/2 w-[90%] h-[20px] bg-black blur-xl rounded-full z-0"
            style={{
              x: "-50%",
            }}
          />
        </motion.div>

        {/* Instruction Text */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: isOpen ? 0 : 1,
          }}
          transition={{
            delay: 1,
            duration: 1,
          }}
          className="absolute -bottom-12 left-0 w-full text-center font-['Caveat'] text-xl text-[#8D6E63] opacity-60"
        >
          Click to open
        </motion.p>
      </div>
    </div>
  );
}
