/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// S3 and file upload utilities
import { api } from "@/api/axios";

// Image compression utility for faster uploads
export const compressImage = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920px width for faster uploads)
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            console.log(
              `Image compressed: ${file.size} → ${
                compressedFile.size
              } bytes (${Math.round(
                (1 - compressedFile.size / file.size) * 100
              )}% reduction)`
            );
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file); // Fallback to original
    img.src = URL.createObjectURL(file);
  });
};

// Generate thumbnail for progressive loading
export const generateThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Create small thumbnail (150px max width for instant loading)
      const maxWidth = 150;
      const maxHeight = 150;
      let { width, height } = img;

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

      canvas.width = width;
      canvas.height = height;

      // Draw thumbnail with lower quality for smaller size
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to base64 data URL for instant loading
      const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.3); // Very low quality for speed
      console.log(
        `Thumbnail generated: ${file.name} (${thumbnailDataUrl.length} chars)`
      );
      resolve(thumbnailDataUrl);
    };

    img.onerror = () => resolve(""); // Return empty string on error
    img.src = URL.createObjectURL(file);
  });
};

export const S3_CONFIG = {
  // S3 configuration will be handled by backend presigned URLs
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
};

// File size limits (in bytes) - Now using S3 with much higher limits
export const FILE_SIZE_LIMITS = {
  image: 100 * 1024 * 1024, // 100MB for images (S3 allows up to 5TB!)
  video: 500 * 1024 * 1024, // 500MB for videos
  total: 2 * 1024 * 1024 * 1024, // 2GB total per upload session
};

