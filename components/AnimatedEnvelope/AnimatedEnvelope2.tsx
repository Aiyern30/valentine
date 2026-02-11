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
  photos?: string[];
}

export function AnimatedEnvelope({
  title = "You've got mail!",
  message = "We are delighted to invite you to our special event. Please join us for an evening of celebration and joy.",
  sender = "The Team",
  recipient,
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#f5e6d0",
  pocketColor = "#ede0cc",
  flapColor = "#e8d5bc",
  flapBackColor = "#f5e6d0",
  cardColor = "#fffcf5",
  textColor = "#475569",
  titleColor = "#1e293b",
  photos = [],
}: AnimatedEnvelopeProps) {
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

  const flapVariants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: { delay: 0.3, duration: 0.6, ease: easeOut },
    },
    open: {
      rotateX: 180,
      zIndex: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  const cardVariants = {
    closed: {
      y: 20,
      opacity: 0,
      scale: 0.9,
      zIndex: 10,
      transition: { duration: 0.5, ease: easeOut },
    },
    open: {
      y: -180,
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
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] perspective-1000">
      <div
        className="relative w-[320px] h-[220px] cursor-pointer group"
        onClick={handleOpen}
      >
        <motion.div
          className="relative w-full h-full"
          animate={isOpen ? "open" : "closed"}
          whileHover={!isOpen ? { scale: 1.02 } : {}}
          transition={{ duration: 0.2 }}
        >
          {/* ENVELOPE BACK */}
          <div
            className="absolute inset-0 rounded-md shadow-2xl z-0"
            style={{
              backgroundColor: envelopeColor,
              border: `1px solid ${pocketColor}`,
            }}
          />

          {/* Names on Envelope */}
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isOpen ? 0 : 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-8 space-y-0.5 z-10 pointer-events-none"
          >
            <span
              className="text-[8px] uppercase tracking-widest font-bold"
              style={{ color: titleColor }}
            >
              To:
            </span>
            <p
              className="font-serif text-xl leading-none"
              style={{ color: titleColor }}
            >
              {recipient || "My Love"}
            </p>
          </motion.div>

          {/* 3D FOLDING CARD */}
          <motion.div
            variants={cardVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute left-1/2 top-4 w-[280px] h-[360px] origin-bottom perspective-1000"
            style={{ x: "-50%" }}
            onClick={(e) => {
              if (isOpen) {
                e.stopPropagation();
                setIsCardFoldOpen(!isCardFoldOpen);
              }
            }}
          >
            <div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* BACK OF CARD (Right Page when open) */}
              <div
                className="absolute inset-0 rounded-r-lg p-6 flex flex-col shadow-inner border border-black/5"
                style={{
                  backgroundColor: cardColor,
                  borderLeft: "none",
                }}
              >
                <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
                  <p
                    className="font-serif text-sm leading-relaxed italic"
                    style={{ color: textColor }}
                  >
                    {message}
                  </p>
                  <p
                    className="font-serif text-lg mt-8 font-medium"
                    style={{ color: titleColor }}
                  >
                    Forever Yours, <br /> {sender}
                  </p>
                </div>
              </div>

              <motion.div
                className="absolute inset-0 origin-left"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isCardFoldOpen ? -175 : 0 }}
                transition={{ duration: 0.8, ease: easeInOut }}
              >
                {/* FRONT COVER */}
                <div
                  className="absolute inset-0 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-md border border-black/5"
                  style={{
                    backgroundColor: cardColor,
                    backfaceVisibility: "hidden",
                    zIndex: 2,
                  }}
                >
                  <Heart
                    size={32}
                    className="text-rose-400 fill-rose-100 opacity-60 mb-4"
                  />
                  <h2
                    className="font-serif text-2xl font-medium"
                    style={{ color: titleColor }}
                  >
                    {title}
                  </h2>
                  <div className="mt-8 flex flex-col items-center gap-2 opacity-30">
                    <div className="w-6 h-6 rounded-full border border-dashed border-slate-400 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">
                      Open Me
                    </p>
                  </div>
                </div>

                {/* INSIDE LEFT */}
                <div
                  className="absolute inset-0 rounded-l-lg p-6 bg-white backface-hidden flex flex-col border border-black/5"
                  style={{
                    backgroundColor: cardColor,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    borderRight: "none",
                  }}
                >
                  <h3
                    className="font-serif text-xs uppercase tracking-widest mb-4 opacity-60"
                    style={{ color: titleColor }}
                  >
                    Our Times
                  </h3>
                  <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-1">
                    {photos.length > 0 ? (
                      photos.map((photo, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-sm overflow-hidden bg-black/5 shadow-sm"
                        >
                          <img
                            src={photo}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-full opacity-10">
                        <Heart size={40} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ENVELOPE FRONT */}
          <div
            className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 40%, 0 0)",
            }}
          >
            <div
              className="absolute inset-0 bg-black/5"
              style={{
                clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)",
              }}
            />
            <div
              className="w-full h-full"
              style={{ backgroundColor: pocketColor }}
            />
          </div>

          {/* ENVELOPE FLAP */}
          <motion.div
            variants={flapVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute top-0 left-0 w-full h-[110px] z-30 origin-top"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: flapColor,
                backfaceVisibility: "hidden",
              }}
            />
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
        </motion.div>
      </div>
    </div>
  );
}
