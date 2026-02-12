import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Heart } from "lucide-react";
import { SparkleParticles } from "./SparkleParticles";

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
  music?: string;
}

type AnimationStage =
  | "idle"
  | "seal-dissolve"
  | "flap-open"
  | "card-rise"
  | "envelope-fade"
  | "floating";

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
  music,
}: AnimatedEnvelopeProps) {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [showSparkles, setShowSparkles] = useState(false);
  const [isCardFoldOpen, setIsCardFoldOpen] = useState(false);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : stage !== "idle";

  // Helper to extract embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    // Spotify
    if (url.includes("spotify.com")) {
      const match = url.match(/track\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `https://open.spotify.com/embed/track/${match[1]}?utm_source=generator&theme=0&autoplay=1`;
      }
    }

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = null;
      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0`;
      }
    }

    return null;
  };

  const embedUrl = React.useMemo(
    () => (music ? getEmbedUrl(music) : null),
    [music],
  );

  const handleOpen = async () => {
    if (stage !== "idle") return;

    if (onOpenChange) {
      onOpenChange(true);
    }

    // Sequence orchestration
    setStage("seal-dissolve");
    setTimeout(() => setStage("flap-open"), 800);
    setTimeout(() => setStage("card-rise"), 1400);
    setTimeout(() => setStage("envelope-fade"), 2400);
    setTimeout(() => {
      setShowSparkles(true);
      setStage("floating");
    }, 3000);
  };

  // Reset when controlled isOpen becomes false
  useEffect(() => {
    if (controlledIsOpen === false) {
      setStage("idle");
      setShowSparkles(false);
      setIsCardFoldOpen(false);
    }
  }, [controlledIsOpen]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div className="relative w-[320px] h-[220px] md:w-[360px] md:h-[240px]">
        <SparkleParticles active={showSparkles} />

        {/* 1. Envelope Back */}
        <motion.div
          className="absolute inset-0 rounded-md shadow-2xl"
          style={{ backgroundColor: envelopeColor }}
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={
            stage === "envelope-fade" || stage === "floating"
              ? { opacity: 0, scale: 0.8, y: 100 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.8 }}
        />

        {/* 2. The 3D Folding Card */}
        <motion.div
          className="absolute left-1/2 origin-center"
          style={{
            x: "-50%",
            top: "-20px",
            width: "320px",
            height: "400px",
            zIndex:
              stage === "card-rise" ||
              stage === "floating" ||
              stage === "envelope-fade"
                ? 50
                : 5,
          }}
          initial={{ y: 0, scale: 1, rotate: 0, opacity: 0 }}
          animate={
            stage === "idle" ||
            stage === "seal-dissolve" ||
            stage === "flap-open"
              ? { y: 0, opacity: 0 }
              : stage === "card-rise"
                ? {
                    y: -120,
                    opacity: 1,
                    rotate: [0, -2, 2, 0],
                    transition: {
                      y: { duration: 1.2, ease: easeInOut },
                      opacity: { duration: 0.3 },
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
                      opacity: 1,
                      transition: { duration: 1 },
                    }
                  : stage === "floating"
                    ? {
                        y: [-50, -60, -50],
                        scale: 1.1,
                        opacity: 1,
                        transition: {
                          y: { repeat: Infinity, duration: 3, ease: easeInOut },
                          scale: { duration: 0.5 },
                        },
                      }
                    : {}
          }
          onClick={(e) => {
            if (stage === "floating" || stage === "envelope-fade") {
              e.stopPropagation();
              setIsCardFoldOpen(!isCardFoldOpen);
            }
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* BACK OF CARD (Right Page) */}
            <div
              className="absolute inset-0 rounded-r-lg p-6 flex flex-col shadow-inner border border-black/10"
              style={{
                backgroundColor: cardColor,
                borderLeft: "none",
              }}
            >
              <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
                <p
                  className="font-serif text-sm leading-relaxed"
                  style={{ color: textColor }}
                >
                  {message}
                </p>
                <p
                  className="font-serif text-2xl mt-8"
                  style={{ color: titleColor }}
                >
                  With love, <br /> {sender}
                </p>
              </div>
            </div>

            {/* FOLDING PART (Front Cover + Inside Left) */}
            <motion.div
              className="absolute inset-0 origin-left preserve-3d"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isCardFoldOpen ? -175 : 0 }}
              transition={{ duration: 0.8, ease: easeInOut }}
            >
              {/* CARD FRONT (Cover) */}
              <div
                className="absolute inset-0 rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-md border border-black/10"
                style={{
                  backgroundColor: cardColor,
                  backfaceVisibility: "hidden",
                  zIndex: 2,
                }}
              >
                <div className="absolute inset-0 bg-noise opacity-30 rounded-lg pointer-events-none" />
                <div
                  className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.03)",
                    color: titleColor,
                  }}
                >
                  <Heart size={32} fill="currentColor" />
                </div>
                <h2
                  className="font-['Caveat'] text-4xl mb-2 font-bold"
                  style={{ color: titleColor }}
                >
                  {title}
                </h2>
                <p
                  className="font-['Caveat'] text-xl opacity-60"
                  style={{ color: titleColor }}
                >
                  For: {recipient || "Someone special"}
                </p>

                <div className="mt-12 flex flex-col items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center animate-pulse"
                    style={{ borderColor: titleColor }}
                  >
                    <span className="text-[10px]" style={{ color: titleColor }}>
                      TAP
                    </span>
                  </div>
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] font-bold"
                    style={{ color: titleColor, opacity: 0.4 }}
                  >
                    Open Card
                  </p>
                </div>
              </div>

              {/* CARD INSIDE LEFT */}
              <div
                className="absolute inset-0 rounded-l-lg p-6 bg-white backface-hidden flex flex-col border border-black/10 shadow-inner"
                style={{
                  backgroundColor: cardColor,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  borderRight: "none",
                }}
              >
                <h3
                  className="font-['Caveat'] text-xl mb-4 opacity-70"
                  style={{ color: titleColor }}
                >
                  Special Memories
                </h3>
                <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar pr-1">
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
                      <Heart size={48} />
                      <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">
                        Always & Forever
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 3. Envelope Front Pocket */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 10,
            clipPath: "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)",
            background: `linear-gradient(to bottom, ${pocketColor}, ${envelopeColor})`,
          }}
          initial={{ opacity: 1, y: 0 }}
          animate={
            stage === "envelope-fade" || stage === "floating"
              ? { opacity: 0, y: 100 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.8 }}
        >
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
          initial={{ rotateX: 0 }}
          animate={
            stage === "idle" || stage === "seal-dissolve"
              ? { rotateX: 0 }
              : { rotateX: 180 }
          }
          transition={{ duration: 0.8, ease: easeInOut }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <div
            className="absolute inset-0 rounded-t-md backface-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: flapColor,
              backfaceVisibility: "hidden",
              zIndex: 2,
            }}
          >
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {stage !== "envelope-fade" && stage !== "floating" && (
            <div
              className="absolute inset-0 rounded-t-md"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                backgroundColor: flapBackColor,
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
                initial={{ scale: 1, opacity: 1 }}
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
                    : { scale: 1.5, opacity: 0 }
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={
                  stage === "idle"
                    ? { repeat: Infinity, duration: 2 }
                    : { duration: 0.6 }
                }
              >
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-rose-300 to-rose-500 shadow-lg flex items-center justify-center border-2 border-rose-200/50">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  {stage === "idle" && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-rose-200/80 text-xs font-serif tracking-widest uppercase"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
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

      {/* Background Music Player */}
      {isOpen && embedUrl && (
        <div className="absolute opacity-0 w-1 h-1 overflow-hidden pointer-events-none">
          <iframe
            src={embedUrl}
            width="100%"
            height="100"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
