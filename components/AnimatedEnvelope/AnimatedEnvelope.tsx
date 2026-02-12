import React, { useState } from "react";
import { easeInOut, easeOut, motion, spring } from "framer-motion";
import { Heart } from "lucide-react";

interface PagePhoto {
  file: File | null;
  position: "left" | "right" | null;
  url?: string;
}

interface SpecialMemory {
  file: File | null;
  url: string;
  title: string;
  date: string;
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
  music?: string;
  pagePhotos?: { [pageIndex: number]: PagePhoto };
  specialMemories?: SpecialMemory[];
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
  pagePhotos = {},
  specialMemories = [],
  music,
}: AnimatedEnvelopeProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isCardFoldOpen, setIsCardFoldOpen] = useState(false);
  const [lastOpenPageIndex, setLastOpenPageIndex] = useState(0);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

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

  // 1. Prepare Content (Hoisted for State/Animation Access)
  const delimiter = "<<<PAGE_BREAK>>>";
  let messageChunks = message ? message.split(delimiter) : [""];
  if (messageChunks.length === 1 && messageChunks[0].length > 600) {
    messageChunks = message.match(/[\s\S]{1,500}/g) || [message];
  }

  // Revised Leaves construction
  const leaves: any[] = [];

  // Leaf 0: Front=Cover, Back=Page 1
  leaves.push({
    index: 0,
    type: "cover", // For styling purposes
    front: { type: "cover" },
    back:
      messageChunks.length > 0
        ? {
            type: "message",
            text: messageChunks[0],
            page: 1,
            total: messageChunks.length,
          }
        : { type: "empty" },
  });

  // Data Chunks (Message + Memories)
  const allContentChunks = [
    ...messageChunks
      .slice(1)
      .map((text, i) => ({
        type: "message",
        text,
        page: i + 2,
        total: messageChunks.length,
      })),
    ...specialMemories.map((memory, i) => ({
      type: "memory",
      ...memory,
      index: i,
    })),
  ];

  // Data Leaves
  for (let i = 0; i < allContentChunks.length; i += 2) {
    leaves.push({
      index: leaves.length,
      type: "message",
      front: allContentChunks[i],
      back: i + 1 < allContentChunks.length ? allContentChunks[i + 1] : null,
    });
  }

  // Ensure last leaf has signature on back
  const lastLeafIndex = leaves.length - 1;
  const lastLeaf = leaves[lastLeafIndex];
  if (!lastLeaf.back) {
    lastLeaf.back = { type: "signature" };
  } else {
    leaves.push({
      index: leaves.length,
      type: "message",
      front: null,
      back: { type: "signature" },
    });
  }

  // Helper to render a message or memory page content
  const renderContentPage = (data: any, isBack: boolean = false) => {
    if (!data) return null;

    if (data.type === "message") {
      return (
        <>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="block">
              {pagePhotos[data.page - 1] && pagePhotos[data.page - 1].url && (
                <div
                  className={`w-1/3 mb-2 animate-in fade-in zoom-in duration-700 ${
                    pagePhotos[data.page - 1].position === "right"
                      ? "float-right ml-4"
                      : "float-left mr-4"
                  }`}
                >
                  <img
                    src={pagePhotos[data.page - 1].url}
                    alt={`Page ${data.page}`}
                    className="w-full rounded-lg shadow-sm border border-black/5 object-cover aspect-3/4"
                  />
                </div>
              )}
              <p
                className="font-['Lora'] text-base leading-relaxed"
                style={{ color: textColor }}
              >
                {data.text}
              </p>
            </div>
          </div>
          <div
            className="mt-4 flex justify-between items-center text-xs opacity-40 font-bold tracking-widest"
            style={{ color: titleColor }}
          >
            <span>
              PAGE {data.page} / {data.total}
            </span>
            {!isBack ? <span>TAP TO FLIP ➔</span> : <span>← TAP TO BACK</span>}
          </div>
        </>
      );
    }

    if (data.type === "memory") {
      return (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white/50 dark:bg-black/20 rounded-xl p-3 border border-black/5 shadow-inner flex flex-col">
            <div className="flex-1 relative rounded-lg overflow-hidden border border-black/10">
              {data.url ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <Heart size={48} />
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3
                className="font-['Caveat'] text-2xl font-bold mb-1"
                style={{ color: titleColor }}
              >
                {data.title || "Special Memory"}
              </h3>
              <p className="font-['Lora'] text-[10px] uppercase tracking-widest opacity-40 font-bold">
                {data.date || "Secret Moment"}
              </p>
            </div>
          </div>
          <div
            className="mt-4 flex justify-between items-center text-xs opacity-40 font-bold tracking-widest"
            style={{ color: titleColor }}
          >
            <span>MEMORY {data.index + 1}</span>
            {!isBack ? <span>TAP TO FLIP ➔</span> : <span>← TAP TO BACK</span>}
          </div>
        </div>
      );
    }

    return null;
  };
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
      x: "-50%",
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
      x: "-50%",
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
      x: 0,
      transition: {
        delay: 0,
        duration: 0.8,
        ease: easeInOut,
      },
    },
    back_closed: {
      y: -85,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: "50%", // Shift right so Left Page (Back Cover) is centered
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

          {/* 3D FOLDING CARD - MULTI-PAGE BOOKLET */}
          <motion.div
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
            className="absolute left-0 top-5 w-[360px] h-[460px] origin-bottom perspective-1000"
            style={{ left: "50%", x: "-50%" }}
          >
            <div
              className="relative w-full h-full preserve-3d transition-transform duration-700"
              style={{ transformStyle: "preserve-3d" }}
            >
              {leaves.map((leaf, i) => {
                const isFlipped = i < lastOpenPageIndex;
                // Z-Index Logic:
                // Right Stack (Not Flipped): Higher index = Lower Z. (Leaf 0 on top of Leaf 1)
                // Left Stack (Flipped): Higher index = Higher Z. (Leaf 1 on top of Leaf 0)
                const zIndex = isFlipped ? i : 50 - i;

                return (
                  <motion.div
                    key={i}
                    className="absolute inset-0 origin-left preserve-3d"
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex,
                    }}
                    animate={{ rotateY: isFlipped ? -175 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOpen) {
                        // If closed and is top-most right leaf -> Flip Open
                        if (!isFlipped && i === lastOpenPageIndex) {
                          setLastOpenPageIndex(i + 1);
                        }
                        // If open and is top-most left leaf -> Flip Close
                        else if (isFlipped && i === lastOpenPageIndex - 1) {
                          setLastOpenPageIndex(i);
                        }
                      }
                    }}
                  >
                    {/* FRONT FACE */}
                    <div
                      className={`absolute inset-0 rounded-r-lg rounded-l-none bg-white backface-hidden shadow-md border border-black/10 overflow-hidden ${leaf.front?.type === "cover" ? "flex flex-col items-center justify-center text-center" : "p-8 flex flex-col"}`}
                      style={{
                        backgroundColor: cardColor,
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {leaf.front?.type === "cover" ? (
                        <>
                          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
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
                              <span
                                className="text-xs"
                                style={{ color: titleColor }}
                              >
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
                        </>
                      ) : leaf.front?.type === "message" ||
                        leaf.front?.type === "memory" ? (
                        renderContentPage(leaf.front)
                      ) : (
                        <div className="flex-1 flex items-center justify-center opacity-[0.03]">
                          <Heart size={120} />
                        </div>
                      )}
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 rounded-l-lg rounded-r-none bg-white backface-hidden shadow-inner border border-black/10 overflow-hidden p-8 flex flex-col"
                      style={{
                        backgroundColor: cardColor,
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        borderRight: "none",
                      }}
                    >
                      {leaf.back?.type === "message" ||
                      leaf.back?.type === "memory" ? (
                        renderContentPage(leaf.back, true)
                      ) : leaf.back?.type === "signature" ? (
                        // LAST PAGE BACK - SHOW SENDER/SIGNATURE
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <div className="mb-6 opacity-20">
                            <Heart size={48} />
                          </div>
                          <p
                            className="font-['Caveat'] text-4xl leading-tight mb-2"
                            style={{ color: titleColor }}
                          >
                            With love,
                          </p>
                          <p
                            className="font-['Caveat'] text-3xl opacity-80"
                            style={{ color: titleColor }}
                          >
                            {sender}
                          </p>
                          <div className="mt-12 opacity-40">
                            <span
                              className="text-[10px] uppercase tracking-[0.3em] font-bold"
                              style={{ color: titleColor }}
                            >
                              End of Card
                            </span>
                          </div>
                          <div
                            className="mt-4 flex justify-between items-center text-xs opacity-40 font-bold tracking-widest w-full px-4 fixed bottom-8 left-0"
                            style={{ color: titleColor }}
                          >
                            <span className="ml-auto">← TAP TO BACK</span>
                          </div>
                        </div>
                      ) : (
                        // Blank back / Placeholder
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                          <Heart
                            size={48}
                            style={{ color: titleColor }}
                            className="mb-4"
                          />
                          <p
                            className="font-['Caveat'] text-2xl"
                            style={{ color: titleColor }}
                          >
                            Always & Forever
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
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
