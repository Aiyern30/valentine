// Create this file at /lib/image-utils.ts

/**
 * Compresses an image file to reduce its size while preserving quality.
 * @param file - The original image file
 * @param maxSizeMB - Maximum size in MB (default: 10MB)
 * @param maxWidth - Maximum width of the compressed image (default: 3840)
 * @param maxHeight - Maximum height of the compressed image (default: 2160)
 * @param initialQuality - Starting JPEG quality 0-1 (default: 0.95)
 * @param minQuality - Minimum JPEG quality 0-1 (default: 0.7)
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  maxSizeMB = 10,
  maxWidth = 3840,
  maxHeight = 2160,
  initialQuality = 0.95,
  minQuality = 0.7,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        let currentWidth = width;
        let currentHeight = height;
        let currentQuality = initialQuality;

        const render = () => {
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          ctx.clearRect(0, 0, currentWidth, currentHeight);
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
        };

        const toBlobAsync = (quality: number) =>
          new Promise<Blob | null>((resolveBlob) => {
            canvas.toBlob(
              (blob) => resolveBlob(blob),
              "image/jpeg",
              quality,
            );
          });

        const compressLoop = async () => {
          render();
          let blob = await toBlobAsync(currentQuality);

          while (blob && blob.size > maxSizeBytes) {
            if (currentQuality > minQuality) {
              currentQuality = Math.max(minQuality, currentQuality - 0.05);
              blob = await toBlobAsync(currentQuality);
              continue;
            }

            if (currentWidth <= 640 || currentHeight <= 640) {
              break;
            }

            currentWidth = Math.floor(currentWidth * 0.9);
            currentHeight = Math.floor(currentHeight * 0.9);
            currentQuality = initialQuality;
            render();
            blob = await toBlobAsync(currentQuality);
          }

          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        };

        compressLoop().catch((error) => reject(error));
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formats file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validates image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size (10MB max before compression)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  return { valid: true };
}
