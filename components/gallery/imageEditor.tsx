"use client";

import { useState, useRef } from "react";
import {
  X,
  RotateCw,
  RotateCcw,
  Crop as CropIcon,
  Check,
  Download,
  Loader2,
} from "lucide-react";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import getCroppedImg from "@/lib/crop-utils";

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
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
      const blob = previewBlob || (await applyEdits());

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
      const blob = previewBlob || (await applyEdits());

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
    if (completedCrop && imgRef.current) {
      return getCroppedImg(imageUrl, completedCrop, rotation);
    }

    // fallback logic to just rotate if no crop was made
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

        const radians = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));

        const newWidth = img.width * cos + img.height * sin;
        const newHeight = img.width * sin + img.height * cos;

        canvas.width = newWidth;
        canvas.height = newHeight;

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

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewBlob(null);
  };

  const handleCropAction = async () => {
    if (isCropping) {
      const blob = await applyEdits();
      if (blob) {
        const url = URL.createObjectURL(blob);
        clearPreview();
        setPreviewBlob(blob);
        setPreviewUrl(url);
        setIsCropping(false);
      }
      return;
    }

    if (previewUrl) {
      clearPreview();
      setIsCropping(true);
      return;
    }

    setIsCropping(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="z-10 bg-zinc-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-semibold text-lg">Edit Photo</h3>
            {isCropping && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-white/70 text-xs">
                <span className="animate-pulse w-2 h-2 bg-rose-500 rounded-full" />
                Cropping Mode
              </div>
            )}
            {previewUrl && !isCropping && (
              <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-200 text-xs">
                Preview
              </div>
            )}
          </div>
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
              <span className="text-sm hidden sm:inline">Download</span>
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

      {/* Main Area */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center p-4">
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          {isCropping ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-full"
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Edit preview"
                className="max-h-[70vh] object-contain"
                crossOrigin="anonymous"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </ReactCrop>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Edited preview"
              className="max-h-[70vh] object-contain shadow-2xl"
            />
          ) : (
            <div
              className="relative transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Edit preview"
                className="max-h-[70vh] object-contain shadow-2xl"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="z-10 bg-zinc-900/50 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6 shrink-0">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <button
              onClick={rotateLeft}
              className="flex flex-col items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Rotate Left"
            >
              <RotateCcw className="w-6 h-6" />
              <span className="text-[10px] sm:text-xs">Rotate Left</span>
            </button>

            <button
              onClick={handleCropAction}
              className={`flex flex-col items-center gap-2 px-8 sm:px-12 py-3 rounded-xl transition-all duration-300 border-2 ${
                isCropping
                  ? "bg-rose-500 border-rose-400 text-white scale-110 shadow-lg shadow-rose-500/20"
                  : previewUrl
                    ? "bg-emerald-500/30 border-emerald-400 text-emerald-100"
                    : "bg-white/10 border-transparent hover:bg-white/20 text-white"
              }`}
              title="Crop"
            >
              <CropIcon className="w-6 h-6" />
              <span className="text-[10px] sm:text-xs font-medium">
                {isCropping ? "Done Cropping" : previewUrl ? "Revert" : "Crop"}
              </span>
            </button>

            <button
              onClick={rotateRight}
              className="flex flex-col items-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Rotate Right"
            >
              <RotateCw className="w-6 h-6" />
              <span className="text-[10px] sm:text-xs">Rotate Right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
