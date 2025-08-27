// types.ts - Updated to match API schema

export interface FormData {
  title: string; // Changed from whatsTheOccasion
  description: string;
  eventFlyer: string; // Changed from cover to URL string
  guestLimit: string; // Changed from howManyGuests, now enum values
  photoCapLimit: string; // Changed from photosPerPerson, now enum values
  eventDate: string; // New field
  isPasswordProtected: boolean; // New field
  customPassword: string; // New field
}

export interface ValidationState {
  title: boolean;
  description: boolean;
  eventFlyer: boolean;
  guestLimit: boolean;
  photoCapLimit: boolean;
  eventDate: boolean;
  isPasswordProtected: boolean;
  customPassword: boolean;
}

export interface StepProps {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validation: ValidationState;
  goToNextStep: (e: { preventDefault: () => void }) => void;
}

export interface FinalStepProps extends StepProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting?: boolean;
}

// API Response types
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// export interface CreateEventResponse {
//   id: string;
//   title: string;
//   description: string;
//   eventFlyer?: string;
//   guestLimit: string;
//   photoCapLimit: string;
//   createdBy: string;
//   isActive: boolean;
//   eventDate: string | null;
//   eventSlug: string;
//   qrCodeData: string;
//   accessPassword: string | null;
//   isPasswordProtected: boolean;
//   createdAt: string;
//   updatedAt: string;
//   creator: {
//     id: string;
//     fullname: string;
//     email: string;
//   };
// }

// Enum types matching your Zod schema

export interface CreateEventResponse {
  id: string;
  title: string;
  description: string;
  eventFlyer: string | null; // API returns null for optional fields
  guestLimit: string;
  photoCapLimit: string;
  createdBy: string;
  isActive: boolean;
  eventDate: string | null;
  eventSlug: string;
  qrCodeData: string;
  accessPassword: string | null;
  isPasswordProtected: boolean;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
}

export interface EventResponse {
  success: boolean;
  message: string;
  event: EventData;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  eventDate: string | null; // ISO string
  eventSlug: string;
  eventFlyer?: string | null;
  guestLimit: string;
  photoCapLimit: string;
  isActive: boolean;
  isPasswordProtected: boolean;
  accessPassword?: string | null;
  qrCodeData: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator: {
    id: string;
    fullname: string;
    email: string;
  };
}

export type GuestLimitOptions = "10" | "100" | "250" | "500" | "800" | "1000+";
export type PhotoCapLimitOptions = "5" | "10" | "15" | "20" | "25";
