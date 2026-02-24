/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { Edit2, Trash2, Plus, Heart, Copy, Check, Loader2 } from "lucide-react";
import { AnimatedEnvelope as AnimatedEnvelope1 } from "@/components/AnimatedEnvelope/AnimatedEnvelope";
import { AnimatedEnvelope as AnimatedEnvelope2 } from "@/components/AnimatedEnvelope/AnimatedEnvelope2";
import { AnimatedEnvelope as AnimatedEnvelope3 } from "@/components/AnimatedEnvelope/AnimatedEnvelope3";

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
  photos: any[];
  categories: any[];
  link_token: string;
  is_opened: boolean;
  created_at: string;
}

const ConfessionsPage = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    try {
      const response = await fetch("/api/confessions/list");
      const data = await response.json();
      setConfessions(data.confessions || []);
    } catch (error) {
      console.error("Error fetching confessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (confessionId: string) => {
    setDeletingId(confessionId);
    try {
      const response = await fetch(`/api/confessions/${confessionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConfessions(confessions.filter((c) => c.id !== confessionId));
        setShowDeleteConfirm(null);
      } else {
        alert("Failed to delete confession");
      }
    } catch (error) {
      console.error("Error deleting confession:", error);
      alert("Error deleting confession");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/confession/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEnvelopeColors = (style: string) => {
    switch (style) {
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

  const getEnvelopeComponent = (confession: Confession) => {
    const pagePhotos = (confession.photos || []).reduce((acc, photo) => {
      acc[photo.pageIndex] = {
        file: null,
        position: photo.position as "left" | "right",
        url: photo.url,
      };
      return acc;
    }, {});

    const categories = (confession.categories || []).map((category) => ({
      id: category.id,
      name: category.name,
      items: (category.items || []).map(
        (item: { url: any; title: any; date: any }) => ({
          file: null,
          url: item.url,
          title: item.title,
          date: item.date,
        }),
      ),
    }));

    const commonProps = {
      title: confession.title,
      recipient: confession.loved_one_name,
      sender: confession.sender_name || "Someone Special",
      message: confession.message,
      isOpen: false,
      onOpenChange: () => {},
      pagePhotos: pagePhotos || {},
      categories: categories || [],
      music: confession.music_url || "",
      ...getEnvelopeColors(confession.envelope_style),
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

  return (
    <NavigationSidebar>
      <div className="min-h-screen bg-linear-to-br from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-rose-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-rose-500" size={32} />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  My Confessions
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage all your love confessions
              </p>
            </div>
            <Link
              href="/confessions/new"
              className="flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus size={18} />
              New Confession
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Loading confessions...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && confessions.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] bg-white dark:bg-zinc-800/50 rounded-3xl border border-rose-100 dark:border-rose-900/20 py-12 px-4">
              <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No confessions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first confession to express your love!
              </p>
              <Link
                href="/confessions/new"
                className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                Create Confession
              </Link>
            </div>
          )}

          {/* Confessions Grid */}
          {!loading && confessions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {confessions.map((confession) => (
                <div
                  key={confession.id}
                  className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  {/* Envelope Preview - Compact */}
                  <div className="bg-linear-to-br from-rose-50 to-pink-50 dark:from-zinc-700 dark:to-zinc-800 p-4 flex justify-center items-center h-56 overflow-hidden">
                    <div className="scale-50 origin-center">
                      {getEnvelopeComponent(confession)}
                    </div>
                  </div>

                  {/* Confession Info */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {confession.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        For: {confession.loved_one_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(confession.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          confession.is_opened
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {confession.is_opened ? "Opened" : "Not opened"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(confession.link_token)}
                        className="w-full flex items-center justify-center gap-1 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg transition-all text-xs font-medium"
                      >
                        {copiedId === confession.link_token ? (
                          <>
                            <Check size={14} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy
                          </>
                        )}
                      </button>

                      {/* Edit & Delete Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/confessions/${confession.id}/edit`}
                          className="flex-1 flex items-center justify-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg transition-all text-xs font-medium"
                        >
                          <Edit2 size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(confession.id)}
                          disabled={deletingId === confession.id}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-all text-xs font-medium"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Delete Confession
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this confession? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingId !== null}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NavigationSidebar>
  );
};

export default ConfessionsPage;
