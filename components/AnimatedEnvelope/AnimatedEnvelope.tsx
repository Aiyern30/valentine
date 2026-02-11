import React, { useState } from "react";
import { easeInOut, easeOut, motion, spring } from "framer-motion";
import { Heart } from "lucide-react";
interface AnimatedEnvelopeProps {
  title?: string;
  message?: string;
  sender?: string;
  recipient?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  envelopeColor?: string;
  pocketColor?: string;
  flapColor?: string;
  flapBackColor?: string;
  cardColor?: string;
  textColor?: string;
  titleColor?: string;
}

export function AnimatedEnvelope({
  title = "You've got mail!",
  message = "We are delighted to invite you to our special event. Please join us for an evening of celebration and joy.",
  sender = "The Team",
  recipient,
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#D4A574",
  pocketColor = "#D4A574",
  flapColor = "#DEB887",
  flapBackColor = "#C49A6C",
  cardColor = "#FEFCF3",
  textColor = "#8D6E63",
  titleColor = "#5D4037",
}: AnimatedEnvelopeProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (!isOpen) {
      if (onOpenChange) {
        onOpenChange(true);
      } else {
        setInternalIsOpen(true);
      }
    }
  };

  // Animation Variants
  const flapVariants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
    open: {
      rotateX: 180,
      zIndex: 0,
      transition: {
        duration: 0.6,
        ease: easeInOut,
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
        type: spring,
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
        onClick={handleOpen}
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
          <div
            className="absolute inset-0 rounded-md shadow-lg z-0"
            style={{
              backgroundColor: envelopeColor,
              border: `1px solid ${pocketColor}`,
            }}
          />

          {/* Names on Envelope (Visible when closed) */}
          {!isOpen && (
            <>
              <div className="absolute top-8 left-8 space-y-0.5 z-10 pointer-events-none opacity-40">
                <span
                  className="text-[8px] uppercase tracking-widest font-bold"
                  style={{ color: titleColor }}
                >
                  To:
                </span>
                <p
                  className="font-['Caveat'] text-xl leading-none"
                  style={{ color: titleColor }}
                >
                  {recipient || "My Love"}
                </p>
              </div>
              <div className="absolute bottom-8 right-8 text-right space-y-0.5 z-10 pointer-events-none opacity-40">
                <span
                  className="text-[8px] uppercase tracking-widest font-bold"
                  style={{ color: titleColor }}
                >
                  From:
                </span>
                <p
                  className="font-['Caveat'] text-lg leading-none"
                  style={{ color: titleColor }}
                >
                  {sender}
                </p>
              </div>
            </>
          )}

          {/* CARD (Content) */}
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute left-1/2 top-2 w-[280px] h-[360px] rounded-lg p-6 flex flex-col items-center text-center shadow-sm border origin-bottom"
            style={{
              x: "-50%",
              backgroundColor: cardColor,
              borderColor: "rgba(0,0,0,0.05)",
            }}
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-noise opacity-30 rounded-lg pointer-events-none" />

            {/* Card Content */}
            <div className="relative z-10 mt-8 w-full">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center opacity-80"
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  color: titleColor,
                }}
              >
                <Heart size={24} fill="currentColor" />
              </div>
              <h2
                className="font-['Caveat'] text-3xl mb-3 font-bold"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
              {recipient && (
                <p
                  className="font-['Caveat'] text-xl mb-2"
                  style={{ color: titleColor }}
                >
                  To: {recipient}
                </p>
              )}
              <p
                className="font-['Lora'] text-sm leading-relaxed max-h-[120px] overflow-y-auto"
                style={{ color: textColor }}
              >
                {message}
              </p>
              <div
                className="mt-6 w-full h-px"
                style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
              />
              <p
                className="font-['Caveat'] text-xl mt-4"
                style={{ color: titleColor }}
              >
                With love, <br /> {sender}
              </p>
            </div>
          </motion.div>

          {/* ENVELOPE FRONT (Pocket) */}
          <div
            className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 320 220"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 drop-shadow-md"
            >
              <path
                d="M0,0 L160,110 L320,0 L320,220 L0,220 Z"
                fill={pocketColor}
                stroke="rgba(0,0,0,0.1)"
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
            }}
          >
            {/* Front of Flap (matches envelope color) */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: flapColor,
                backfaceVisibility: "hidden",
                borderTop: "1px solid rgba(0,0,0,0.1)",
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
                backgroundColor: flapBackColor,
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
          className="absolute -bottom-12 left-0 w-full text-center font-['Caveat'] text-xl opacity-60"
          style={{ color: textColor }}
        >
          Click to open
        </motion.p>
      </div>
    </div>
  );
}
