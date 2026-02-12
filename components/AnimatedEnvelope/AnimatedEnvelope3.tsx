import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { easeInOut } from "framer-motion";

interface PagePhoto {
  file: File | null;
  position: "left" | "right" | null;
  url?: string;
}

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
  pagePhotos?: { [pageIndex: number]: PagePhoto };
  music?: string;
}

type EnvelopeStatus = "idle" | "cracking" | "revealed";

export function AnimatedEnvelope({
  title = "A Secret for You",
  message = "In a world of noise, you are my clearest signal.",
  sender = "Your Secret Admirer",
  recipient,
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#9e1b32",
  pocketColor = "#8a1529",
  flapColor = "#b92b45",
  flapBackColor = "#7a1325",
  cardColor = "#FDFBF7",
  textColor = "#57534e",
  titleColor = "#1c1917",
  pagePhotos = {},
  music,
}: AnimatedEnvelopeProps) {
  const [status, setStatus] = useState<EnvelopeStatus>("idle");
  const [isCardFoldOpen, setIsCardFoldOpen] = useState(false);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : status === "revealed";

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

  const handleOpen = () => {
    if (status !== "idle") return;

    if (onOpenChange) {
      onOpenChange(true);
    }

    setStatus("cracking");
    setTimeout(() => {
      setStatus("revealed");
    }, 400);
  };

  // Reset when controlled isOpen becomes false
  useEffect(() => {
    if (controlledIsOpen === false) {
      setStatus("idle");
      setIsCardFoldOpen(false);
    }
  }, [controlledIsOpen]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] w-full perspective-1000">
      {/* Ambient Particles/Stars */}
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
        {/* Glow Burst */}
        <AnimatePresence>
          {status === "revealed" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 2], opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute z-0 w-64 h-64 rounded-full bg-linear-to-r from-amber-200 via-orange-400 to-transparent blur-3xl"
            />
          )}
        </AnimatePresence>

        {/* Shockwave Ripple */}
        <AnimatePresence>
          {status === "revealed" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, borderWidth: "4px" }}
              animate={{ scale: 2.5, opacity: [0.8, 0], borderWidth: "0px" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute z-0 w-full h-full rounded-full border-amber-100/50"
              style={{ borderRadius: "50%" }}
            />
          )}
        </AnimatePresence>

        {/* 3D FOLDING CARD */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center text-center p-6 left-1/2"
          style={{
            x: "-50%",
            top: "-40px",
            width: "320px",
            height: "400px",
          }}
          initial={{ scale: 0.3, y: 50, rotateX: 15, opacity: 0 }}
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
                    delay: 0.1,
                  },
                }
              : {}
          }
          onClick={(e) => {
            if (status === "revealed") {
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
              className="absolute inset-0 rounded-r-lg p-6 flex flex-col shadow-inner border border-stone-200"
              style={{
                backgroundColor: cardColor,
                borderLeft: "none",
              }}
            >
              <div className="absolute top-2 right-2 text-stone-300">
                <Sparkles size={16} />
              </div>
              <div className="absolute bottom-2 left-2 text-stone-300">
                <Sparkles size={16} />
              </div>
              <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
                <div className="block">
                  {pagePhotos[0] && pagePhotos[0].url && (
                    <div
                      className={`w-1/3 mb-2 animate-in fade-in zoom-in duration-700 ${
                        pagePhotos[0].position === "right"
                          ? "float-right ml-4"
                          : "float-left mr-4"
                      }`}
                    >
                      <img
                        src={pagePhotos[0].url}
                        alt="Message photo"
                        className="w-full rounded-lg shadow-sm border border-black/5 object-cover aspect-3/4 grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  )}
                  <p className="font-serif text-sm leading-relaxed text-stone-600 italic">
                    {message}
                  </p>
                </div>
                <p className="font-serif text-2xl mt-6 text-stone-800 font-medium">
                  With Love, <br /> {sender}
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
                className="absolute inset-0 rounded-lg p-8 flex flex-col items-center justify-center text-center shadow-md border border-stone-200"
                style={{
                  backgroundColor: cardColor,
                  backfaceVisibility: "hidden",
                  zIndex: 2,
                }}
              >
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mb-3">
                  <Heart size={20} className="text-rose-500 fill-rose-500" />
                </div>
                <h2 className="font-serif text-xl text-stone-800 tracking-wide font-medium mb-2">
                  {title}
                </h2>
                <p className="font-serif text-sm text-stone-500 opacity-60">
                  For: {recipient || "Someone Special"}
                </p>
                <div className="mt-6 flex flex-col items-center gap-2 opacity-20">
                  <div className="w-4 h-4 rounded-full border border-stone-400 rotate-45" />
                  <p className="text-[7px] uppercase tracking-[0.4em] font-bold text-stone-950">
                    Reveal
                  </p>
                </div>
              </div>

              {/* CARD INSIDE LEFT */}
              <div
                className="absolute inset-0 rounded-l-lg p-6 bg-white backface-hidden flex flex-col border border-stone-200"
                style={{
                  backgroundColor: cardColor,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  borderRight: "none",
                }}
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-[0.05]">
                  <Heart size={48} />
                  <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">
                    Always & Forever
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ENVELOPE LAYERS */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          animate={status === "idle" ? { y: [0, -8, 0] } : { y: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Top Half */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden origin-bottom"
            initial={{ y: 0, opacity: 1 }}
            animate={
              status === "revealed"
                ? {
                    y: -150,
                    opacity: 0,
                  }
                : {}
            }
            style={{
              maskImage:
                status === "revealed"
                  ? "linear-gradient(to top, transparent, black 20%)"
                  : undefined,
              WebkitMaskImage:
                status === "revealed"
                  ? "linear-gradient(to top, transparent, black 20%)"
                  : undefined,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full h-[240px] shadow-inner relative"
              style={{
                background: `linear-gradient(to bottom right, ${envelopeColor}, ${flapBackColor})`,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-170 border-l-transparent border-r-170 border-r-transparent border-t-140 drop-shadow-md origin-top"
                style={{ borderTopColor: flapColor }}
              ></div>
            </div>
          </motion.div>

          {/* Bottom Half */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden origin-top"
            initial={{ y: 0, opacity: 1 }}
            animate={
              status === "revealed"
                ? {
                    y: 150,
                    opacity: 0,
                  }
                : {}
            }
            style={{
              maskImage:
                status === "revealed"
                  ? "linear-gradient(to bottom, transparent, black 20%)"
                  : undefined,
              WebkitMaskImage:
                status === "revealed"
                  ? "linear-gradient(to bottom, transparent, black 20%)"
                  : undefined,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-full h-[240px] absolute bottom-0 shadow-inner flex items-end justify-center"
              style={{
                background: `linear-gradient(to top right, ${pocketColor}, ${envelopeColor})`,
              }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div
                className="w-0 h-0 border-l-170 border-l-transparent border-r-170 border-r-transparent border-b-120 absolute bottom-0"
                style={{ borderBottomColor: `${pocketColor}cc` }}
              ></div>
            </div>
          </motion.div>

          {/* Wax Seal */}
          <motion.button
            onClick={handleOpen}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto group"
            initial={{ scale: 1 }}
            animate={
              status === "cracking"
                ? { scale: [1, 1.1, 0.9, 1.05], rotate: [0, -3, 3, 0] }
                : status === "revealed"
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1 }
            }
            transition={
              status === "cracking" ? { duration: 0.3 } : { duration: 0.4 }
            }
            whileHover={status === "idle" ? { scale: 1.05 } : {}}
          >
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-red-700 via-red-600 to-red-800 shadow-lg flex items-center justify-center border-2 border-red-900/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
              <div className="w-12 h-12 rounded-full border border-red-800/50 flex items-center justify-center bg-red-700/50 shadow-inner">
                <Heart className="w-6 h-6 text-red-900 fill-red-900 drop-shadow-sm opacity-80" />
              </div>
              <div className="absolute top-2 left-3 w-4 h-2 bg-white/20 rounded-full blur-[1px] -rotate-12"></div>

              {/* Crack Overlay */}
              <AnimatePresence>
                {status === "cracking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 0.2 }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-20 text-stone-400 font-light tracking-widest text-sm uppercase"
          >
            Tap seal to open
          </motion.p>
        )}
      </AnimatePresence>

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
