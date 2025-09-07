"use client";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import StepOne from "../../create-event/components/StepOne";
import StepTwo from "../../create-event/components/StepTwo";
import StepThree from "../../create-event/components/StepThree";
import StepFour from "../../create-event/components/StepFour";
import StepFive from "../../create-event/components/StepFive";
import {
  getEventById,
  updateEvent,
  ApiError,
  GUEST_LIMIT_OPTIONS,
  PHOTO_CAP_LIMIT_OPTIONS,
  isValidUrl,
  isValidFutureDate,
} from "../../utils/api";
import { isAuthenticated } from "../../utils/auth";
import {
  FormData,
  ValidationState,
  GuestLimitOptions,
  PhotoCapLimitOptions,
  EventResponse,
} from "../../../types/event";

// Zod schema matching your backend (for update)
const updateEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventFlyer: z.string().url("Event Flyer must be a valid URL").optional(),
  guestLimit: z.enum(["10", "100", "250", "500", "800", "1000+"]),
  photoCapLimit: z.enum(["5", "10", "15", "20", "25"]),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Event Date must be a valid date",
  }),
});

type FormFieldNames = keyof FormData;

const EditEventForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = 5;
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    eventFlyer: "",
    guestLimit: "10",
    photoCapLimit: "5",
    eventDate: "",
    isPasswordProtected: false,
    customPassword: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    title: false,
    description: false,
    eventFlyer: true,
    guestLimit: true,
    photoCapLimit: true,
    eventDate: false,
    isPasswordProtected: true,
    customPassword: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step refs for detecting which step is in view
  const [stepOneRef, stepOneInView] = useInView({ threshold: 0.6 });
  const [stepTwoRef, stepTwoInView] = useInView({ threshold: 0.6 });
  const [stepThreeRef, stepThreeInView] = useInView({ threshold: 0.6 });
  const [stepFourRef, stepFourInView] = useInView({ threshold: 0.6 });
  const [stepFiveRef, stepFiveInView] = useInView({ threshold: 0.6 });

  // Load event data
  useEffect(() => {
    const loadEventData = async () => {
      if (!isAuthenticated()) {
        router.push("/sign-in");
        return;
      }

      try {
        setLoading(true);
        const response: EventResponse = await getEventById(eventId);

        setFormData({
          title: response.event.title || "",
          description: response.event.description || "",
          eventFlyer: response.event.eventFlyer || "",
          guestLimit: response.event.guestLimit || "10",
          photoCapLimit: response.event.photoCapLimit || "5",
          eventDate: response.event.eventDate
            ? new Date(response.event.eventDate).toISOString().slice(0, 10)
            : "",
          isPasswordProtected: response.event.isPasswordProtected || false,
          customPassword: "",
        });

        // Set validation states
        setValidation({
          title: !!response.event.title && response.event.title.length >= 3,
          description:
            !!response.event.description &&
            response.event.description.length >= 10,
          eventFlyer: true, // Optional field
          guestLimit: true,
          photoCapLimit: true,
          eventDate: !!response.event.eventDate,
          isPasswordProtected: true,
          customPassword: true,
        });
      } catch (error) {
        console.error("Error loading event:", error);
        setSubmitError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEventData();
    }
  }, [eventId, router]);

  // Track current step in view
  useEffect(() => {
    if (stepOneInView) setCurrentStep(1);
    else if (stepTwoInView) setCurrentStep(2);
    else if (stepThreeInView) setCurrentStep(3);
    else if (stepFourInView) setCurrentStep(4);
    else if (stepFiveInView) setCurrentStep(5);
  }, [
    stepOneInView,
    stepTwoInView,
    stepThreeInView,
    stepFourInView,
    stepFiveInView,
  ]);

  const validateField = (name: FormFieldNames, value: unknown): boolean => {
    switch (name) {
      case "title":
        return typeof value === "string" && value.trim().length >= 3;
      case "description":
        return typeof value === "string" && value.trim().length >= 10;
      case "eventFlyer":
        return value === "" || (typeof value === "string" && isValidUrl(value));
      case "guestLimit":
        return (
          typeof value === "string" &&
          GUEST_LIMIT_OPTIONS.includes(value as GuestLimitOptions)
        );
      case "photoCapLimit":
        return (
          typeof value === "string" &&
          PHOTO_CAP_LIMIT_OPTIONS.includes(value as PhotoCapLimitOptions)
        );
      case "eventDate":
        return typeof value === "string" && isValidFutureDate(value);
      case "isPasswordProtected":
        return typeof value === "boolean";
      case "customPassword":
        return (
          !formData.isPasswordProtected ||
          (typeof value === "string" && value.length >= 4)
        );
      default:
        return true;
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    const actualValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: actualValue }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate field
    const isValid = validateField(name as FormFieldNames, actualValue);
    setValidation((prev) => ({
      ...prev,
      [name]: isValid,
    }));
  };

  const canGoToNextStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return validation.title;
      case 2:
        return validation.description;
      case 3:
        return validation.eventFlyer;
      case 4:
        return validation.guestLimit;
      case 5:
        return validation.photoCapLimit && validation.eventDate;
      default:
        return false;
    }
  };

  const goToNextStep = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!canGoToNextStep(currentStep)) {
      setSubmitError("Please fill in all required fields correctly");
      return;
    }

    const nextStep = currentStep + 1;
    if (nextStep <= totalSteps) {
      setSubmitError("");
      const nextSection = document.getElementById(`step${nextStep}`);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setSubmitError("Please sign in to update an event");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    try {
      // Prepare payload for API (only the fields that can be updated)
      const payload = {
        title: formData.title,
        description: formData.description,
        eventFlyer: formData.eventFlyer || undefined,
        guestLimit: formData.guestLimit as GuestLimitOptions,
        photoCapLimit: formData.photoCapLimit as PhotoCapLimitOptions,
        eventDate: formData.eventDate,
      };

      // Validate with Zod schema before sending
      updateEventSchema.parse(payload);

      console.log("Updating event with payload:", payload);

      // Submit to API
      await updateEvent(eventId, payload);

      console.log("Event updated successfully");

      // Redirect to my-events page instead of showing success modal
      router.push("/my-events");
    } catch (error) {
      console.error("Error updating event:", error);

      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
        setSubmitError("Please check all fields and try again");
      } else if (error instanceof ApiError) {
        if (error.errors) {
          const errors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, messages]) => {
            errors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          setFieldErrors(errors);
        }
        setSubmitError(error.message);
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-20">
        <div
          className="h-full bg-white transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="fixed top-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg z-30 flex items-center justify-between">
          <span>{submitError}</span>
          <button
            onClick={() => setSubmitError("")}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="text-gray-900">Updating your event...</span>
          </div>
        </div>
      )}

      {/* Form Steps */}
      <div
        className="bg-primary min-h-screen text-white overflow-y-auto snap-y snap-mandatory"
        ref={formContainerRef}
      >
        <div id="step1" ref={stepOneRef} className="snap-start">
          <StepOne
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
            fieldError={fieldErrors.title}
          />
        </div>

        <div id="step2" ref={stepTwoRef} className="snap-start">
          <StepTwo
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
            fieldError={fieldErrors.description}
          />
        </div>

        <div id="step3" ref={stepThreeRef} className="snap-start">
          <StepThree
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
            fieldError={fieldErrors.eventFlyer}
          />
        </div>

        <div id="step4" ref={stepFourRef} className="snap-start">
          <StepFour
            formData={formData}
            handleChange={handleChange}
            readOnly
            validation={validation}
            goToNextStep={goToNextStep}
            fieldError={fieldErrors.guestLimit}
          />
        </div>

        <div id="step5" ref={stepFiveRef} className="snap-start">
          <StepFive
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            fieldErrors={fieldErrors}
          />
        </div>
      </div>

      {/* Magnifier Button */}
      <button
        className="fixed bottom-6 right-6 w-10 h-10 bg-yellow-800 rounded-full flex items-center justify-center z-20"
        aria-label="Search"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
};

export default EditEventForm;
