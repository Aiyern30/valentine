"use client";
import { useState } from "react";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";

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
  const getEnvelopeColors = () => {
    switch (confession.envelope_style) {
      case "Romantic":
        return {
          envelopeColor: "#FFB6C1",
          pocketColor: "#FFB6C1",
          flapColor: "#FFC0CB",
          flapBackColor: "#DB7093",
          cardColor: "#FFF0F5",
          titleColor: "#9D174D",
          textColor: "#BE185D",
        };
      case "Vintage":
        return {
          envelopeColor: "#D4A574",
          pocketColor: "#D4A574",
          flapColor: "#DEB887",
          flapBackColor: "#C49A6C",
          cardColor: "#FEFCF3",
          titleColor: "#5D4037",
          textColor: "#8D6E63",
        };
      case "Midnight":
        return {
          envelopeColor: "#18181b",
          pocketColor: "#18181b",
          flapColor: "#27272a",
          flapBackColor: "#09090b",
          cardColor: "#FDFBF7",
          textColor: "#57534e",
          titleColor: "#1c1917",
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
      ...getEnvelopeColors(),
    };

    switch (confession.envelope_style) {
      case "Vintage":
        return <AnimatedEnvelope2 {...commonProps} />;
      case "Midnight":
        return <AnimatedEnvelope3 {...commonProps} />;
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
      className={`min-h-screen bg-linear-to-br ${getThemeStyles()} flex items-center justify-center p-4`}
    >
      <div className="max-w-4xl w-full">
        {/* Envelope */}
        <div className="flex justify-center">{getEnvelopeComponent()}</div>
      </div>
    </div>
  );
}
