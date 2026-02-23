/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  X,
  Heart,
  Check,
  Copy,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";
import Image from "next/image";

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

  const [formData, setFormData] = useState<FormData>({
    title: "",
    lovedOneName: "",
    petName: "",
    yourName: "",
    relationshipStatus: "",
    message: "",
    pagePhotos: {},
    categories: [],
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
    { id: "Romantic", name: "Soft Heart", preview: "💌" },
    { id: "Vintage", name: "Classic Wax", preview: "📜" },
    { id: "Midnight", name: "Neon Night", preview: "✨" },
    { id: "Modern", name: "Glassmorphism", preview: "💎" },
  ];

  const themes = ["Life", "Fall", "Christmas", "Birthday"];

  useEffect(() => {
    fetchConfession();
  }, [confessionId]);

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
      }
    } catch (error) {
      console.error("Error fetching confession:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (
    pageIndex: number,
    files: FileList,
    position: "left" | "right",
  ) => {
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        pagePhotos: {
          ...prev.pagePhotos,
          [pageIndex]: {
            file,
            position,
            url,
          },
        },
      }));
    }
  };

  const removePhoto = (pageIndex: number) => {
    setFormData((prev) => {
      const newPagePhotos = { ...prev.pagePhotos };
      delete newPagePhotos[pageIndex];
      return {
        ...prev,
        pagePhotos: newPagePhotos,
      };
    });
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
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
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
      formDataToSend.append("lovedOneName", formData.lovedOneName);
      formDataToSend.append("petName", formData.petName);
      formDataToSend.append("yourName", formData.yourName);
      formDataToSend.append("relationshipStatus", formData.relationshipStatus);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("theme", formData.theme);
      formDataToSend.append("envelopeStyle", formData.envelopeStyle);
      formDataToSend.append("musicUrl", formData.musicUrl);

      const response = await fetch(`/api/confessions/${confessionId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
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
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back to Confessions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Confession
                </h2>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-rose-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Form Steps */}
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-8 mb-8">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Front Page Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., A Love Letter, For You, etc."
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.title.length}/50
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loved One's Name *
                    </label>
                    <input
                      type="text"
                      name="lovedOneName"
                      value={formData.lovedOneName}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      maxLength={150}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.lovedOneName.length}/150
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Relationship Status *
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                        className={`p-4 rounded-xl border-2 transition font-medium text-center ${
                          formData.relationshipStatus === option.label
                            ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-rose-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="yourName"
                      value={formData.yourName}
                      onChange={handleInputChange}
                      placeholder="Enter your name (optional)"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pet Name / Nickname
                    </label>
                    <input
                      type="text"
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      placeholder="Special nickname for them (optional)"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your Message *
                  </h3>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your heartfelt confession here... You can use <<<PAGE_BREAK>>> to create page breaks"
                      rows={12}
                      maxLength={5000}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition resize-none"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.message.length}/5000
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      💡 Tip: Use {"<<<PAGE_BREAK>>>"} to create page breaks in
                      your message
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Theme & Style
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Theme
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme}
                          onClick={() =>
                            handleInputChange({
                              target: { name: "theme", value: theme },
                            } as any)
                          }
                          className={`p-4 rounded-xl border-2 transition font-medium text-center ${
                            formData.theme === theme
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-rose-300"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Envelope Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {envelopeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleInputChange({
                              target: {
                                name: "envelopeStyle",
                                value: option.id,
                              },
                            } as any)
                          }
                          className={`p-4 rounded-xl border-2 transition font-medium text-center ${
                            formData.envelopeStyle === option.id
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-rose-300"
                          }`}
                        >
                          <div className="text-3xl mb-2">{option.preview}</div>
                          <div className="text-sm">{option.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Music URL (optional)
                    </label>
                    <input
                      type="url"
                      name="musicUrl"
                      value={formData.musicUrl}
                      onChange={handleInputChange}
                      placeholder="https://music.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Supports YouTube, Spotify, Apple Music, etc.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Add Photos (Optional)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can add photos to accompany your message on different
                    pages.
                  </p>
                  <div className="bg-gray-50 dark:bg-zinc-700/50 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Photo upload functionality can be added here
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Review Your Confession
                  </h3>
                  <div className="bg-gray-50 dark:bg-zinc-700/50 p-6 rounded-lg space-y-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Title
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formData.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        For
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formData.lovedOneName}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Theme
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {formData.theme}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Style
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {formData.envelopeStyle}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Relationship
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {formData.relationshipStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                    className="w-full bg-rose-100 dark:bg-rose-900/20 hover:bg-rose-200 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-medium py-3 rounded-lg transition"
                  >
                    {isPreviewOpen ? "Hide" : "Show"} Preview
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white transition"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button
                onClick={nextStep}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-linear-to-r from-rose-500 to-pink-500 hover:shadow-lg text-white transition disabled:opacity-50"
              >
                {currentStep === totalSteps - 1 ? (
                  saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check size={20} /> Save Changes
                    </>
                  )
                ) : (
                  <>
                    Next <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-6 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              <div className="flex justify-center items-center bg-linear-to-br from-rose-50 to-pink-50 dark:from-zinc-700 dark:to-zinc-800 rounded-2xl p-4 min-h-96">
                <div className="scale-75 origin-top">
                  {getEnvelopeComponent()}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Click the envelope to preview the full design
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditConfessionPage;
