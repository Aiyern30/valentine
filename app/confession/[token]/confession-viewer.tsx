"use client";
import { useState } from "react";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";
import { AnimatedEnvelope as AnimatedEnvelope4 } from "@/components/AnimatedEnvelope/AnimatedEnvelope4";

interface Photo {
  pageIndex: number;
  position: string;
  url: string;
}

interface CategoryItem {
  title: string;
  date: string;
  url: string;
}

interface Category {
  id: string;
  name: string;
  items: CategoryItem[];
}

interface Confession {
  id: string;
  title: string;
  loved_one_name: string;
  pet_name: string | null;
  sender_name: string | null;
  relationship_status: string;
  message: string;
  theme: string;
  envelope_style: string;
  music_url: string | null;
  photos: Photo[];
  categories: Category[];
  sender_full_name: string | null;
  is_opened: boolean;
}

interface ConfessionViewerProps {
  confession: Confession;
}

export default function ConfessionViewer({
  confession,
}: ConfessionViewerProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  // Get envelope colors based on style
  const getEnvelopeColors = (style: string) => {
    switch (style) {
      case "Romantic":
        return {
          envelopeColor: "#fdf2f8", // pink-50
          pocketColor: "#fce7f3", // pink-100
          flapColor: "#fbcfe8", // pink-200
          flapBackColor: "#f9a8d4", // pink-300
          cardColor: "#ffffff",
          textColor: "#831843", // pink-900
          titleColor: "#be185d", // pink-700
        };
      case "Vintage":
        return {
          envelopeColor: "#fef3c7", // amber-50
          pocketColor: "#fde68a", // amber-100
          flapColor: "#fcd34d", // amber-200
          flapBackColor: "#fbbf24", // amber-400
          cardColor: "#fffbeb", // amber-50
          textColor: "#78350f", // amber-900
          titleColor: "#92400e", // amber-800
        };
      case "Midnight":
        return {
          envelopeColor: "#18181b", // zinc-900
          pocketColor: "#27272a", // zinc-800
          flapColor: "#3f3f46", // zinc-700
          flapBackColor: "#52525b", // zinc-600
          cardColor: "#09090b", // zinc-950
          textColor: "#e4e4e7", // zinc-200
          titleColor: "#60a5fa", // blue-400
        };
      case "Modern":
        return {
          envelopeColor: "#fafafa", // slate-50
          pocketColor: "#f1f5f9", // slate-100
          flapColor: "#e2e8f0", // slate-200
          flapBackColor: "#cbd5e1", // slate-300
          cardColor: "#ffffff",
          textColor: "#334155", // slate-700
          titleColor: "#0f172a", // slate-900
        };
      case "Neon":
        return {
          envelopeColor: "#0f0f23",
          pocketColor: "#1a1a40",
          flapColor: "#2d2d5f",
          flapBackColor: "#0a0a1f",
          cardColor: "#0a0a1a",
          textColor: "#e0e0f0",
          titleColor: "#00ffff",
        };
      default:
        return {
          envelopeColor: "rgba(255, 255, 255, 0.1)",
          pocketColor: "rgba(255, 255, 255, 0.1)",
          flapColor: "rgba(255, 255, 255, 0.2)",
          flapBackColor: "rgba(255, 255, 255, 0.05)",
          cardColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#333",
          textColor: "#666",
        };
    }
  };

  // Convert photos array to pagePhotos object format
  const pagePhotos = confession.photos?.reduce(
    (acc, photo) => {
      acc[photo.pageIndex] = {
        file: null,
        position: photo.position as "left" | "right",
        url: photo.url,
      };
      return acc;
    },
    {} as {
      [key: number]: {
        file: File | null;
        position: "left" | "right";
        url?: string;
      };
    },
  );

  // Convert categories to expected format
  const categories = confession.categories?.map((category) => ({
    id: category.id,
    name: category.name,
    items: category.items.map((item) => ({
      file: null,
      url: item.url,
      title: item.title,
      date: item.date,
    })),
  }));

  // Get envelope component based on style
  const getEnvelopeComponent = () => {
    const [parsedStyle, parsedVariant] = (
      confession.envelope_style || "Romantic|Classic"
    ).split("|");

    const commonProps = {
      title: confession.title,
      recipient: confession.loved_one_name,
      sender: confession.sender_name || "Someone Special",
      message: confession.message,
      isOpen: isEnvelopeOpen,
      onOpenChange: setIsEnvelopeOpen,
      pagePhotos: pagePhotos || {},
      categories: categories || [],
      music: confession.music_url || "",
      ...getEnvelopeColors(parsedStyle),
    };

    switch (parsedVariant) {
      case "Classic":
        return <AnimatedEnvelope1 {...commonProps} />;
      case "Wax Seal":
        return <AnimatedEnvelope2 {...commonProps} />;
      case "Dramatic":
        return <AnimatedEnvelope3 {...commonProps} />;
      case "Elegant":
        return <AnimatedEnvelope4 {...commonProps} />;
      default:
        return <AnimatedEnvelope1 {...commonProps} />;
    }
  };

  // Get theme styles
  const getThemeStyles = () => {
    switch (confession.theme) {
      case "Fall":
        return "from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950";
      case "Christmas":
        return "from-red-50 via-green-50 to-emerald-50 dark:from-red-950 dark:via-green-950 dark:to-emerald-950";
      case "Birthday":
        return "from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950";
      default:
        return "from-rose-50 via-pink-50 to-purple-50 dark:from-zinc-900 dark:via-rose-950 dark:to-purple-950";
    }
  };

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${getThemeStyles()} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Background glow based on envelope style */}
      <div
        className={`absolute inset-0 opacity-20 blur-[100px] transition-all duration-700 pointer-events-none ${
          confession.envelope_style?.split("|")[0] === "Romantic"
            ? "bg-rose-500"
            : confession.envelope_style?.split("|")[0] === "Vintage"
              ? "bg-amber-600"
              : confession.envelope_style?.split("|")[0] === "Neon"
                ? "bg-cyan-500"
                : confession.envelope_style?.split("|")[0] === "Midnight"
                  ? "bg-blue-600"
                  : "bg-white"
        }`}
      />

      <div className="max-w-4xl w-full relative z-10">
        {/* Envelope */}
        <div className="flex justify-center scale-90 md:scale-100 origin-center">{getEnvelopeComponent()}</div>
      </div>
    </div>
  );
}
