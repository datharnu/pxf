// Define form data interface
export interface FormData {
  whatsTheOccasion: string;
  description: string;
  cover: File | null;
  howManyGuests: string;
  photosPerPerson: string;
}

// Define validation state interface

export interface ValidationState {
  whatsTheOccasion: boolean;
  description: boolean;
  cover: boolean;
  howManyGuests: boolean;
  photosPerPerson: boolean; // ← change this to boolean
}

// Base props interface that all steps share
export interface BaseStepProps {
  formData: FormData;
  validation: ValidationState;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

// Props for steps 1-4 that use goToNextStep
export interface StepProps extends BaseStepProps {
  goToNextStep: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Props for step 5 that uses handleSubmit instead of goToNextStep
export interface FinalStepProps extends BaseStepProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
