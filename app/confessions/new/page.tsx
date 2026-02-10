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

// Type Definitions
interface FormData {
  lovedOneName: string;
  petName: string;
  yourName: string;
  relationshipStatus: RelationshipStatus;
  message: string;
  photos: File[];
  theme: Theme;
  envelopeStyle: EnvelopeStyle;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<FormData>({
    lovedOneName: "",
    petName: "",
    yourName: "",
    relationshipStatus: "",
    message: "",
    photos: [],
    theme: "Life",
    envelopeStyle: "Romantic",
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
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isImage && isValidSize;
    });

    if (formData.photos.length + validFiles.length <= 10) {
      updateFormData("photos", [...formData.photos, ...validFiles]);
    } else {
      alert("You can only upload up to 10 photos");
    }
  };

  // Remove photo
  const removePhoto = (index: number): void => {
    updateFormData(
      "photos",
      formData.photos.filter((_, i) => i !== index),
    );
  };

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
        return true; // Photos are optional
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
    console.log("Form submitted:", formData);
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
                  Loved One's Name <span className="text-pink-400">*</span>
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
                        Your Name
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
                <div className="relative">
                  <textarea
                    value={formData.message}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateFormData("message", e.target.value)
                    }
                    placeholder="Write your special message here..."
                    className={`w-full bg-gray-50 dark:bg-zinc-900 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[200px] resize-none transition-all ${
                      errors.message
                        ? "border-red-500"
                        : "border-rose-100 dark:border-rose-900/30"
                    }`}
                    maxLength={2000}
                  />
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-white text-xs">
                    Fullscreen
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <span className="text-xs text-red-400">
                      {errors.message}
                    </span>
                  )}
                  <span
                    className={`text-xs ml-auto ${getCharCountColor(formData.message.length, 2000)}`}
                  >
                    {formData.message.length}/2000
                  </span>
                </div>
              </div>

              {formData.relationshipStatus &&
                messageSuggestions[formData.relationshipStatus] && (
                  <div className="border-t border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-pink-400 font-medium flex items-center gap-2">
                        😊 Message Suggestions
                      </h3>
                      <button className="text-xs text-gray-400 hover:text-white">
                        See all
                      </button>
                    </div>
                    <div className="space-y-3">
                      {messageSuggestions[formData.relationshipStatus].map(
                        (suggestion: MessageSuggestion, idx: number) => (
                          <button
                            key={idx}
                            onClick={() =>
                              updateFormData("message", suggestion.text)
                            }
                            className="w-full text-left p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition border border-gray-600"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-pink-400">💕</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm mb-1">
                                  {suggestion.title}
                                </div>
                                <div className="text-sm text-gray-300">
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
                                className="text-gray-400 hover:text-white"
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

        {/* Step 3: Photos */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-rose-900/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Add Photos{" "}
                  <span className="text-gray-400 text-sm font-normal">
                    (optional)
                  </span>
                </h2>
                <span
                  className={`text-sm ${formData.photos.length === 10 ? "text-yellow-400" : "text-gray-400"}`}
                >
                  {formData.photos.length}/10 images
                </span>
              </div>

              {formData.photos.length < 10 && (
                <div className="border-2 border-dashed border-rose-100 dark:border-rose-900/30 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-12 text-center hover:border-rose-500 transition cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <div className="text-gray-300 mb-2">
                      Click or drag photos here
                    </div>
                    <div className="text-sm text-gray-500">
                      ({formData.photos.length} / 10 files) • Max 10MB per file
                    </div>
                  </label>
                </div>
              )}

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {formData.photos.map((photo: File, idx: number) => (
                    <div className="relative aspect-square bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                        title="Remove photo"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm text-[10px] text-white p-1.5 text-center opacity-0 group-hover:opacity-100 transition">
                        {photo.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <div className="font-semibold text-rose-900 dark:text-rose-100 mb-1">
                      Photos are optional
                    </div>
                    <div className="text-rose-700/80 dark:text-rose-300/80">
                      Your photos will make the tribute even more special, but
                      you can proceed with just a message.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Personalization */}
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

                {formData.musicUrl && detectMusicService(formData.musicUrl) && (
                  <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
                    ✓ Detected: {detectMusicService(formData.musicUrl)}
                  </div>
                )}

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {musicServices.map((service: MusicService) => (
                    <button
                      key={service}
                      className="shrink-0 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                </div>

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
                This is exactly what your loved one will see. Tap the seal to
                preview the animation.
              </p>
            </div>

            {/* Preview Stage */}
            <div className="relative aspect-16/10 w-full max-w-2xl mx-auto bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 flex items-center justify-center p-8">
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

              {!isPreviewOpen ? (
                /* Closed Envelope View */
                <div
                  className={`relative w-full max-w-md aspect-4/3 rounded-2xl border-2 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center p-6 shadow-2xl ${
                    formData.envelopeStyle === "Romantic"
                      ? "border-rose-500/30 bg-rose-950/20 shadow-rose-500/10"
                      : formData.envelopeStyle === "Vintage"
                        ? "border-amber-900/40 bg-orange-950/20 shadow-amber-900/10"
                        : formData.envelopeStyle === "Midnight"
                          ? "border-zinc-700 bg-zinc-900 shadow-black"
                          : "border-white/20 bg-white/10 backdrop-blur-md"
                  }`}
                  onClick={() => setIsPreviewOpen(true)}
                >
                  {/* To/From Section */}
                  <div className="absolute top-12 left-12 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                      To:
                    </span>
                    <p className="font-script text-2xl text-rose-300 ml-2 drop-shadow-sm">
                      {formData.lovedOneName || "My Love"}
                    </p>
                  </div>

                  <div className="absolute bottom-12 right-12 text-right space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                      From:
                    </span>
                    <p className="font-script text-xl text-rose-300 mr-2 drop-shadow-sm">
                      {formData.yourName || "Someone special"}
                    </p>
                  </div>

                  {/* Seal/Button */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                    <button
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-transform ${
                        formData.envelopeStyle === "Romantic"
                          ? "bg-rose-500 text-white"
                          : formData.envelopeStyle === "Vintage"
                            ? "bg-amber-700 text-amber-100"
                            : formData.envelopeStyle === "Midnight"
                              ? "bg-zinc-800 text-blue-400"
                              : "bg-white text-zinc-900"
                      }`}
                    >
                      {envelopeOptions.find(
                        (o) => o.id === formData.envelopeStyle,
                      )?.preview || "✉️"}
                    </button>
                    <div className="mt-4 text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest animate-bounce">
                        Tap to open
                      </p>
                    </div>
                  </div>

                  {/* Envelope Flap Lines */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
                    viewBox="0 0 400 300"
                  >
                    <path
                      d="M0 0 L200 150 L400 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 300 L200 150 L400 300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              ) : (
                /* Opened Message View */
                <div className="relative w-full max-w-md bg-transparent text-center space-y-8 animate-in slide-in-from-bottom-12 duration-700">
                  <div className="space-y-4">
                    <p className="font-script text-4xl text-rose-400 drop-shadow-md">
                      {formData.lovedOneName || "My Love"}
                    </p>
                    <p className="text-zinc-500 font-mono tracking-tighter opacity-80">
                      "123123123123"
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 text-rose-500/40">
                    <Heart size={20} fill="currentColor" />
                    <Heart size={20} fill="currentColor" />
                    <Heart size={20} fill="currentColor" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-zinc-500 italic">with love,</p>
                    <p className="font-script text-3xl text-rose-400">
                      {formData.yourName || "Someone special"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPreviewOpen(false);
                    }}
                    className="text-xs text-zinc-500 underline underline-offset-4 hover:text-white transition-colors"
                  >
                    Close preview
                  </button>
                </div>
              )}
            </div>

            {/* Style Toggles for Preview Page */}
            <div className="bg-white dark:bg-rose-950/10 backdrop-blur rounded-3xl p-6 border border-rose-100 dark:border-rose-900/20 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold mb-4 text-center text-zinc-500 uppercase tracking-widest">
                Quick Toggles
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {envelopeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateFormData("envelopeStyle", opt.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      formData.envelopeStyle === opt.id
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-500/20"
                        : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-xl">{opt.preview}</span>
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {opt.id}
                    </span>
                  </button>
                ))}
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
