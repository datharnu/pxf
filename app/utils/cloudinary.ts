// S3 and file upload utilities

export const S3_CONFIG = {
  // S3 configuration will be handled by backend presigned URLs
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
  bucketName: process.env.AWS_S3_BUCKET_NAME || "picha-media",
};

// File size limits (in bytes) - Now using S3 with much higher limits
export const FILE_SIZE_LIMITS = {
  image: 100 * 1024 * 1024, // 100MB for images (S3 allows up to 5TB!)
  video: 500 * 1024 * 1024, // 500MB for videos
  total: 2 * 1024 * 1024 * 1024, // 2GB total per upload session
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

// S3 Upload Functions
export const uploadToS3 = async (
  file: File,
  eventId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; key: string }> => {
  // Validate file size before upload
  validateFileSize(file);

  try {
    // Step 1: Get presigned URL from backend
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://pxfbackend.onrender.com/api/v1";
    const presignedResponse = await fetch(
      `${apiUrl}/media/event/${eventId}/s3-presigned-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      }
    );

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      console.error("Presigned URL error:", {
        status: presignedResponse.status,
        statusText: presignedResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to get presigned URL: ${presignedResponse.status} ${errorText}`
      );
    }

    const responseData = await presignedResponse.json();
    console.log("Presigned URL response:", responseData);
    const { presignedUrl, key } = responseData;

    // Step 2: Upload file directly to S3
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("S3 upload error:", {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to upload to S3: ${uploadResponse.status} ${errorText}`
      );
    }

    if (onProgress) {
      onProgress(100);
    }

    // Return the S3 URL and key
    const s3Url = presignedUrl.split("?")[0]; // Remove query parameters to get clean URL
    return { url: s3Url, key };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload to S3");
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
  }[]
> => {
  const results: {
    url: string;
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[] = [];
  const { maxConcurrentUploads } = UPLOAD_SETTINGS;

  // Process files in batches for better performance
  for (let i = 0; i < files.length; i += maxConcurrentUploads) {
    const batch = files.slice(i, i + maxConcurrentUploads);

    // Upload batch concurrently
    const batchPromises = batch.map(async (file, batchIndex) => {
      const fileIndex = i + batchIndex;
      const result = await uploadToS3(file, eventId, (fileProgress) => {
        if (onProgress) {
          const overallProgress =
            ((fileIndex + fileProgress / 100) / files.length) * 100;
          onProgress(Math.round(overallProgress));
        }
      });

      return {
        url: result.url,
        key: result.key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    });

    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
};