// Upload performance settings - Optimized for speed
export const UPLOAD_SETTINGS = {
  maxConcurrentUploads: 6, // Increased from 3 to 6 for faster uploads
  retryAttempts: 3,
  timeoutMs: 60000, // Increased to 60 seconds for large files
  chunkSize: 5 * 1024 * 1024, // 5MB chunks for large file uploads
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

// S3 Upload Functions
export const uploadToS3 = async (
  file: File,
  eventId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; key: string; thumbnail?: string }> => {
  // Validate file size before upload
  validateFileSize(file);

  // Generate thumbnail for progressive loading (for images only)
  let thumbnail = "";
  if (file.type.startsWith("image/")) {
    console.log("Generating thumbnail for progressive loading...");
    thumbnail = await generateThumbnail(file);
  }

  // Compress images for faster uploads (only if > 5MB)
  let uploadFile = file;
  if (file.type.startsWith("image/") && file.size > 5 * 1024 * 1024) {
    console.log("Compressing large image for faster upload...");
    uploadFile = await compressImage(file, 0.85);
  }

  try {
    // Step 1: Get presigned URL from backend using axios
    console.log("Getting presigned URL for event:", eventId);
    console.log("Sending payload:", {
      fileName: uploadFile.name,
      mimeType: uploadFile.type,
      fileSize: uploadFile.size,
    });
    const presignedResponse = await api.post(
      `/media/event/${eventId}/s3-presigned-url`,
      {
        fileName: uploadFile.name,
        mimeType: uploadFile.type,
        fileSize: uploadFile.size,
      }
    );

    console.log("Presigned URL response:", presignedResponse.data);

    // Validate response structure - backend returns nested data
    if (!presignedResponse.data || !presignedResponse.data.data) {
      throw new Error("Invalid response from backend - no data");
    }

    const { uploadUrl, key } = presignedResponse.data.data;

    if (!uploadUrl) {
      console.error("Missing uploadUrl in response:", presignedResponse.data);
      throw new Error("Backend did not return a presigned URL");
    }

    if (!key) {
      console.error("Missing key in response:", presignedResponse.data);
      throw new Error("Backend did not return an S3 key");
    }

    console.log("Using upload URL:", uploadUrl);
    console.log("Using S3 key:", key);

    // Validate the upload URL format
    if (!uploadUrl.includes("amazonaws.com")) {
      console.error("Invalid S3 URL format:", uploadUrl);
      throw new Error("Invalid S3 upload URL format");
    }

    // Skip connectivity test as S3 may not allow HEAD requests from browsers

    // Step 2: Upload file directly to S3 with optimizations
    console.log("Attempting S3 upload to:", uploadUrl);
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    let uploadResponse;
    try {
      console.log("Starting optimized S3 upload...");

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        UPLOAD_SETTINGS.timeoutMs
      );

      uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: uploadFile, // Use compressed file if available
        signal: controller.signal,
        // Remove Content-Type header as it might conflict with presigned URL parameters
        // S3 presigned URLs often include content-type in the signature
      });

      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error("Fetch error during S3 upload:", fetchError);
      console.error("Error details:", {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
      });

      // Check if it's a CORS issue
      if (
        fetchError.message.includes("CORS") ||
        fetchError.message.includes("cors")
      ) {
        throw new Error(
          "CORS error: S3 bucket may not be configured for browser uploads. Please check your S3 bucket CORS policy."
        );
      }

      // For "Failed to fetch" errors, provide more specific guidance
      if (fetchError.message === "Failed to fetch") {
        throw new Error(
          "Network error: Unable to connect to S3. This could be due to:\n" +
            "1. CORS configuration missing on S3 bucket\n" +
            "2. Network connectivity issues\n" +
            "3. Browser blocking the request\n" +
            "4. Invalid presigned URL signature"
        );
      }

      throw new Error(`Failed to fetch S3 upload URL: ${fetchError.message}`);
    }

    console.log("S3 upload response status:", uploadResponse.status);
    console.log(
      "S3 upload response headers:",
      Object.fromEntries(uploadResponse.headers.entries())
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse
        .text()
        .catch(() => "No error text");
      console.error("S3 upload failed:", {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`
      );
    }

    if (onProgress) {
      onProgress(100);
    }

    // Return the S3 URL, key, and thumbnail
    const s3Url = uploadUrl.split("?")[0]; // Remove query parameters to get clean URL

    console.log("Final S3 URL:", s3Url);
    return { url: s3Url, key, thumbnail };
  } catch (error: any) {
    console.error("S3 upload error:", error);
    if (error.response) {
      // Axios error with response
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        message: error.message,
      });
      throw new Error(
        `Failed to upload to S3: ${error.response.status} - ${
          error.response.data?.message || error.message
        }`
      );
    } else {
      // Other error (network, etc.)
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }
};

export const uploadMultipleToS3 = async (
  files: File[],
  eventId: string,
  onProgress?: (progress: number) => void
): Promise<
  {
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    thumbnail?: string;
  }[]
> => {
  const results: {
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    thumbnail?: string;
  }[] = [];
  const { maxConcurrentUploads } = UPLOAD_SETTINGS;

  // Optimize: Upload all files in parallel with better progress tracking
  const totalFiles = files.length;
  let completedFiles = 0;

  console.log(
    `Starting parallel upload of ${totalFiles} files with ${maxConcurrentUploads} concurrent uploads`
  );

  // Create promises for all uploads
  const uploadPromises = files.map(async (file, index) => {
    try {
      const result = await uploadToS3(file, eventId, (fileProgress) => {
        // Individual file progress is less important for speed
        // We'll track completion instead
      });

      completedFiles++;
      if (onProgress) {
        const overallProgress = (completedFiles / totalFiles) * 100;
        onProgress(Math.round(overallProgress));
        console.log(
          `Upload progress: ${completedFiles}/${totalFiles} files (${Math.round(
            overallProgress
          )}%)`
        );
      }

      return {
        url: result.url,
        key: result.key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        thumbnail: result.thumbnail,
      };
    } catch (error) {
      console.error(`Failed to upload file ${file.name}:`, error);
      throw error;
    }
  });

  // Execute uploads with concurrency control
  for (let i = 0; i < uploadPromises.length; i += maxConcurrentUploads) {
    const batch = uploadPromises.slice(i, i + maxConcurrentUploads);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }

  return results;
};
