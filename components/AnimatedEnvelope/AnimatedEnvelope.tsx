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
  photos = [],
}: AnimatedEnvelopeProps & { photos?: string[] }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isCardFoldOpen, setIsCardFoldOpen] = useState(false);
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

  // Reset card when closing
  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsCardFoldOpen(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Animation Variants
  const flapVariants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: {
        delay: 0.3,
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
      y: 30,
      opacity: 0,
      scale: 0.9,
      zIndex: 10,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
    open: {
      y: -220,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      transition: {
        delay: 0.6,
        duration: 0.8,
        type: spring,
        stiffness: 100,
        damping: 20,
      },
    },
    centered: {
      y: -85, // Card center (460/2 = 230) minus envelope center from top (290/2 = 145) = 85px
      opacity: 1,
      scale: 1,
      zIndex: 40,
      transition: {
        delay: 0,
        duration: 0.8,
        ease: easeInOut,
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

  // Envelope wrapper variants - removed movement to keep card aligned with envelope
  const envelopeWrapperVariants = {
    closed: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeInOut,
      },
    },
    open: {
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: easeInOut,
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[700px] perspective-1000">
      {/* Interaction Wrapper - Made bigger */}
      <motion.div
        variants={envelopeWrapperVariants}
        animate={isOpen ? "open" : "closed"}
        className="relative w-[420px] h-[290px] cursor-pointer group"
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
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isOpen ? 0 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute top-10 left-10 space-y-1 z-10 pointer-events-none"
          >
            <span
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ color: titleColor }}
            >
              To:
            </span>
            <p
              className="font-['Caveat'] text-2xl leading-none"
              style={{ color: titleColor }}
            >
              {recipient || "My Love"}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isOpen ? 0 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-10 right-10 text-right space-y-1 z-10 pointer-events-none"
          >
            <span
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ color: titleColor }}
            >
              From:
            </span>
            <p
              className="font-['Caveat'] text-xl leading-none"
              style={{ color: titleColor }}
            >
              {sender}
            </p>
          </motion.div>

          {/* 3D FOLDING CARD - Made bigger */}
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate={isOpen ? (isCardFoldOpen ? "centered" : "open") : "closed"}
            className="absolute left-0 top-5 w-[360px] h-[460px] origin-bottom perspective-1000"
            style={{ left: "50%", x: "-50%" }}
            onClick={(e) => {
              if (isOpen) {
                e.stopPropagation();
                setIsCardFoldOpen(!isCardFoldOpen);
              }
            }}
          >
            <div
              className="relative w-full h-full preserve-3d transition-transform duration-700"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* BACK OF CARD (Right Page when open) */}
              <div
                className="absolute inset-0 rounded-r-lg rounded-l-none p-8 flex flex-col shadow-inner border border-black/10"
                style={{
                  backgroundColor: cardColor,
                  borderLeft: "none", // No border on the crease
                }}
              >
                <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar">
                  <p
                    className="font-['Lora'] text-base leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {message}
                  </p>
                  <p
                    className="font-['Caveat'] text-3xl mt-10"
                    style={{ color: titleColor }}
                  >
                    With love, <br /> {sender}
                  </p>
                </div>
              </div>

              {/* FOLDING PART (Left Page when open / Front Cover when closed) */}
              <motion.div
                className="absolute inset-0 origin-left preserve-3d"
                style={{
                  transformStyle: "preserve-3d",
                }}
                animate={{ rotateY: isCardFoldOpen ? -175 : 0 }} // Open slightly less than 180 for better 3D look
                transition={{ duration: 0.8, ease: easeInOut }}
              >
                {/* CARD FRONT (Cover) */}
                <div
                  className="absolute inset-0 rounded-l-lg rounded-r-none p-10 flex flex-col items-center justify-center text-center shadow-md border border-black/10"
                  style={{
                    backgroundColor: cardColor,
                    backfaceVisibility: "hidden",
                    zIndex: 2,
                  }}
                >
                  <div className="absolute inset-0 bg-noise opacity-30 rounded-lg pointer-events-none" />
                  <div
                    className="w-20 h-20 rounded-full mb-8 flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.03)",
                      color: titleColor,
                    }}
                  >
                    <Heart size={40} fill="currentColor" />
                  </div>
                  <h2
                    className="font-['Caveat'] text-5xl mb-3 font-bold"
                    style={{ color: titleColor }}
                  >
                    {title}
                  </h2>
                  <p
                    className="font-['Caveat'] text-2xl opacity-60"
                    style={{ color: titleColor }}
                  >
                    For: {recipient || "Someone special"}
                  </p>

                  <div className="mt-16 flex flex-col items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse"
                      style={{ borderColor: titleColor }}
                    >
                      <span className="text-xs" style={{ color: titleColor }}>
                        TAP
                      </span>
                    </div>
                    <p
                      className="text-xs uppercase tracking-[0.2em] font-bold"
                      style={{ color: titleColor, opacity: 0.4 }}
                    >
                      Open Card
                    </p>
                  </div>
                </div>

                {/* CARD INSIDE LEFT (Behind Cover) */}
                <div
                  className="absolute inset-0 rounded-l-lg rounded-r-none p-8 bg-white backface-hidden flex flex-col border border-black/10 shadow-inner"
                  style={{
                    backgroundColor: cardColor,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    borderRight: "none", // No border on the crease
                  }}
                >
                  <h3
                    className="font-['Caveat'] text-2xl mb-5 opacity-70"
                    style={{ color: titleColor }}
                  >
                    Special Memories
                  </h3>
                  <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1">
                    {photos.length > 0 ? (
                      photos.map((photo, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-md overflow-hidden bg-black/5 transition-transform hover:scale-105 shadow-sm"
                        >
                          <img
                            src={photo}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-full opacity-20">
                        <Heart size={56} />
                        <p className="text-xs mt-3 font-bold uppercase tracking-widest">
                          Always & Forever
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
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
              viewBox="0 0 420 290"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 drop-shadow-md"
            >
              <path
                d="M0,0 L210,145 L420,0 L420,290 L0,290 Z"
                fill={pocketColor}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
              <path
                d="M0,290 L210,145 L420,290"
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
            className="absolute top-0 left-0 w-full h-[145px] z-30 origin-top"
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
          className="absolute -bottom-14 left-0 w-full text-center font-['Caveat'] text-2xl opacity-60"
          style={{ color: textColor }}
        >
          Click to open
        </motion.p>
      </motion.div>
    </div>
  );
}
