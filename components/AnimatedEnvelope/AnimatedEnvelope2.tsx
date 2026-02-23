/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import { SparkleParticles } from "./SparkleParticles";

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
  titleColor = "#5D4037",
  pagePhotos = {},
  categories = [],
  music,
}: AnimatedEnvelopeProps) {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [showSparkles, setShowSparkles] = useState(false);
  const [lastOpenPageIndex, setLastOpenPageIndex] = useState(0);

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

  // Prepare Content - Multi-Page Booklet System
  const delimiter = "<<<PAGE_BREAK>>>";
  let messageChunks = message ? message.split(delimiter) : [""];
  if (messageChunks.length === 1 && messageChunks[0].length > 600) {
    messageChunks = message.match(/[\s\S]{1,500}/g) || [message];
  }

  // Construct leaves array
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
        <div className="flex-1 flex flex-col h-full">
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
                  <Image
                    src={pagePhotos[data.page - 1].url!}
                    alt={`Page ${data.page}`}
                    width={300}
                    height={400}
                    className="w-full rounded-lg shadow-sm border border-black/5 object-cover aspect-3/4"
                  />
                </div>
              )}
              <p
                className="font-serif text-sm leading-relaxed"
                style={{ color: textColor }}
              >
                {data.text}
              </p>
            </div>
          </div>
          <div
            className="mt-3 flex justify-between items-center text-xs opacity-40 font-bold tracking-widest shrink-0"
            style={{ color: titleColor }}
          >
            <span>
              PAGE {data.page} / {data.total}
            </span>
            {!isBack ? <span>TAP TO FLIP ➔</span> : <span>← TAP TO BACK</span>}
          </div>
        </div>
      );
    }

    if (data.type === "memory") {
      const isMemories = data.categoryName === "Special Memories";

      return (
        <div className="flex-1 flex flex-col h-full">
          <div
            className={`flex-1 rounded-xl p-3 border shadow-inner flex flex-col min-h-0 ${
              isMemories
                ? "bg-rose-50/70 border-rose-200/70"
                : "bg-white/60 border-rose-200/70 border-dashed"
            }`}
          >
            {isMemories ? (
              <div className="flex-1 flex flex-col min-h-0 relative">
                <div className="shrink-0 text-center absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center justify-center px-4 py-1 rounded-md bg-rose-100/80 shadow-sm">
                    <h3
                      className="font-['Caveat'] text-xl font-bold whitespace-nowrap"
                      style={{ color: titleColor }}
                    >
                      {data.title || "Special Memory"}
                    </h3>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="shrink-0 flex items-end justify-center">
                  <div className="w-full max-w-55">
                    <div className="relative bg-white rounded-md p-2 shadow-md border border-rose-200/70">
                      <div className="absolute -top-2 left-6 h-4 w-12 bg-rose-200/70 rounded-sm shadow-sm rotate-[-4deg]" />
                      <div className="relative w-full aspect-3/4 overflow-hidden rounded-md border border-black/5">
                        {data.url ? (
                          <Image
                            src={data.url}
                            alt={data.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Heart size={48} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 relative">
                <div className="shrink-0 text-center absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center justify-center px-4 py-1 rounded-md bg-rose-100/80 shadow-sm">
                    <h3
                      className="font-['Caveat'] text-xl font-bold whitespace-nowrap"
                      style={{ color: titleColor }}
                    >
                      {data.title || "Special Quality"}
                    </h3>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="shrink-0 flex items-end justify-center">
                  <div className="w-full max-w-55">
                    <div className="relative bg-white rounded-md p-2 shadow-md border border-rose-200/70">
                      <div className="relative w-full aspect-3/4 overflow-hidden rounded-md border border-black/5">
                        {data.url ? (
                          <Image
                            src={data.url}
                            alt={data.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Heart size={48} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="mt-3 flex justify-between items-center text-xs opacity-40 font-bold tracking-widest shrink-0"
            style={{ color: titleColor }}
          >
            <span>
              PAGE {data.page} / {data.total}
            </span>
            {!isBack ? <span>TAP TO FLIP ➔</span> : <span>← TAP TO BACK</span>}
          </div>
        </div>
      );
    }

    return null;
  };

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
      setLastOpenPageIndex(0);
    }
  }, [controlledIsOpen]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div className="relative w-80 h-55 md:w-90 md:h-60">
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

        {/* 2. The 3D Folding Card - Multi-Page Booklet */}
        <motion.div
          className="absolute left-1/2 origin-center"
          style={{
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
          initial={{ y: 0, scale: 1, rotate: 0, opacity: 0, x: "-50%" }}
          animate={
            stage === "idle" ||
            stage === "seal-dissolve" ||
            stage === "flap-open"
              ? { y: 0, opacity: 0, x: "-50%" }
              : stage === "card-rise"
                ? {
                    y: -120,
                    opacity: 1,
                    x: "-50%",
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
                      x:
                        lastOpenPageIndex === leaves.length
                          ? "50%"
                          : lastOpenPageIndex > 0
                            ? "0%"
                            : "-50%",
                      transition: { duration: 1 },
                    }
                  : stage === "floating"
                    ? {
                        y: [-50, -60, -50],
                        scale: 1.1,
                        opacity: 1,
                        x:
                          lastOpenPageIndex === leaves.length
                            ? "50%"
                            : lastOpenPageIndex > 0
                              ? "0%"
                              : "-50%",
                        transition: {
                          y: { repeat: Infinity, duration: 3, ease: easeInOut },
                          scale: { duration: 0.5 },
                          x: { duration: 0.8, ease: easeInOut },
                        },
                      }
                    : {}
          }
        >
          <div
            className="relative w-full h-full preserve-3d"
            style={{ transformStyle: "preserve-3d" }}
          >
            {leaves.map((leaf, i) => {
              const isFlipped = i < lastOpenPageIndex;
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
                    if (stage === "floating" || stage === "envelope-fade") {
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
                    className={`absolute inset-0 rounded-r-lg rounded-l-none bg-white backface-hidden shadow-md border border-black/10 overflow-hidden ${leaf.front?.type === "cover" ? "flex flex-col items-center justify-center text-center" : "p-5 flex flex-col"}`}
                    style={{
                      backgroundColor: cardColor,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {leaf.front?.type === "cover" ? (
                      <>
                        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none rounded-lg" />
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
                            <span
                              className="text-[10px]"
                              style={{ color: titleColor }}
                            >
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
                    className="absolute inset-0 rounded-l-lg rounded-r-none bg-white backface-hidden shadow-inner border border-black/10 overflow-hidden p-5 flex flex-col"
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
                      <div className="flex-1 flex flex-col justify-between items-center text-center h-full">
                        <div className="flex-1 flex flex-col items-center justify-center">
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
                        </div>
                        <div
                          className="flex justify-between items-center text-xs opacity-40 font-bold tracking-widest w-full shrink-0"
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
