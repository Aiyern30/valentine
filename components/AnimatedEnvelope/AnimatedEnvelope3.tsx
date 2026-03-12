/* eslint-disable react-hooks/purity */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { easeInOut } from "framer-motion";
import { MusicPlayer } from "./MusicPlayer";

interface PagePhoto {
  file: File | null;
  position: "left" | "right" | null;
  url?: string;
}

interface CategoryItem {
  file: File | null;
  url: string;
  title: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  items: CategoryItem[];
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
  categories?: Category[];
  music?: string;
}

export function AnimatedEnvelope({
  title = "Neon Dreams for You",
  message = "Like neon lights in the dark, you illuminate my world.",
  sender = "Your Night Light",
  recipient = "Beautiful Soul",
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#0f0f23",
  pocketColor = "#1a1a40",
  flapColor = "#2d2d5f",
  flapBackColor = "#0a0a1f",
  cardColor = "#0a0a1a",
  textColor = "#e0e0f0",
  titleColor = "#00ffff",
  pagePhotos = {},
  categories = [],
  music,
}: AnimatedEnvelopeProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [lastOpenPageIndex, setLastOpenPageIndex] = useState(0);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setLastOpenPageIndex(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prepare Content (following base envelope pattern)
  const delimiter = "<<<PAGE_BREAK>>>";
  let messageChunks = message ? message.split(delimiter) : [""];
  if (messageChunks.length === 1 && messageChunks[0].length > 600) {
    messageChunks = message.match(/[\s\S]{1,500}/g) || [message];
  }

  // Create leaves structure (like base envelope)
  const leaves: any[] = [];
  const totalCategoryItems = categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );
  const totalPages = messageChunks.length + totalCategoryItems;

  // Leaf 0: Front=Cover, Back=Page 1
  leaves.push({
    index: 0,
    type: "cover",
    front: { type: "cover" },
    back:
      messageChunks.length > 0
        ? {
            type: "message",
            text: messageChunks[0],
            page: 1,
            total: totalPages,
          }
        : { type: "empty" },
  });

  // Data Chunks (Message + Memories)
  const allContentChunks = [
    ...messageChunks.slice(1).map((text, i) => ({
      type: "message",
      text,
      page: i + 2,
      total: totalPages,
    })),
    ...categories.flatMap((cat) =>
      cat.items.map((item) => ({
        type: "memory",
        ...item,
        categoryName: cat.name,
      })),
    ),
  ];

  // Fix page numbering for memory items
  let currentMemoryPageIndex = messageChunks.length + 1;
  allContentChunks.forEach((chunk) => {
    if (chunk.type === "memory") {
      (chunk as any).page = currentMemoryPageIndex++;
      (chunk as any).total = totalPages;
    }
  });

  // Pair chunks into leaves (front/back)
  for (let i = 0; i < allContentChunks.length; i += 2) {
    leaves.push({
      index: leaves.length,
      type: "page",
      front: allContentChunks[i],
      back: allContentChunks[i + 1] || { type: "signature" },
    });
  }

  // If odd number of chunks, add signature to last leaf
  if (allContentChunks.length % 2 === 0 && allContentChunks.length > 0) {
    leaves.push({
      index: leaves.length,
      type: "page",
      front: { type: "signature" },
      back: { type: "empty" },
    });
  }

  const handleOpen = () => {
    if (!internalIsOpen && controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  const renderContentPage = (content: any, isBack = false) => {
    if (!content || content.type === "empty") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
          <Heart size={48} className="mb-4 text-cyan-400" />
          <p className="font-mono text-xl text-cyan-300">Forever & Always</p>
        </div>
      );
    }

    if (content.type === "message") {
      return (
        <div className="flex-1 flex flex-col h-full min-h-0">
          <div className="mb-4 shrink-0">
            <h3 className="font-mono text-sm font-bold text-cyan-400 tracking-wider uppercase">
              &gt; Message.log
            </h3>
            <div className="h-0.5 w-16 bg-linear-to-r from-cyan-400 to-transparent mt-2" />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
            <div className="block">
              {pagePhotos[content.page - 1] &&
                pagePhotos[content.page - 1].url && (
                  <div
                    className={`w-1/3 mb-2 ${
                      pagePhotos[content.page - 1].position === "right"
                        ? "float-right ml-4"
                        : "float-left mr-4"
                    }`}
                  >
                    <img
                      src={pagePhotos[content.page - 1].url}
                      alt={`Page ${content.page}`}
                      className="w-full rounded border border-cyan-400/20 object-cover aspect-3/4 shadow-lg"
                    />
                  </div>
                )}

              <div className="text-cyan-100 text-[13px] leading-relaxed font-mono tracking-wide whitespace-pre-wrap">
                {content.text}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-cyan-400/10 shrink-0 flex justify-between items-center text-[10px] text-cyan-400/60 font-mono uppercase tracking-widest">
            <span>
              Page {content.page} / {content.total}
            </span>
            {!isBack ? <span>Tap to flip ➔</span> : <span>← Tap to back</span>}
          </div>
        </div>
      );
    }

    if (content.type === "memory") {
      return (
        <div className="flex-1 flex flex-col h-full min-h-0">
          <div className="mb-4 shrink-0">
            <h3 className="font-mono text-sm font-bold text-purple-400 tracking-wider uppercase">
              &gt; {content.categoryName}.db
            </h3>
            <div className="h-0.5 w-20 bg-linear-to-r from-purple-400 to-transparent mt-2" />
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-0 px-2">
            <div className="relative w-full aspect-square max-h-[220px] mx-auto bg-black/40 border border-cyan-400/20 rounded-md overflow-hidden shadow-lg shadow-cyan-900/20">
              {content.url ? (
                <img
                  src={content.url}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={48} className="text-cyan-400/30 animate-pulse" />
                </div>
              )}
            </div>

            <div className="mt-5 space-y-1.5 shrink-0 px-2 text-center">
              <h4 className="font-mono text-base text-cyan-300 font-semibold drop-shadow-md">
                {content.title || "Memory Fragment"}
              </h4>
              <p className="font-mono text-[10px] text-cyan-400/60 uppercase tracking-[0.2em]">
                Date: {content.date}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-purple-400/10 shrink-0 flex justify-between items-center text-[10px] text-purple-400/60 font-mono uppercase tracking-widest">
            <span>
              Page {content.page} / {content.total}
            </span>
            {!isBack ? <span>Tap to flip ➔</span> : <span>← Tap to back</span>}
          </div>
        </div>
      );
    }

    if (content.type === "signature") {
      return (
        <div className="flex-1 flex flex-col h-full text-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-6 opacity-30">
              <Heart size={48} className="text-cyan-400" />
            </div>
            <p className="font-mono text-2xl leading-tight mb-2 text-cyan-300">
              Connection established,
            </p>
            <p className="font-mono text-xl text-purple-300">{sender}</p>
            <div className="mt-8 opacity-40">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-400">
                End of transmission
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs opacity-40 font-bold tracking-widest w-full">
            <span className="ml-auto text-cyan-400">&lt; Tap to close</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Animation variants (following base envelope pattern)
  const cardVariants: Variants = {
    closed: {
      y: 50,
      opacity: 0,
      scale: 0.3,
      rotateX: 15,
      zIndex: 10,
      x: "-50%",
      transition: {
        delay: 0.6,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    open: {
      y: [50, -220, -25],
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: "-50%",
      transition: {
        delay: 0.6,
        duration: 1.2,
        times: [0, 0.6, 1],
        ease: "easeInOut",
      },
    },
    centered: {
      y: -25,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: 0,
      transition: {
        delay: 0,
        duration: 0.8,
        ease: easeInOut,
      },
    },
    back_closed: {
      y: -25,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: "50%",
      transition: {
        delay: 0,
        duration: 0.8,
        ease: easeInOut,
      },
    },
  };

  const flapVariants: Variants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: { duration: 0.8, ease: easeInOut },
    },
    open: {
      rotateX: -180,
      zIndex: 0,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] w-full perspective-1000">
      {/* Neon Ambient Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              background:
                i % 3 === 0 ? "cyan" : i % 3 === 1 ? "#ff00ff" : "#00ff00",
              left: `${20 + i * 12}%`,
              top: `${30 + i * 10}%`,
              boxShadow: `0 0 10px ${i % 3 === 0 ? "cyan" : i % 3 === 1 ? "#ff00ff" : "#00ff00"}`,
              animationDelay: `${i * 0.5}s`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative w-[420px] h-[290px]"
        initial={{ y: 0 }}
        animate={{ y: isOpen ? -20 : 0 }}
        transition={{ duration: 0.8 }}
        onClick={!isOpen ? handleOpen : undefined}
        style={{ cursor: !isOpen ? "pointer" : "default" }}
      >
        {/* 3D CARD */}
        <motion.div
          className="absolute left-1/2"
          style={{ x: "-50%", top: "-80px", width: "360px", height: "460px" }}
          variants={cardVariants}
          initial="closed"
          animate={
            isOpen
              ? lastOpenPageIndex === leaves.length
                ? "back_closed"
                : lastOpenPageIndex > 0
                  ? "centered"
                  : "open"
              : "closed"
          }
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Card Pages */}
            <div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {leaves.map((leaf, leafIndex) => {
                const isFlipped = leafIndex < lastOpenPageIndex;

                return (
                  <motion.div
                    key={leaf.index}
                    className="absolute inset-0 origin-left"
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex: isFlipped ? leafIndex : 50 - leafIndex,
                    }}
                    animate={{ rotateY: isFlipped ? -175 : 0 }}
                    transition={{
                      duration: 0.8,
                      ease: easeInOut,
                    }}
                    onClick={(e) => {
                      if (!isOpen) return;
                      e.stopPropagation();
                      // If closed and is top-most right leaf -> Flip Open
                      if (!isFlipped && leafIndex === lastOpenPageIndex) {
                        setLastOpenPageIndex(leafIndex + 1);
                      }
                      // If open and is top-most left leaf -> Flip Close
                      else if (
                        isFlipped &&
                        leafIndex === lastOpenPageIndex - 1
                      ) {
                        setLastOpenPageIndex(leafIndex);
                      }
                    }}
                  >
                    {/* FRONT FACE */}
                    <div
                      className="absolute inset-0 rounded-r-lg rounded-l-none bg-black/80 backface-hidden shadow-inner border border-cyan-400/30 overflow-hidden p-8 flex flex-col"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(10, 10, 26, 0.95) 0%, 
                            rgba(15, 15, 42, 0.95) 50%,
                            rgba(20, 20, 60, 0.95) 100%
                          ),
                          radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(255, 0, 255, 0.08) 0%, transparent 50%)
                        `,
                        borderLeft: "none",
                        backfaceVisibility: "hidden",
                        boxShadow: `
                          inset 0 0 30px rgba(0, 255, 255, 0.15),
                          0 0 20px rgba(0, 255, 255, 0.2)
                        `,
                      }}
                    >
                      {leaf.front.type === "cover" ? (
                        // COVER PAGE
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center mb-6 relative">
                            <Heart
                              size={28}
                              className="text-white animate-pulse"
                            />
                            <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 animate-ping" />
                          </div>

                          <h2 className="font-mono text-2xl font-bold mb-3 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide leading-tight text-center">
                            {title}
                          </h2>

                          <div className="mb-4 px-4 py-2 bg-black/30 border border-cyan-400/30 rounded-lg backdrop-blur-sm">
                            <p className="font-mono text-sm bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                              &#8250; For: {recipient || "Beautiful Soul"}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-3 opacity-80">
                            <div className="relative">
                              <div
                                className="w-8 h-8 rounded-full border-2 border-cyan-400 animate-spin"
                                style={{
                                  background: `conic-gradient(from 0deg, transparent, cyan, transparent)`,
                                }}
                              />
                              <div
                                className="absolute inset-1 w-6 h-6 rounded-full border-2 border-purple-400 animate-spin"
                                style={{
                                  background: `conic-gradient(from 180deg, transparent, #ff00ff, transparent)`,
                                  animationDirection: "reverse",
                                  animationDuration: "2s",
                                }}
                              />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.6em] font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                              &#8250; Tap to open
                            </p>
                          </div>
                        </div>
                      ) : (
                        renderContentPage(leaf.front)
                      )}
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 rounded-l-lg rounded-r-none bg-black/80 backface-hidden shadow-inner border border-cyan-400/30 overflow-hidden p-8 flex flex-col"
                      style={{
                        background: `
                          linear-gradient(225deg, 
                            rgba(15, 0, 30, 0.95) 0%, 
                            rgba(20, 0, 40, 0.95) 30%,
                            rgba(25, 0, 50, 0.95) 70%,
                            rgba(10, 0, 25, 0.95) 100%
                          ),
                          radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.2) 0%, transparent 50%),
                          radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.15) 0%, transparent 40%)
                        `,
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        borderRight: "none",
                        boxShadow: `
                          inset 2px 0 20px rgba(255, 0, 255, 0.15),
                          -5px 0 20px rgba(255, 0, 255, 0.1)
                        `,
                      }}
                    >
                      {renderContentPage(leaf.back, true)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
            <defs>
              <radialGradient id="neonPocket" cx="50%" cy="50%">
                <stop offset="0%" stopColor={pocketColor} />
                <stop offset="100%" stopColor={envelopeColor} />
              </radialGradient>
            </defs>
            <path
              d="M0,0 L210,145 L420,0 L420,290 L0,290 Z"
              fill="url(#neonPocket)"
              stroke="rgba(0,255,255,0.2)"
              strokeWidth="1"
            />
            <path
              d="M0,290 L210,145 L420,290"
              fill="none"
              stroke="rgba(0,255,255,0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <motion.div
          variants={flapVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="absolute top-0 left-0 w-full h-36.25 origin-top"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of Flap */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: flapColor,
              backfaceVisibility: "hidden",
              borderTop: "1px solid rgba(0,255,255,0.2)",
              filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
              boxShadow: "0 0 20px rgba(0,255,255,0.1)",
            }}
          />

          {/* Back of Flap */}
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

      {/* Instruction Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute -bottom-14 left-0 w-full text-center font-mono text-xl opacity-60 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
      >
        Click to decrypt
      </motion.p>

      {/* Floating Music Player */}
      <MusicPlayer music={music} isOpen={isOpen} titleColor={titleColor} />
    </div>
  );
}
