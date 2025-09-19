// Cloudinary configuration and upload utilities

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pov_events",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB for images (Cloudinary account limit)
  video: 10 * 1024 * 1024, // 10MB for videos (Cloudinary account limit)
  total: 1024 * 1024 * 1024, // 1GB total per upload session
};

// Upload performance settings
export const UPLOAD_SETTINGS = {
  maxConcurrentUploads: 3,
  retryAttempts: 3,
  timeoutMs: 30000, // 30 seconds timeout
};

// Validate file size
export const validateFileSize = (file: File): boolean => {
  const fileType = file.type.startsWith("image/") ? "image" : "video";
  const maxSize = FILE_SIZE_LIMITS[fileType];

  if (file.size > maxSize) {
    throw new Error(
      `${
        file.name
      } is too large. Maximum size for ${fileType}s is ${formatFileSize(
        maxSize
      )}`
    );
  }

  return true;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Validate file size before upload
  validateFileSize(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  // Add folder for organization
  formData.append("folder", "pov-events");

  // Add tags for better organization
  formData.append("tags", "pov-events");

  // Add quality settings for better compression
  if (file.type.startsWith("image/")) {
    formData.append("quality", "auto"); // Auto quality optimization
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Cloudinary upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (onProgress) {
      onProgress(100);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
};

export const uploadMultipleToCloudinary = async (
  files: File[],
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  const { maxConcurrentUploads } = UPLOAD_SETTINGS;

  // Process files in batches for better performance
  for (let i = 0; i < files.length; i += maxConcurrentUploads) {
    const batch = files.slice(i, i + maxConcurrentUploads);

    // Upload batch concurrently
    const batchPromises = batch.map(async (file, batchIndex) => {
      const fileIndex = i + batchIndex;
      return uploadToCloudinary(file, (fileProgress) => {
        if (onProgress) {
          const overallProgress =
            ((fileIndex + fileProgress / 100) / files.length) * 100;
          onProgress(Math.round(overallProgress));
        }
      });
    });

    // Wait for current batch to complete
    const batchUrls = await Promise.all(batchPromises);
    urls.push(...batchUrls);
  }

  return urls;
};
