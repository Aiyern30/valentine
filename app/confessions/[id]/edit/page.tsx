/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Check,
  Heart,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";

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

interface FormData {
  title: string;
  lovedOneName: string;
  petName: string;
  yourName: string;
  relationshipStatus: RelationshipStatus;
  message: string;
  pagePhotos: { [pageIndex: number]: PagePhoto };
  categories: Category[];
  theme: Theme;
  envelopeStyle: EnvelopeStyle;
  musicUrl: string;
}

type RelationshipStatus =
  | "Dating"
  | "Engaged"
  | "Married"
  | "Seeing someone"
  | "Friend"
  | "Mother"
  | "Father"
  | "Sibling"
  | "Relative"
  | "";

type Theme = "Life" | "Fall" | "Christmas" | "Birthday";
type EnvelopeStyle = "Romantic" | "Vintage" | "Midnight" | "Modern";

const EditConfessionPage = () => {
  const params = useParams();
  const router = useRouter();
  const confessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [wantsPhotos, setWantsPhotos] = useState<boolean | null>(null);
  const [categoriesSaved, setCategoriesSaved] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    lovedOneName: "",
    petName: "",
    yourName: "",
    relationshipStatus: "",
    message: "",
    pagePhotos: {},
    categories: [
      { id: "memories", name: "Special Memories", items: [] },
      { id: "qualities", name: "Special Qualities", items: [] },
    ],
    theme: "Life",
    envelopeStyle: "Romantic",
    musicUrl: "",
  });

  const totalSteps = 6;

  const relationshipOptions = [
    { icon: "💕", label: "Dating" },
    { icon: "💎", label: "Engaged" },
    { icon: "🏠", label: "Married" },
    { icon: "✨", label: "Seeing someone" },
    { icon: "😊", label: "Friend" },
    { icon: "👩", label: "Mother" },
    { icon: "👨", label: "Father" },
    { icon: "👥", label: "Sibling" },
    { icon: "👪", label: "Relative" },
  ];

  const envelopeOptions = [
    {
      id: "Romantic",
      name: "Soft Heart",
      preview: "💌",
      colors:
        "from-rose-100 to-pink-200 dark:from-rose-900/40 dark:to-pink-900/40",
    },
    {
      id: "Vintage",
      name: "Classic Wax",
      preview: "📜",
      colors:
        "from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
    },
    {
      id: "Midnight",
      name: "Neon Night",
      preview: "✨",
      colors: "bg-zinc-900",
    },
    {
      id: "Modern",
      name: "Glassmorphism",
      preview: "💎",
      colors: "bg-white/20 backdrop-blur-md border-white/30",
    },
  ];

  const themes = ["Life", "Fall", "Christmas", "Birthday"];

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        const response = await fetch(`/api/confessions/${confessionId}`);
        const data = await response.json();

        if (data.confession) {
          const confession = data.confession;
          const pagePhotos = (confession.photos || []).reduce(
            (
              acc: { [x: string]: { file: null; position: any; url: any } },
              photo: { pageIndex: string | number; position: any; url: any },
            ) => {
              acc[photo.pageIndex] = {
                file: null,
                position: photo.position,
                url: photo.url,
              };
              return acc;
            },
            {},
          );

          setFormData({
            title: confession.title,
            lovedOneName: confession.loved_one_name,
            petName: confession.pet_name || "",
            yourName: confession.sender_name || "",
            relationshipStatus: confession.relationship_status,
            message: confession.message,
            pagePhotos: pagePhotos,
            categories: confession.categories || [],
            theme: confession.theme,
            envelopeStyle: confession.envelope_style,
            musicUrl: confession.music_url || "",
          });

          // If confession already has category items, auto-show them
          const hasCategories =
            confession.categories &&
            confession.categories.some(
              (cat: any) => cat.items && cat.items.length > 0,
            );
          if (hasCategories) {
            setWantsPhotos(true);
            setCategoriesSaved(true);
          }
        }
      } catch (error) {
        console.error("Error fetching confession:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfession();
  }, [confessionId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getEnvelopeComponent = () => {
    const pagePhotos = Object.entries(formData.pagePhotos).reduce(
      (acc: any, [pageIndex, photo]) => {
        acc[parseInt(pageIndex)] = {
          file: null,
          position: photo.position,
          url: photo.url,
        };
        return acc;
      },
      {},
    );

    const categories = formData.categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: (category.items || []).map((item) => ({
        file: null,
        url: item.url,
        title: item.title,
        date: item.date,
      })),
    }));

    const getEnvelopeColors = () => {
      switch (formData.envelopeStyle) {
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

    const commonProps = {
      title: formData.title,
      recipient: formData.lovedOneName,
      sender: formData.yourName || "Someone Special",
      message: formData.message,
      isOpen: isPreviewOpen,
      onOpenChange: setIsPreviewOpen,
      pagePhotos: pagePhotos || {},
      categories: categories || [],
      music: formData.musicUrl || "",
      ...getEnvelopeColors(),
    };

    switch (formData.envelopeStyle) {
      case "Vintage":
        return <AnimatedEnvelope2 {...commonProps} />;
      case "Midnight":
        return <AnimatedEnvelope3 {...commonProps} />;
      default:
        return <AnimatedEnvelope1 {...commonProps} />;
    }
  };

  const nextStep = () => {
    if (currentStep === 3 && wantsPhotos === null) {
      // Categories step requires a choice
      return;
    }
    if (currentStep === 3 && wantsPhotos === false) {
      // Skip categories and go to Step 4
      setCurrentStep(4);
      setWantsPhotos(null);
      return;
    }
    if (currentStep === 3 && wantsPhotos === true) {
      // Categories form shown - user must click "Save & Preview Design" first
      if (!categoriesSaved) {
        return;
      }
      // Proceed to step 4
      setCurrentStep(4);
      setCategoriesSaved(false);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && wantsPhotos === false) {
      // Going back from Step 4 (after skipping categories) go to Step 3 with reset
      setCurrentStep(3);
      setWantsPhotos(null);
      return;
    }

    if (currentStep === 4 && wantsPhotos === true) {
      // Going back from Step 4 (after saving categories) - reset categoriesSaved to show button again
      setCurrentStep(3);
      setCategoriesSaved(false);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.lovedOneName || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("loved_one_name", formData.lovedOneName);
      formDataToSend.append("pet_name", formData.petName);
      formDataToSend.append("sender_name", formData.yourName);
      formDataToSend.append("relationship_status", formData.relationshipStatus);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("theme", formData.theme);
      formDataToSend.append("envelope_style", formData.envelopeStyle);
      formDataToSend.append("music_url", formData.musicUrl);

      const response = await fetch(`/api/confessions/${confessionId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/confessions");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save confession");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-rose-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading confession...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-rose-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
            />
          </div>
          <div className="text-center text-sm text-gray-400 mt-2">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>

        {/* Step 0: Basic Information */}
        {currentStep === 0 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Front Page Title <span className="text-pink-400">*</span>{" "}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    (Appears on Front Cover)
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., A Love Letter, For You, etc."
                  maxLength={50}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
                <span className="text-right text-xs text-gray-400 block mt-1">
                  {(formData.title || "").length}/50
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Loved One's Name <span className="text-pink-400">*</span>{" "}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    (Appears on Front Cover)
                  </span>
                </label>
                <input
                  type="text"
                  name="lovedOneName"
                  value={formData.lovedOneName}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  maxLength={150}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
                <span className="text-right text-xs text-gray-400 block mt-1">
                  {(formData.lovedOneName || "").length}/150
                </span>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      placeholder="What do you call your love?"
                      maxLength={50}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {(formData.petName || "").length}/50
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name{" "}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        (Appears on Back Cover)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="yourName"
                      value={formData.yourName}
                      onChange={handleInputChange}
                      placeholder="Your name or leave blank for anonymous"
                      maxLength={50}
                      className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {(formData.yourName || "").length}/50
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Relationship Status */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  Relationship Status <span className="text-rose-500">*</span>
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {relationshipOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() =>
                        handleInputChange({
                          target: {
                            name: "relationshipStatus",
                            value: option.label,
                          },
                        } as any)
                      }
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        formData.relationshipStatus === option.label
                          ? "border-rose-500 bg-rose-500/10 scale-105"
                          : "border-rose-50 dark:border-rose-900/20 bg-gray-50 dark:bg-zinc-900/50 hover:border-rose-200 hover:scale-102"
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-400 mt-4">Select status</div>
            </div>
          </div>
        )}

        {/* Step 2: Message */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-6">
              {formData.relationshipStatus && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-full border border-pink-500 text-pink-400 text-sm hover:bg-pink-500/10 transition flex items-center gap-2"
                  >
                    {formData.relationshipStatus}
                    <span className="text-xs">✏️</span>
                  </button>
                </div>
              )}

              <div className="text-center text-sm text-gray-400 mb-4">
                Tap to change the status or keep writing your message below.
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Message <span className="text-pink-400">*</span>
                </label>
                <div className="space-y-6">
                  {(() => {
                    const delimiter = "<<<PAGE_BREAK>>>";
                    const pages = formData.message
                      ? formData.message.split(delimiter)
                      : [""];

                    return pages.map((pageText, index) => (
                      <div key={index} className="relative group">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Page {index + 1}
                          </label>
                          {pages.length > 1 && (
                            <button
                              onClick={() => {
                                const newPages = pages.filter(
                                  (_: string, i: number) => i !== index,
                                );
                                const newPhotos = {
                                  ...formData.pagePhotos,
                                };
                                delete newPhotos[index];
                                const reindexedPhotos: {
                                  [key: number]: PagePhoto;
                                } = {};
                                Object.keys(newPhotos).forEach((key) => {
                                  const oldIndex = parseInt(key);
                                  const newIndex =
                                    oldIndex > index ? oldIndex - 1 : oldIndex;
                                  reindexedPhotos[newIndex] =
                                    newPhotos[oldIndex];
                                });
                                handleInputChange({
                                  target: {
                                    name: "message",
                                    value: newPages.join(delimiter),
                                  },
                                } as any);
                                setFormData((prev) => ({
                                  ...prev,
                                  pagePhotos: reindexedPhotos,
                                }));
                              }}
                              className="text-xs text-red-400 hover:text-red-500 hover:underline flex items-center gap-1"
                            >
                              <span>🗑️</span> Remove Page
                            </button>
                          )}
                        </div>

                        {/* Main Content Area - Side by Side Layout */}
                        <div className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl border border-rose-100/50 dark:border-rose-900/20">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Side: Photo Upload */}
                            <div className="shrink-0 w-full lg:w-64 flex flex-col">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Upload Image
                              </label>
                              <label className="block cursor-pointer flex-1">
                                <div
                                  className={`h-full min-h-60 lg:min-h-70 rounded-xl border-2 border-dashed transition-all relative overflow-hidden ${
                                    formData.pagePhotos[index]?.url
                                      ? "border-transparent"
                                      : "border-rose-200 dark:border-rose-800 hover:border-rose-400"
                                  }`}
                                >
                                  {formData.pagePhotos[index]?.url ? (
                                    <div className="relative w-full h-full group/image">
                                      <Image
                                        src={
                                          formData.pagePhotos[index]?.url || ""
                                        }
                                        alt={`Page ${index + 1} photo`}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-center">
                                          <span className="text-3xl mb-2 block">
                                            📷
                                          </span>
                                          <span className="text-xs text-white font-medium">
                                            Change Photo
                                          </span>
                                        </div>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          const newPhotos = {
                                            ...formData.pagePhotos,
                                          };
                                          delete newPhotos[index];
                                          setFormData((prev) => ({
                                            ...prev,
                                            pagePhotos: newPhotos,
                                          }));
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg transition-all z-10"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                      <span className="text-5xl mb-3">📷</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        Upload Photo
                                      </span>
                                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        (Optional)
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      const newPhotos = {
                                        ...formData.pagePhotos,
                                      };
                                      newPhotos[index] = {
                                        file,
                                        position: "left",
                                        url,
                                      };
                                      setFormData((prev) => ({
                                        ...prev,
                                        pagePhotos: newPhotos,
                                      }));
                                    }
                                  }}
                                />
                              </label>

                              {/* Photo Position Buttons */}
                              {formData.pagePhotos[index]?.url && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    Position:
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPhotos = {
                                          ...formData.pagePhotos,
                                        };
                                        newPhotos[index] = {
                                          ...newPhotos[index],
                                          position: "left",
                                        };
                                        setFormData((prev) => ({
                                          ...prev,
                                          pagePhotos: newPhotos,
                                        }));
                                      }}
                                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        formData.pagePhotos[index]?.position ===
                                        "left"
                                          ? "bg-rose-500 text-white shadow-md"
                                          : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-rose-300"
                                      }`}
                                    >
                                      ← Left
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPhotos = {
                                          ...formData.pagePhotos,
                                        };
                                        newPhotos[index] = {
                                          ...newPhotos[index],
                                          position: "right",
                                        };
                                        setFormData((prev) => ({
                                          ...prev,
                                          pagePhotos: newPhotos,
                                        }));
                                      }}
                                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        formData.pagePhotos[index]?.position ===
                                        "right"
                                          ? "bg-rose-500 text-white shadow-md"
                                          : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-rose-300"
                                      }`}
                                    >
                                      Right →
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Side: Message Textarea */}
                            <div className="flex-1 flex flex-col">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Your Message
                              </label>
                              <textarea
                                value={pageText}
                                onChange={(e) => {
                                  const newPages = [...pages];
                                  newPages[index] = e.target.value;
                                  handleInputChange({
                                    target: {
                                      name: "message",
                                      value: newPages.join(delimiter),
                                    },
                                  } as any);
                                }}
                                placeholder={`Write your heartfelt message for page ${index + 1}...`}
                                className="flex-1 bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all min-h-60 lg:min-h-70"
                                maxLength={500}
                              />
                              <div className="flex justify-end mt-2">
                                <span
                                  className={`text-xs font-medium ${pageText.length >= 450 ? "text-yellow-500" : pageText.length >= 400 ? "text-orange-400" : "text-gray-400"}`}
                                >
                                  {pageText.length}/500 characters
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}

                  {/* Add Another Page Button */}
                  <button
                    onClick={() => {
                      const delimiter = "<<<PAGE_BREAK>>>";
                      const current = formData.message ? formData.message : "";
                      handleInputChange({
                        target: {
                          name: "message",
                          value: current + delimiter + "",
                        },
                      } as any);
                    }}
                    className="w-full py-4 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-2xl text-rose-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <span className="text-xl">+</span>
                    <span>Add Another Page</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Categories (Special Memories / Special Qualities) */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            {wantsPhotos === null &&
            !formData.categories.some((cat) => cat.items.length > 0) ? (
              <div className="space-y-8 text-center">
                <div className="mx-auto w-20 h-20 bg-linear-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center transform rotate-12">
                  <Upload className="text-white" size={40} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    Would you like to add special categories?
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add special memories and qualities to make it more personal.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => {
                      setWantsPhotos(true);
                    }}
                    className="flex-1 px-8 py-4 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl transition-all shadow-lg font-medium"
                  >
                    Yes, let's add some
                  </button>
                  <button
                    onClick={() => {
                      setWantsPhotos(false);
                      setTimeout(() => {
                        setCurrentStep(4);
                        setWantsPhotos(null);
                      }, 300);
                    }}
                    className="flex-1 px-8 py-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-2xl transition-all font-medium border border-gray-200 dark:border-gray-700"
                  >
                    No, skip this
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-10">
                  {formData.categories.map((category, catIndex) => (
                    <div key={category.id} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/20 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {category.id === "memories" ? (
                            <Heart className="text-rose-500" size={24} />
                          ) : (
                            <Sparkles className="text-amber-500" size={24} />
                          )}
                          {category.name}
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newCategories = [...formData.categories];
                              newCategories[catIndex].items.push({
                                file: null,
                                url: "",
                                title: "",
                                date: "",
                              });
                              setFormData((prev) => ({
                                ...prev,
                                categories: newCategories,
                              }));
                            }}
                            className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                          >
                            + Add One
                          </button>
                          <label className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors cursor-pointer flex items-center gap-2">
                            <Upload size={16} />
                            Upload Multiple
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  const newCategories = [
                                    ...formData.categories,
                                  ];
                                  files.forEach((file) => {
                                    const url = URL.createObjectURL(file);
                                    newCategories[catIndex].items.push({
                                      file,
                                      url,
                                      title: "",
                                      date: "",
                                    });
                                  });
                                  setFormData((prev) => ({
                                    ...prev,
                                    categories: newCategories,
                                  }));
                                }
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="relative p-6 bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl border border-rose-100/50 dark:border-rose-900/20 group"
                          >
                            <button
                              onClick={() => {
                                const newCategories = [...formData.categories];
                                newCategories[catIndex].items = newCategories[
                                  catIndex
                                ].items.filter((_, i) => i !== itemIndex);
                                setFormData((prev) => ({
                                  ...prev,
                                  categories: newCategories,
                                }));
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                            >
                              <X size={18} />
                            </button>

                            {/* Horizontal Layout: Image Left, Fields Right */}
                            <div className="flex gap-4">
                              {/* Left: Upload Image */}
                              <div className="shrink-0 w-32 flex flex-col">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                  Upload Image
                                </label>
                                <label className="block cursor-pointer flex-1">
                                  <div
                                    className={`h-full min-h-35 rounded-xl border-2 border-dashed transition-colors relative overflow-hidden ${
                                      item.url
                                        ? "border-transparent"
                                        : "border-rose-200 dark:border-rose-800 hover:border-rose-400"
                                    }`}
                                  >
                                    {item.url ? (
                                      <>
                                        <Image
                                          src={item.url}
                                          alt="Detail"
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <div className="text-center">
                                            <Upload
                                              className="text-white mx-auto mb-1"
                                              size={20}
                                            />
                                            <span className="text-xs text-white font-medium">
                                              Change
                                            </span>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center h-full">
                                        <Upload
                                          className="text-rose-300 mb-2"
                                          size={28}
                                        />
                                        <span className="text-xs text-gray-400 text-center px-2">
                                          Upload Photo
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        const newCategories = [
                                          ...formData.categories,
                                        ];
                                        newCategories[catIndex].items[
                                          itemIndex
                                        ] = {
                                          ...newCategories[catIndex].items[
                                            itemIndex
                                          ],
                                          file,
                                          url,
                                        };
                                        setFormData((prev) => ({
                                          ...prev,
                                          categories: newCategories,
                                        }));
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              {/* Right: Title and Date Fields */}
                              <div className="flex-1 flex flex-col gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter a title"
                                    value={item.title}
                                    onChange={(e) => {
                                      const newCategories = [
                                        ...formData.categories,
                                      ];
                                      newCategories[catIndex].items[
                                        itemIndex
                                      ].title = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        categories: newCategories,
                                      }));
                                    }}
                                    className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">
                                    {category.id === "memories"
                                      ? "Date"
                                      : "Description"}
                                  </label>
                                  {category.id === "memories" ? (
                                    <input
                                      type="date"
                                      value={item.date}
                                      onChange={(e) => {
                                        const newCategories = [
                                          ...formData.categories,
                                        ];
                                        newCategories[catIndex].items[
                                          itemIndex
                                        ].date = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          categories: newCategories,
                                        }));
                                      }}
                                      className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder="Describe this quality"
                                      value={item.date}
                                      onChange={(e) => {
                                        const newCategories = [
                                          ...formData.categories,
                                        ];
                                        newCategories[catIndex].items[
                                          itemIndex
                                        ].date = e.target.value;
                                        setFormData((prev) => ({
                                          ...prev,
                                          categories: newCategories,
                                        }));
                                      }}
                                      className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {category.items.length === 0 && (
                          <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-2xl">
                            <p className="text-sm italic">
                              No items added to {category.name} yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save & Preview Design Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCategoriesSaved(true)}
                    className="px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-medium shadow-lg transition-all flex items-center gap-2"
                  >
                    <Check size={18} />
                    Save & Preview Design
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Theme & Style */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="text-rose-500" size={20} />
                  Theme
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "theme", value: theme },
                        } as any)
                      }
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        formData.theme === theme
                          ? "border-rose-500 bg-rose-500/10 scale-105"
                          : "border-rose-50 dark:border-rose-900/20 bg-gray-50 dark:bg-zinc-900/50 hover:border-rose-200"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="text-rose-500" size={20} />
                  Envelope Style
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {envelopeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "envelopeStyle", value: option.id },
                        } as any)
                      }
                      className={`relative group overflow-hidden rounded-2xl border-2 transition-all p-4 ${
                        formData.envelopeStyle === option.id
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30 scale-105"
                          : "border-rose-100 dark:border-rose-900/20 bg-gray-50 dark:bg-zinc-900/50 hover:border-rose-300"
                      }`}
                    >
                      <div
                        className={`aspect-4/3 rounded-xl mb-3 flex items-center justify-center text-4xl shadow-sm transition-transform group-hover:scale-110 bg-linear-to-br ${option.colors}`}
                      >
                        {option.preview}
                      </div>
                      <div className="text-sm font-semibold text-center truncate">
                        {option.name}
                      </div>
                      {formData.envelopeStyle === option.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white animate-in zoom-in">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  🎵 Add Music{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </h3>
                <input
                  type="url"
                  name="musicUrl"
                  value={formData.musicUrl}
                  onChange={handleInputChange}
                  placeholder="Paste a URL from YouTube, Spotify, Apple Music..."
                  className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Supports YouTube, Spotify, Apple Music, etc.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Final Preview
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                This is exactly what your loved one will see. Click the envelope
                to preview the animation.
              </p>
            </div>

            {/* Preview Stage */}
            <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center min-h-125">
              {/* Background Glow based on Theme */}
              <div
                className={`absolute inset-0 opacity-20 blur-[100px] transition-all duration-700 ${
                  formData.envelopeStyle === "Romantic"
                    ? "bg-rose-500"
                    : formData.envelopeStyle === "Vintage"
                      ? "bg-amber-600"
                      : formData.envelopeStyle === "Midnight"
                        ? "bg-blue-600"
                        : "bg-white"
                }`}
              />

              <div className="scale-75 md:scale-100 origin-center transition-transform duration-500">
                {getEnvelopeComponent()}
              </div>

              {isPreviewOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(false);
                  }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500 underline underline-offset-4 hover:text-white transition-colors z-50"
                >
                  Close preview
                </button>
              )}
            </div>

            {/* Style Toggles for Preview Page */}
            <div className="space-y-4 max-w-md mx-auto">
              {/* Envelope Theme Selector */}
              <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-4 border border-rose-100 dark:border-rose-900/20 shadow-lg">
                <h3 className="text-xs font-semibold mb-3 text-center text-zinc-500 uppercase tracking-widest">
                  Envelope Theme
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {envelopeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "envelopeStyle", value: option.id },
                        } as any)
                      }
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        formData.envelopeStyle === option.id
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600"
                      }`}
                    >
                      <div className="text-xl">{option.preview}</div>
                      <span className="text-xs font-medium text-center leading-tight">
                        {option.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-4 border border-rose-100 dark:border-rose-900/20 shadow-lg">
                <h3 className="text-xs font-semibold mb-3 text-center text-zinc-500 uppercase tracking-widest">
                  Background Theme
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() =>
                        handleInputChange({
                          target: { name: "theme", value: theme },
                        } as any)
                      }
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.theme === theme
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8 justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={
              saving ||
              (currentStep === 3 && wantsPhotos === null) ||
              (currentStep === 3 && wantsPhotos === true && !categoriesSaved)
            }
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? (
              saving ? (
                "Saving..."
              ) : (
                <>
                  <Check size={18} />
                  Save Changes
                </>
              )
            ) : (
              <>
                Next
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConfessionPage;
