import React, { useState } from "react";
import { easeInOut, easeOut, motion, spring } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

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
  title = "A Secret for You",
  message = "In a world of noise, you are my clearest signal.",
  sender = "Your Secret Admirer",
  recipient,
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#1a1a1a",
  pocketColor = "#111111",
  flapColor = "#2a2a2a",
  flapBackColor = "#1a1a1a",
  cardColor = "#FDFBF7",
  textColor = "#57534e",
  titleColor = "#1c1917",
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
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: Math.random() * 0.5 + 0.2,
            }}
            animate={{ y: [null, -100], opacity: [0.1, 0.3, 0] }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "3px", height: "3px", left: "50%", top: "50%" }}
          />
        ))}
      </div>

      <div
        className="relative w-[340px] h-[240px] cursor-pointer group"
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
            className="absolute inset-0 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-0"
            style={{ backgroundColor: envelopeColor }}
          />

          {/* Names on Envelope */}
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: isOpen ? 0 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-8 space-y-0.5 z-10 pointer-events-none"
          >
            <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-white/40">
              TO
            </span>
            <p className="font-serif text-lg text-white/80 leading-none">
              {recipient || "Special One"}
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
                className="absolute inset-0 rounded-r-lg p-6 flex flex-col shadow-inner border border-stone-200"
                style={{
                  backgroundColor: cardColor,
                  borderLeft: "none",
                }}
              >
                <div className="absolute top-2 right-2 text-stone-200">
                  <Sparkles size={12} />
                </div>
                <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar">
                  <p className="font-serif text-[10px] leading-relaxed text-stone-500 italic">
                    {message}
                  </p>
                  <p className="font-serif text-xl mt-6 text-stone-800 font-medium">
                    With Love, <br /> {sender}
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
                  className="absolute inset-0 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-md border border-stone-200"
                  style={{
                    backgroundColor: cardColor,
                    backfaceVisibility: "hidden",
                    zIndex: 2,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mb-3">
                    <Heart size={20} className="text-rose-500 fill-rose-500" />
                  </div>
                  <h2 className="font-serif text-lg text-stone-800 tracking-wide font-medium">
                    {title}
                  </h2>
                  <div className="mt-8 flex flex-col items-center gap-2 opacity-20">
                    <div className="w-4 h-4 rounded-full border border-stone-400 rotate-45" />
                    <p className="text-[7px] uppercase tracking-[0.4em] font-bold text-stone-950">
                      Reveal
                    </p>
                  </div>
                </div>

                {/* INSIDE LEFT */}
                <div
                  className="absolute inset-0 rounded-l-lg p-6 bg-white backface-hidden flex flex-col border border-stone-200"
                  style={{
                    backgroundColor: cardColor,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    borderRight: "none",
                  }}
                >
                  <h3 className="font-serif text-[9px] uppercase tracking-[0.2em] mb-3 text-stone-400 font-bold">
                    Captured Moments
                  </h3>
                  <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-1">
                    {photos.length > 0 ? (
                      photos.map((photo, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-sm overflow-hidden bg-stone-100 shadow-sm"
                        >
                          <img
                            src={photo}
                            className="w-full h-full object-cover grayscale"
                            alt=""
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center h-full opacity-[0.05]">
                        <Heart size={40} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ENVELOPE FRONT */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div
              className="absolute bottom-0 w-full h-full"
              style={{
                backgroundColor: pocketColor,
                clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)",
              }}
            />
          </div>

          {/* ENVELOPE FLAP */}
          <motion.div
            variants={flapVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute top-0 left-0 w-full h-[120px] z-30 origin-top"
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

          {/* WAX SEAL */}
          <motion.div
            animate={
              isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
            }
            className="absolute top-[110px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-red-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2 border-red-900"
          >
            <Heart size={16} className="text-red-300 fill-red-300 opacity-60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
