/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, ChangeEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  X,
  Heart,
} from "lucide-react";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";
import Image from "next/image";
// Type Definitions
interface PagePhoto {
  file: File | null;
  position: "left" | "right" | null;
  url?: string; // For preview
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
  pagePhotos: { [pageIndex: number]: PagePhoto }; // Photos indexed by page number
  categories: Category[];
  theme: Theme;
  envelopeStyle: EnvelopeStyle;
  animationVariant: AnimationVariant;
  musicUrl: string;
  fullName: string;
  email: string;
  phone: string;
  showOptional?: boolean;
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

type EnvelopeStyle = "Vintage" | "Romantic" | "Midnight" | "Modern";

type AnimationVariant = "Classic" | "Elegant" | "Dramatic";

interface EnvelopeOption {
  id: EnvelopeStyle;
  name: string;
  preview: string;
  colors: string;
}

interface RelationshipOption {
  icon: string;
  label: RelationshipStatus;
}

interface MessageSuggestion {
  title: string;
  text: string;
}

interface MessageSuggestionsMap {
  [key: string]: MessageSuggestion[];
}

type MusicService =
  | "YouTube"
  | "Spotify"
  | "Apple Music"
  | "Deezer"
  | "Amazon Music";

interface ValidationErrors {
  title?: string;
  lovedOneName?: string;
  relationshipStatus?: string;
  message?: string;
  email?: string;
  phone?: string;
  fullName?: string;
}

// Main Component
export default function CondolenceForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreenMessage, setIsFullscreenMessage] = useState(false);
  const [wantsPhotos, setWantsPhotos] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
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
    animationVariant: "Classic",
    musicUrl: "",
    fullName: "",
    email: "",
    phone: "",
    showOptional: false,
  });

  const totalSteps: number = 6;

  const relationshipOptions: RelationshipOption[] = [
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

  const messageSuggestions: MessageSuggestionsMap = {
    Engaged: [
      {
        title: "Eternal Commitment",
        text: "Our commitment is just the beginning of a wonderful journey. I can't wait to call you my spouse. 💍",
      },
      {
        title: "Countdown",
        text: "Counting the days to make our union official. Every day closer to forever with you. 💕",
      },
    ],
    Married: [
      {
        title: "Forever Together",
        text: "Through every season of life, my love for you only grows stronger. Forever grateful to call you mine.",
      },
    ],
    Friend: [
      {
        title: "Cherished Friendship",
        text: "Your friendship has been a constant light in my life. Thank you for always being there.",
      },
    ],
    Mother: [
      {
        title: "Grateful Heart",
        text: "Thank you for your unconditional love and endless support. You've shaped who I am today.",
      },
    ],
    Father: [
      {
        title: "Pillar of Strength",
        text: "Your wisdom and guidance have been my foundation. Thank you for always believing in me.",
      },
    ],
  };

  const themes: Theme[] = ["Life", "Fall", "Christmas", "Birthday"];

  const envelopeOptions: EnvelopeOption[] = [
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

  const musicServices: MusicService[] = [
    "YouTube",
    "Spotify",
    "Apple Music",
    "Deezer",
    "Amazon Music",
  ];

  // Validation Functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ""));
  };

  const validateStep = (step: number): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          newErrors.title = "Front page title is required";
        } else if (formData.title.length > 50) {
          newErrors.title = "Title cannot exceed 50 characters";
        }
        if (!formData.lovedOneName.trim()) {
          newErrors.lovedOneName = "Loved one's name is required";
        } else if (formData.lovedOneName.length > 150) {
          newErrors.lovedOneName = "Name cannot exceed 150 characters";
        }
        break;

      case 1:
        if (!formData.relationshipStatus) {
          newErrors.relationshipStatus = "Please select a relationship status";
        }
        break;

      case 2:
        if (!formData.message.trim()) {
          newErrors.message = "Please write a message";
        } else if (formData.message.length > 2000) {
          newErrors.message = "Message cannot exceed 2000 characters";
        }
        break;

      case 4:
        if (formData.fullName && formData.fullName.length > 100) {
          newErrors.fullName = "Name cannot exceed 100 characters";
        }
        if (formData.email && !validateEmail(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number";
        }
        break;
    }

    return newErrors;
  };

  // Update form data with type safety
  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  // Handle photo upload

  // Navigation
  const nextStep = (): void => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      handleSubmit();
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Check if user can proceed
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return (
          formData.title.trim() !== "" &&
          formData.title.length <= 50 &&
          formData.lovedOneName.trim() !== "" &&
          formData.lovedOneName.length <= 150
        );
      case 1:
        return formData.relationshipStatus !== "";
      case 2:
        return (
          formData.message.trim() !== "" && formData.message.length <= 2000
        );
      case 3:
        // User must either choose "no photos" or have made a choice to add photos
        return wantsPhotos !== null;
      case 4:
        return true; // All fields on this step are optional
      case 5:
        return true; // Preview step
      default:
        return false;
    }
  };

  // Handle form submission
  const handleSubmit = (): void => {
    // Here you would typically send the data to your backend
    alert("Condolence form submitted successfully!");
  };

  // Detect music service from URL
  const detectMusicService = (url: string): MusicService | null => {
    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("music.youtube.com")
    ) {
      return "YouTube";
    } else if (url.includes("spotify.com")) {
      return "Spotify";
    } else if (url.includes("music.apple.com")) {
      return "Apple Music";
    } else if (url.includes("deezer.com")) {
      return "Deezer";
    } else if (url.includes("music.amazon.com")) {
      return "Amazon Music";
    }
    return null;
  };

  // Get character count color
  const getCharCountColor = (current: number, max: number): string => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-rose-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
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
                  value={formData.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("title", e.target.value)
                  }
                  className={`w-full bg-gray-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                    errors.title
                      ? "border-red-500"
                      : "border-rose-100 dark:border-rose-900/30"
                  }`}
                  placeholder="e.g. A Love Letter, For You, etc."
                  maxLength={50}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.title && (
                    <span className="text-xs text-red-400">{errors.title}</span>
                  )}
                  <span
                    className={`text-xs ml-auto ${getCharCountColor(formData.title.length, 50)}`}
                  >
                    {formData.title.length}/50
                  </span>
                </div>
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
                  value={formData.lovedOneName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("lovedOneName", e.target.value)
                  }
                  className={`w-full bg-gray-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                    errors.lovedOneName
                      ? "border-red-500"
                      : "border-rose-100 dark:border-rose-900/30"
                  }`}
                  placeholder="Enter name"
                  maxLength={150}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.lovedOneName && (
                    <span className="text-xs text-red-400">
                      {errors.lovedOneName}
                    </span>
                  )}
                  <span
                    className={`text-xs ml-auto ${getCharCountColor(formData.lovedOneName.length, 150)}`}
                  >
                    {formData.lovedOneName.length}/150
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <button
                  onClick={() =>
                    updateFormData("showOptional", !formData.showOptional)
                  }
                  className="flex items-center gap-2 text-pink-400 text-sm font-medium hover:text-pink-300 transition"
                >
                  <Sparkles size={16} />
                  Optional Fields
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform ${formData.showOptional ? "rotate-90" : ""}`}
                  />
                </button>

                {formData.showOptional && (
                  <div className="mt-4 space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pet Name
                      </label>
                      <input
                        type="text"
                        value={formData.petName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateFormData("petName", e.target.value)
                        }
                        placeholder="What do you call your love?"
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        maxLength={50}
                      />
                      <div
                        className={`text-right text-xs mt-1 ${getCharCountColor(formData.petName.length, 50)}`}
                      >
                        {formData.petName.length}/50
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
                        value={formData.yourName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateFormData("yourName", e.target.value)
                        }
                        placeholder="Your name or leave blank for anonymous"
                        className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        maxLength={50}
                      />
                      <div
                        className={`text-right text-xs mt-1 ${getCharCountColor(formData.yourName.length, 50)}`}
                      >
                        {formData.yourName.length}/50
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 text-rose-500 text-sm bg-rose-500/10 px-4 py-2 rounded-full hover:bg-rose-500/20 transition">
                <Sparkles size={16} />
                Need inspiration?
              </button>
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
                  {relationshipOptions.map((option: RelationshipOption) => (
                    <button
                      key={option.label}
                      onClick={() =>
                        updateFormData("relationshipStatus", option.label)
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
                {errors.relationshipStatus && (
                  <p className="text-xs text-red-400 mt-2">
                    {errors.relationshipStatus}
                  </p>
                )}
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
                                // Also remove the photo for this page
                                const newPhotos = { ...formData.pagePhotos };
                                delete newPhotos[index];
                                // Reindex photos for remaining pages
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
                                updateFormData(
                                  "message",
                                  newPages.join(delimiter),
                                );
                                updateFormData("pagePhotos", reindexedPhotos);
                              }}
                              className="text-xs text-red-400 hover:text-red-500 hover:underline flex items-center gap-1"
                            >
                              <span>🗑️</span> Remove Page
                            </button>
                          )}
                        </div>

                        {/* Main Content Area - Side by Side Layout */}
                        <div className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 rounded-2xl border border-rose-100/50 dark:border-rose-900/20">
                          <div className="flex gap-6">
                            {/* Left Side: Photo Upload */}
                            <div className="shrink-0 w-64 flex flex-col">
                              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Upload Image
                              </label>
                              <label className="block cursor-pointer flex-1">
                                <div
                                  className={`h-full min-h-70 rounded-xl border-2 border-dashed transition-all relative overflow-hidden ${
                                    formData.pagePhotos[index]?.file
                                      ? "border-transparent"
                                      : "border-rose-200 dark:border-rose-800 hover:border-rose-400"
                                  }`}
                                >
                                  {formData.pagePhotos[index]?.file ? (
                                    <div className="relative w-full h-full group/image">
                                      <Image
                                        src={
                                          formData.pagePhotos[index]?.url || ""
                                        }
                                        alt={`Page ${index + 1} photo`}
                                        fill
                                        className="object-cover"
                                        sizes="256px"
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
                                          updateFormData(
                                            "pagePhotos",
                                            newPhotos,
                                          );
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
                                      updateFormData("pagePhotos", newPhotos);
                                    }
                                  }}
                                />
                              </label>

                              {/* Photo Position Buttons - Below Image */}
                              {formData.pagePhotos[index]?.file && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    Photo Position:
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
                                        updateFormData("pagePhotos", newPhotos);
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
                                        updateFormData("pagePhotos", newPhotos);
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
                                  updateFormData(
                                    "message",
                                    newPages.join(delimiter),
                                  );
                                }}
                                placeholder={`Write your heartfelt message for page ${index + 1}...`}
                                className={`flex-1 bg-white dark:bg-zinc-800 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all min-h-[280px] ${
                                  errors.message && index === 0
                                    ? "border-red-500"
                                    : "border-rose-100 dark:border-rose-900/30"
                                }`}
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
                      updateFormData("message", current + delimiter + "");
                    }}
                    className="w-full py-4 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-2xl text-rose-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <span className="text-xl">+</span>
                    <span>Add Another Page</span>
                  </button>
                </div>
              </div>

              {/* Message Suggestions */}
              {formData.relationshipStatus &&
                messageSuggestions[formData.relationshipStatus] && (
                  <div className="border-t border-rose-100 dark:border-rose-900/20 pt-6 mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-rose-500 dark:text-pink-400 font-semibold flex items-center gap-2">
                        <span>💡</span> Message Suggestions
                      </h3>
                      <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                        See all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {messageSuggestions[formData.relationshipStatus].map(
                        (suggestion: MessageSuggestion, idx: number) => (
                          <button
                            key={idx}
                            onClick={() =>
                              updateFormData("message", suggestion.text)
                            }
                            className="text-left p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-rose-950/20 rounded-xl hover:shadow-md transition-all border border-rose-100 dark:border-rose-900/30 group"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">💕</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm mb-1 text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                                  {suggestion.title}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {suggestion.text}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    suggestion.text,
                                  );
                                }}
                                className="flex-shrink-0 text-gray-400 hover:text-rose-500 transition p-1"
                                title="Copy to clipboard"
                              >
                                📋
                              </button>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
        {/* Fullscreen Message Dialog */}
        {isFullscreenMessage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Write Your Message
                </h2>
                <button
                  onClick={() => setIsFullscreenMessage(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                >
                  <X size={24} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Textarea */}
              <div className="flex-1 p-6 overflow-hidden">
                <textarea
                  value={formData.message}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    updateFormData("message", e.target.value)
                  }
                  placeholder="Write your special message here..."
                  className="w-full h-full bg-gray-50 dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/30 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-base"
                  maxLength={2000}
                  autoFocus
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span
                  className={`text-sm ${getCharCountColor(formData.message.length, 2000)}`}
                >
                  {formData.message.length}/2000 characters
                </span>
                <button
                  onClick={() => setIsFullscreenMessage(false)}
                  className="px-6 py-2.5 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full transition-all shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Categories (Special Memories / Special Qualities) */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            {wantsPhotos === null ? (
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
                    onClick={() => setWantsPhotos(true)}
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
                      <button
                        onClick={() => {
                          const newCategories = [...formData.categories];
                          newCategories[catIndex].items.push({
                            file: null,
                            url: "",
                            title: "",
                            date: "",
                          });
                          updateFormData("categories", newCategories);
                        }}
                        className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                      >
                        + Add to {category.name}
                      </button>
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
                              updateFormData("categories", newCategories);
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
                          >
                            <X size={18} />
                          </button>

                          <div className="space-y-4">
                            <label className="block">
                              <div
                                className={`aspect-square rounded-xl border-2 border-dashed border-rose-200 dark:border-rose-800 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 transition-colors relative overflow-hidden ${item.url ? "border-none" : ""}`}
                              >
                                {item.url ? (
                                  <>
                                    <img
                                      src={item.url}
                                      alt="Detail"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Upload
                                        className="text-white"
                                        size={24}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Upload
                                      className="text-rose-300 mb-2"
                                      size={24}
                                    />
                                    <span className="text-xs text-gray-400">
                                      Upload Photo
                                    </span>
                                  </>
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
                                    newCategories[catIndex].items[itemIndex] = {
                                      ...newCategories[catIndex].items[
                                        itemIndex
                                      ],
                                      file,
                                      url,
                                    };
                                    updateFormData("categories", newCategories);
                                  }
                                }}
                              />
                            </label>

                            <input
                              type="text"
                              placeholder="Title"
                              value={item.title}
                              onChange={(e) => {
                                const newCategories = [...formData.categories];
                                newCategories[catIndex].items[itemIndex].title =
                                  e.target.value;
                                updateFormData("categories", newCategories);
                              }}
                              className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />

                            <input
                              type="text"
                              placeholder={
                                category.id === "memories"
                                  ? "Date (e.g. Summer 2023)"
                                  : "Description"
                              }
                              value={item.date}
                              onChange={(e) => {
                                const newCategories = [...formData.categories];
                                newCategories[catIndex].items[itemIndex].date =
                                  e.target.value;
                                updateFormData("categories", newCategories);
                              }}
                              className="w-full bg-white dark:bg-zinc-800 border border-rose-100 dark:border-rose-900/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
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

                <div className="flex justify-end pt-4 border-t border-rose-100 dark:border-rose-900/20">
                  <button
                    onClick={() => {
                      setCurrentStep(4);
                      setWantsPhotos(null);
                    }}
                    className="px-8 py-3 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-rose-300 dark:hover:shadow-rose-900/30 transition-all font-serif"
                  >
                    Save & Preview Design
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Step 4: Personalization (was Step 5) */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="text-rose-500" size={20} />
                  Theme
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {themes.map((theme: Theme) => (
                    <button
                      key={theme}
                      onClick={() => updateFormData("theme", theme)}
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
                      onClick={() => updateFormData("envelopeStyle", option.id)}
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
                  value={formData.musicUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("musicUrl", e.target.value)
                  }
                  placeholder="Paste a URL from YouTube, Spotify, Apple Music..."
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateFormData("showOptional", !formData.showOptional)
                  }
                  className="mt-4 text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                >
                  {formData.showOptional
                    ? "Hide music tips"
                    : "See how to get links"}
                  <ChevronRight
                    size={14}
                    className={formData.showOptional ? "rotate-90" : ""}
                  />
                </button>

                {formData.showOptional && (
                  <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">ℹ️</span>
                      <div>
                        <div className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Paste a music URL and we will detect it automatically.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-blue-800/70 dark:text-blue-300/70">
                          <div>
                            <strong>YouTube:</strong> youtube.com, youtu.be
                          </div>
                          <div>
                            <strong>Spotify:</strong> open.spotify.com
                          </div>
                          <div>
                            <strong>Apple Music:</strong> music.apple.com
                          </div>
                          <div>
                            <strong>Deezer:</strong> deezer.com
                          </div>
                          <div className="md:col-span-2">
                            <strong>Amazon Music:</strong> music.amazon.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Step 5: Final Preview */}
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
                {formData.animationVariant === "Classic" && (
                  <AnimatedEnvelope1
                    title={formData.title}
                    recipient={formData.lovedOneName}
                    sender={formData.yourName || "Someone special"}
                    message={formData.message}
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    pagePhotos={formData.pagePhotos}
                    categories={formData.categories}
                    music={formData.musicUrl}
                    {...(formData.envelopeStyle === "Romantic"
                      ? {
                          envelopeColor: "#FFB6C1",
                          pocketColor: "#FFB6C1",
                          flapColor: "#FFC0CB",
                          flapBackColor: "#DB7093",
                          cardColor: "#FFF0F5",
                          titleColor: "#9D174D",
                          textColor: "#BE185D",
                        }
                      : formData.envelopeStyle === "Vintage"
                        ? {
                            envelopeColor: "#D4A574",
                            pocketColor: "#D4A574",
                            flapColor: "#DEB887",
                            flapBackColor: "#C49A6C",
                            cardColor: "#FEFCF3",
                            titleColor: "#5D4037",
                            textColor: "#8D6E63",
                          }
                        : formData.envelopeStyle === "Midnight"
                          ? {
                              envelopeColor: "#18181b",
                              pocketColor: "#18181b",
                              flapColor: "#27272a",
                              flapBackColor: "#09090b",
                              cardColor: "#FDFBF7",
                              textColor: "#57534e",
                              titleColor: "#1c1917",
                            }
                          : {
                              envelopeColor: "rgba(255, 255, 255, 0.1)",
                              pocketColor: "rgba(255, 255, 255, 0.1)",
                              flapColor: "rgba(255, 255, 255, 0.2)",
                              flapBackColor: "rgba(255, 255, 255, 0.05)",
                              cardColor: "rgba(255, 255, 255, 0.9)",
                              titleColor: "#333",
                              textColor: "#666",
                            })}
                  />
                )}
                {formData.animationVariant === "Elegant" && (
                  <AnimatedEnvelope2
                    title={formData.title}
                    recipient={formData.lovedOneName}
                    sender={formData.yourName || "Someone special"}
                    message={formData.message}
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    pagePhotos={formData.pagePhotos}
                    categories={formData.categories}
                    music={formData.musicUrl}
                    {...(formData.envelopeStyle === "Romantic"
                      ? {
                          envelopeColor: "#FFB6C1",
                          pocketColor: "#FFB6C1",
                          flapColor: "#FFC0CB",
                          flapBackColor: "#DB7093",
                          cardColor: "#FFF0F5",
                          titleColor: "#9D174D",
                          textColor: "#BE185D",
                        }
                      : formData.envelopeStyle === "Vintage"
                        ? {
                            envelopeColor: "#f5e6d0",
                            pocketColor: "#ede0cc",
                            flapColor: "#e8d5bc",
                            flapBackColor: "#f5e6d0",
                            cardColor: "#fffcf5",
                            titleColor: "#1e293b",
                            textColor: "#475569",
                          }
                        : formData.envelopeStyle === "Midnight"
                          ? {
                              envelopeColor: "#1a1a1a",
                              pocketColor: "#111111",
                              flapColor: "#2a2a2a",
                              flapBackColor: "#1a1a1a",
                              cardColor: "#FDFBF7",
                              textColor: "#57534e",
                              titleColor: "#1c1917",
                            }
                          : {
                              envelopeColor: "rgba(255, 255, 255, 0.1)",
                              pocketColor: "rgba(255, 255, 255, 0.1)",
                              flapColor: "rgba(255, 255, 255, 0.2)",
                              flapBackColor: "rgba(255, 255, 255, 0.05)",
                              cardColor: "rgba(255, 255, 255, 0.9)",
                              titleColor: "#333",
                              textColor: "#666",
                            })}
                  />
                )}
                {formData.animationVariant === "Dramatic" && (
                  <AnimatedEnvelope3
                    title={formData.title}
                    recipient={formData.lovedOneName}
                    sender={formData.yourName || "Someone special"}
                    message={formData.message}
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    pagePhotos={formData.pagePhotos}
                    categories={formData.categories}
                    music={formData.musicUrl}
                    {...(formData.envelopeStyle === "Romantic"
                      ? {
                          envelopeColor: "#FFB6C1",
                          pocketColor: "#FFB6C1",
                          flapColor: "#FFC0CB",
                          flapBackColor: "#DB7093",
                          cardColor: "#FFF0F5",
                          titleColor: "#9D174D",
                          textColor: "#BE185D",
                        }
                      : formData.envelopeStyle === "Vintage"
                        ? {
                            envelopeColor: "#f5e6d0",
                            pocketColor: "#ede0cc",
                            flapColor: "#e8d5bc",
                            flapBackColor: "#f5e6d0",
                            cardColor: "#fffcf5",
                            titleColor: "#1e293b",
                            textColor: "#475569",
                          }
                        : formData.envelopeStyle === "Midnight"
                          ? {
                              envelopeColor: "#1a1a1a",
                              pocketColor: "#111111",
                              flapColor: "#2a2a2a",
                              flapBackColor: "#1a1a1a",
                              cardColor: "#FDFBF7",
                              textColor: "#57534e",
                              titleColor: "#1c1917",
                            }
                          : {
                              envelopeColor: "rgba(255, 255, 255, 0.1)",
                              pocketColor: "rgba(255, 255, 255, 0.1)",
                              flapColor: "rgba(255, 255, 255, 0.2)",
                              flapBackColor: "rgba(255, 255, 255, 0.05)",
                              cardColor: "rgba(255, 255, 255, 0.9)",
                              titleColor: "#333",
                              textColor: "#666",
                            })}
                  />
                )}
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
              {/* Animation Variant Selector */}
              <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-4 border border-rose-100 dark:border-rose-900/20 shadow-lg">
                <h3 className="text-xs font-semibold mb-3 text-center text-zinc-500 uppercase tracking-widest">
                  Animation Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Classic", "Elegant", "Dramatic"].map((variant) => (
                    <button
                      key={variant}
                      onClick={() =>
                        updateFormData(
                          "animationVariant",
                          variant as AnimationVariant,
                        )
                      }
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        formData.animationVariant === variant
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20"
                          : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span className="text-sm font-medium">{variant}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Envelope Theme Selector */}
              <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-4 border border-rose-100 dark:border-rose-900/20 shadow-lg">
                <h3 className="text-xs font-semibold mb-3 text-center text-zinc-500 uppercase tracking-widest">
                  Envelope Theme
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {envelopeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateFormData("envelopeStyle", opt.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        formData.envelopeStyle === opt.id
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20"
                          : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span className="text-lg">{opt.preview}</span>
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {opt.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
              currentStep === 0
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-rose-100 dark:border-rose-900/30"
            }`}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all ${
              canProceed()
                ? "bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/20"
                : "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === totalSteps - 1 ? "Complete" : "Next"}
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Back to homepage link */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(0)}
            className="mt-4 text-sm text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <ChevronLeft size={16} />
            Back to the homepage
          </button>
        )}
      </div>
    </div>
  );
}
