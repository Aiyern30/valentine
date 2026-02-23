/**
 * Compress an image file to reduce size before upload
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 1MB)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Start with quality 0.9 and reduce if needed
        let quality = 0.9;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // If still too large and quality can be reduced, try again
              if (blob.size > maxSizeBytes && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
                return;
              }

              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            quality,
          );
        };

        tryCompress();
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
 * Compress multiple images in parallel
 */
export async function compressImages(
  files: File[],
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920,
): Promise<File[]> {
  return Promise.all(
    files.map((file) => compressImage(file, maxSizeMB, maxWidthOrHeight)),
  );
}
