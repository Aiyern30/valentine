/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  cubicBezier,
  Variants,
} from "framer-motion";
import { SparklesIcon, Heart, Stars } from "lucide-react";
import Image from "next/image";
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
  music?: string;
  pagePhotos?: { [pageIndex: number]: PagePhoto };
  categories?: Category[];
}

export function AnimatedEnvelope({
  title = "You're Invited",
  message = "Join us for an evening of celebration, music, and joy.",
  sender = "The Team",
  recipient,
  isOpen: controlledIsOpen,
  onOpenChange,
  envelopeColor = "#F5E6D3",
  pocketColor = "#EDD9C4",
  flapColor = "#F2E3D0",
  flapBackColor = "#E6D2BC",
  cardColor = "#FAFAF7",
  textColor = "#8C7B66",
  titleColor = "#5C4B38",
  pagePhotos = {},
  categories = [],
  music,
}: AnimatedEnvelopeProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [lastOpenPageIndex, setLastOpenPageIndex] = useState(0);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // 3D Tilt Logic based on cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // When open, reduce the parallax effect slightly for better readability
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], isOpen ? [5, -5] : [15, -15]),
    { stiffness: 150, damping: 20 },
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], isOpen ? [-5, 5] : [-15, 15]),
    { stiffness: 150, damping: 20 },
  );
  const tiltBackground = useTransform(
    mouseX,
    [-0.5, 0.5],
    [
      "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
      "linear-gradient(240deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
    ],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setLastOpenPageIndex(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prepare Content
  const delimiter = "<<<PAGE_BREAK>>>";
  let messageChunks = message ? message.split(delimiter) : [""];
  if (messageChunks.length === 1 && messageChunks[0].length > 600) {
    messageChunks = message.match(/[\s\S]{1,500}/g) || [message];
  }

  const leaves: any[] = [];
  const totalCategoryItems = categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );
  const totalPages = messageChunks.length + totalCategoryItems;

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

  let currentMemoryPageIndex = messageChunks.length + 1;
  allContentChunks.forEach((chunk) => {
    if (chunk.type === "memory") {
      (chunk as any).page = currentMemoryPageIndex++;
      (chunk as any).total = totalPages;
    }
  });

  for (let i = 0; i < allContentChunks.length; i += 2) {
    leaves.push({
      index: leaves.length,
      type: "page",
      front: allContentChunks[i],
      back:
        i + 1 < allContentChunks.length
          ? allContentChunks[i + 1]
          : { type: "signature" },
    });
  }

  if (allContentChunks.length % 2 === 0 && allContentChunks.length > 0) {
    leaves.push({
      index: leaves.length,
      type: "page",
      front: { type: "signature" },
      back: { type: "empty" },
    });
  }

  const handleOpen = () => {
    if (!isOpen) {
      if (onOpenChange) {
        onOpenChange(true);
      } else {
        setInternalIsOpen(true);
      }
    }
  };

  const renderContentPage = (content: any, isBack = false) => {
    if (!content || content.type === "empty") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
          <Heart size={48} style={{ color: titleColor }} className="mb-4" />
          <p className="font-serif text-xl" style={{ color: titleColor }}>
            Forever & Always
          </p>
        </div>
      );
    }

    if (content.type === "message") {
      return (
        <div className="flex-1 flex flex-col h-full min-h-0">
          <div className="mb-4 shrink-0 flex items-center gap-2">
            <Stars className="w-4 h-4" style={{ color: titleColor }} />
            <span
              className="font-serif text-xs font-semibold uppercase tracking-widest"
              style={{ color: titleColor }}
            >
              Message
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
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
                      className="w-full rounded-md border border-black/5 object-cover aspect-3/4 shadow-md"
                    />
                  </div>
                )}
              <div
                className="text-[14px] leading-relaxed font-serif tracking-wide whitespace-pre-wrap"
                style={{ color: textColor }}
              >
                {content.text}
              </div>
            </div>
          </div>

          <div
            className="mt-4 pt-2 border-t border-black/5 shrink-0 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest"
            style={{ color: titleColor, opacity: 0.6 }}
          >
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
          <div className="mb-4 shrink-0 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" style={{ color: titleColor }} />
            <span
              className="font-serif text-xs font-semibold uppercase tracking-widest"
              style={{ color: titleColor }}
            >
              {content.categoryName}
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-black/10 to-transparent" />
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-0 px-2">
            <div className="relative w-full aspect-square max-h-[220px] mx-auto bg-white border border-black/5 rounded-lg overflow-hidden shadow-lg p-2">
              <div className="relative w-full h-full rounded-md overflow-hidden bg-black/5">
                {content.url ? (
                  <img
                    src={content.url}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart
                      size={48}
                      style={{ color: titleColor }}
                      className="opacity-20 animate-pulse"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-1.5 shrink-0 px-2 text-center">
              <h4
                className="font-serif text-lg font-bold"
                style={{ color: titleColor }}
              >
                {content.title || "Memory Fragment"}
              </h4>
              <p
                className="font-serif text-[10px] uppercase tracking-[0.2em]"
                style={{ color: textColor, opacity: 0.8 }}
              >
                Date: {content.date}
              </p>
            </div>
          </div>

          <div
            className="mt-4 pt-2 border-t border-black/5 shrink-0 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest"
            style={{ color: titleColor, opacity: 0.6 }}
          >
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
              <Heart size={48} style={{ color: titleColor }} />
            </div>
            <p
              className="font-serif text-3xl leading-tight mb-2"
              style={{ color: titleColor }}
            >
              With all my love,
            </p>
            <p
              className="font-serif text-2xl italic"
              style={{ color: textColor }}
            >
              {sender}
            </p>
            <div className="mt-8 opacity-40">
              <span
                className="text-[10px] uppercase tracking-[0.3em] font-bold"
                style={{ color: titleColor }}
              >
                End of Letter
              </span>
            </div>
          </div>
          <div
            className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest w-full"
            style={{ color: titleColor, opacity: 0.6 }}
          >
            <span className="ml-auto">← Tap to close</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const easeInOutCubic = cubicBezier(0.4, 0, 0.2, 1);

  const cardVariants: Variants = {
    closed: {
      y: 30,
      z: 0,
      opacity: 0,
      scale: 0.9,
      zIndex: 10,
      x: "-50%",
      transition: { duration: 0.5, ease: "easeOut" },
    },
    open: {
      y: [30, -220, -25],
      z: [0, 10, 10],
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: "-50%",
      transition: {
        delay: 0.4,
        duration: 1.2,
        times: [0, 0.6, 1],
        ease: "easeInOut",
      },
    },
    centered: {
      y: -25,
      z: 10,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: 0,
      transition: { duration: 0.8, ease: easeInOutCubic },
    },
    back_closed: {
      y: -25,
      z: 10,
      opacity: 1,
      scale: 1,
      zIndex: 40,
      x: "50%",
      transition: { duration: 0.8, ease: easeInOutCubic },
    },
  };

  const flapVariants: Variants = {
    closed: {
      rotateX: 0,
      zIndex: 30,
      transition: { delay: 0.2, duration: 0.6, ease: "easeOut" },
    },
    open: {
      rotateX: -180,
      zIndex: 0,
      transition: { duration: 0.6, ease: easeInOutCubic },
    },
  };

  const shadowVariants = {
    closed: { opacity: 0.5, scale: 0.8, y: 0 },
    open: { opacity: 0.2, scale: 1.2, y: 20, transition: { duration: 0.8 } },
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[600px] w-full perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-[400px] h-[260px] cursor-pointer group"
        onClick={!isOpen ? handleOpen : undefined}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ y: 0 }}
        animate={{ y: isOpen ? 0 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Envelope Back Base */}
        <motion.div
          className="absolute inset-0 rounded-md shadow-2xl z-0"
          style={{
            backgroundColor: envelopeColor,
            border: `1px solid rgba(0,0,0,0.05)`,
            transform: "translateZ(-1px)",
          }}
        />

        {/* 3D BOOKLET CARD */}
        <motion.div
          className="absolute left-1/2"
          style={{ top: "-70px", width: "340px", height: "420px", x: "-50%" }}
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
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onClick={(e) => {
                      if (!isOpen) return;
                      e.stopPropagation();
                      if (!isFlipped && leafIndex === lastOpenPageIndex) {
                        setLastOpenPageIndex(leafIndex + 1);
                      } else if (
                        isFlipped &&
                        leafIndex === lastOpenPageIndex - 1
                      ) {
                        setLastOpenPageIndex(leafIndex);
                      }
                    }}
                  >
                    {/* FRONT FACE */}
                    <div
                      className="absolute inset-0 rounded-r-lg rounded-l-none backface-hidden shadow-md overflow-hidden p-6 flex flex-col"
                      style={{
                        backgroundColor: cardColor,
                        border: "1px solid rgba(0,0,0,0.05)",
                        borderLeft: "none",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {leaf.front.type === "cover" ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center border border-black/5 p-4 rounded-sm bg-black/2">
                          <div
                            className="w-12 h-12 rounded-full mb-6 flex items-center justify-center shadow-inner"
                            style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                          >
                            <SparklesIcon
                              size={24}
                              style={{ color: titleColor }}
                              className="animate-pulse"
                            />
                          </div>
                          <h2
                            className="font-serif text-3xl font-bold mb-4 tracking-wide"
                            style={{ color: titleColor }}
                          >
                            {title}
                          </h2>
                          <div
                            className="w-16 h-px mb-4"
                            style={{
                              backgroundColor: titleColor,
                              opacity: 0.2,
                            }}
                          />
                          <p
                            className="font-serif text-xs uppercase tracking-[0.2em] font-medium"
                            style={{ color: textColor }}
                          >
                            For: {recipient || "Always"}
                          </p>
                          <div className="mt-10 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div
                              className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center animate-spin-slow"
                              style={{ borderColor: titleColor }}
                            >
                              <span
                                className="text-[8px] font-bold"
                                style={{ color: titleColor }}
                              >
                                TAP
                              </span>
                            </div>
                            <p
                              className="text-[9px] uppercase tracking-[0.2em] font-bold"
                              style={{ color: titleColor }}
                            >
                              Open Letter
                            </p>
                          </div>
                        </div>
                      ) : (
                        renderContentPage(leaf.front)
                      )}
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 rounded-l-lg rounded-r-none backface-hidden shadow-inner overflow-hidden p-6 flex flex-col"
                      style={{
                        backgroundColor: cardColor,
                        border: "1px solid rgba(0,0,0,0.05)",
                        borderRight: "none",
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        background: `linear-gradient(to right, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 10%) ${cardColor}`,
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
          className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 20,
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 50% 50%, 0 0)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 260"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 drop-shadow-lg"
          >
            <path
              d="M0,0 L200,130 L400,0 L400,260 L0,260 Z"
              fill={pocketColor}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
            <path
              d="M0,260 L200,130 L400,260"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
          </svg>
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ background: tiltBackground }}
          />
        </div>

        {/* ENVELOPE FLAP */}
        <motion.div
          variants={flapVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="absolute top-0 left-0 w-full h-[140px] origin-top"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of Flap */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: flapColor,
              backfaceVisibility: "hidden",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
              borderTop: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <motion.div
              className="absolute inset-0 mix-blend-overlay"
              style={{ background: tiltBackground }}
            />
          </div>

          {/* Back of Flap */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              backgroundColor: flapBackColor,
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)",
            }}
          />
        </motion.div>

        <motion.div
          variants={shadowVariants}
          animate={isOpen ? "open" : "closed"}
          className="absolute -bottom-8 left-1/2 w-[80%] h-6 bg-black blur-[20px] rounded-[100%] z-[-1]"
          style={{ x: "-50%" }}
        />
      </motion.div>

      {/* Floating Music Player */}
      <MusicPlayer music={music} isOpen={isOpen} titleColor={titleColor} />
    </div>
  );
}
