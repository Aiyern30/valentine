"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  RotateCw,
  RotateCcw,
  Crop,
  Check,
  Download,
  Loader2,
} from "lucide-react";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave?: (editedBlob: Blob) => void;
}

export function ImageEditor({
  isOpen,
  onClose,
  imageUrl,
  onSave,
}: ImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (!isOpen) return null;

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      setIsSaving(true);
      const blob = await applyEdits();

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edited-photo-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      const blob = await applyEdits();

      if (blob) {
        onSave(blob);
        onClose();
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const applyEdits = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        // Calculate dimensions based on rotation
        const radians = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));

        const newWidth = img.width * cos + img.height * sin;
        const newHeight = img.width * sin + img.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Apply rotation
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9,
        );
      };

      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-zinc-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-white font-semibold text-lg">Edit Photo</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="text-sm">Download</span>
            </button>
            {onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span className="text-sm">Save</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      <div className="h-full flex items-center justify-center pt-20 pb-24">
        <div
          className="relative max-w-4xl max-h-full transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Image
            src={imageUrl}
            alt="Edit preview"
            width={800}
            height={600}
            className="object-contain max-h-[70vh]"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/50 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-center gap-4 p-6">
          <button
            onClick={rotateLeft}
            className="flex flex-col items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Rotate Left"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-xs">Rotate Left</span>
          </button>

          <button
            onClick={rotateRight}
            className="flex flex-col items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Rotate Right"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-xs">Rotate Right</span>
          </button>

          {/* Crop feature can be added here later */}
          {/* <button
            onClick={() => setIsCropping(!isCropping)}
            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
              isCropping
                ? "bg-rose-500 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Crop"
          >
            <Crop className="w-6 h-6" />
            <span className="text-xs">Crop</span>
          </button> */}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
