// Upload limits configuration based on guest count and user role

export interface UploadLimits {
  creator: number;
  guest: number;
}

export const UPLOAD_LIMITS_MAP: Record<string, UploadLimits> = {
  "10": { creator: 20, guest: 5 },
  "100": { creator: 30, guest: 10 },
  "250": { creator: 50, guest: 15 },
  "500": { creator: 50, guest: 20 },
  "800": { creator: 80, guest: 25 },
  "1000+": { creator: 80, guest: 25 },
  CUSTOM: { creator: 80, guest: 25 }, // Default for custom, can be overridden
};

export const getUploadLimits = (
  guestLimit: string,
  customPhotoCapLimit?: number,
  isCreator: boolean = false
): number => {
  const limits = UPLOAD_LIMITS_MAP[guestLimit];

  if (!limits) {
    // Fallback to default limits
    return isCreator ? 20 : 5;
  }

  // For custom plans, use customPhotoCapLimit if provided
  if (guestLimit === "CUSTOM" && customPhotoCapLimit) {
    return isCreator ? Math.max(customPhotoCapLimit, 80) : customPhotoCapLimit;
  }

  return isCreator ? limits.creator : limits.guest;
};

export const getUploadLimitsDisplay = (
  guestLimit: string
): { creator: number; guest: number } => {
  return UPLOAD_LIMITS_MAP[guestLimit] || { creator: 20, guest: 5 };
};

// Helper to determine if user is the event creator
export const isEventCreator = (
  eventCreatorId: string,
  currentUserId?: string
): boolean => {
  return !!currentUserId && eventCreatorId === currentUserId;
};
