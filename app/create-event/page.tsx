// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import Navbar from "@/components/shared/Navbar";
// import StepOne from "./components/StepOne";
// import StepTwo from "./components/StepTwo";
// import StepThree from "./components/StepThree";
// import StepFour from "./components/StepFour";
// import StepFive from "./components/StepFive";

// const MultiStepForm = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 5;
//   const formContainerRef = useRef(null);

//   const [formData, setFormData] = useState({
//     whatsTheOccasion: "",
//     description: "",
//     cover: null,
//     howManyGuests: "",
//     photosPerPerson: "",
//   });

//   const [validation, setValidation] = useState({
//     whatsTheOccasion: false,
//     description: true, // Optional
//     cover: false,
//     howManyGuests: false,
//     photosPerPerson: false,
//   });

//   // Step refs for detecting which step is in view
//   const [stepOneRef, stepOneInView] = useInView({ threshold: 0.6 });
//   const [stepTwoRef, stepTwoInView] = useInView({ threshold: 0.6 });
//   const [stepThreeRef, stepThreeInView] = useInView({ threshold: 0.6 });
//   const [stepFourRef, stepFourInView] = useInView({ threshold: 0.6 });
//   const [stepFiveRef, stepFiveInView] = useInView({ threshold: 0.6 });

//   // Track current step in view
//   useEffect(() => {
//     if (stepOneInView) setCurrentStep(1);
//     else if (stepTwoInView) setCurrentStep(2);
//     else if (stepThreeInView) setCurrentStep(3);
//     else if (stepFourInView) setCurrentStep(4);
//     else if (stepFiveInView) setCurrentStep(5);
//   }, [
//     stepOneInView,
//     stepTwoInView,
//     stepThreeInView,
//     stepFourInView,
//     stepFiveInView,
//   ]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "cover" && files?.[0]) {
//       setFormData((prev) => ({ ...prev, cover: files[0] }));
//       setValidation((prev) => ({ ...prev, cover: true }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     switch (name) {
//       case "whatsTheOccasion":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: value.trim().length > 0,
//         }));
//         break;
//       case "description":
//         setValidation((prev) => ({ ...prev, [name]: true }));
//         break;
//       case "howManyGuests":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: !isNaN(value) && Number(value) > 0,
//         }));
//         break;
//       case "photosPerPerson":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: !isNaN(value) && Number(value) > 0,
//         }));
//         break;
//       default:
//         break;
//     }
//   };

//   const goToNextStep = (e) => {
//     e.preventDefault();
//     const nextStep = currentStep + 1;
//     if (nextStep <= totalSteps) {
//       const nextSection = document.getElementById(`step${nextStep}`);
//       nextSection?.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     alert("Form submitted successfully!");
//   };

//   return (
//     <div className="relative">
//       <Navbar />

//       {/* Progress Bar */}
//       <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-20">
//         <div
//           className="h-full bg-white transition-all duration-300 ease-in-out"
//           style={{
//             width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
//           }}
//         />
//       </div>

//       {/* Form Steps */}
//       <div
//         className="bg-primary min-h-screen text-white overflow-y-auto snap-y snap-mandatory"
//         ref={formContainerRef}
//       >
//         <div id="step1" ref={stepOneRef} className="snap-start">
//           <StepOne
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step2" ref={stepTwoRef} className="snap-start">
//           <StepTwo
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step3" ref={stepThreeRef} className="snap-start">
//           <StepThree
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step4" ref={stepFourRef} className="snap-start">
//           <StepFour
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step5" ref={stepFiveRef} className="snap-start">
//           <StepFive
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             handleSubmit={handleSubmit}
//           />
//         </div>
//       </div>

//       {/* Magnifier Button */}
//       <button
//         className="fixed bottom-6 right-6 w-10 h-10 bg-yellow-800 rounded-full flex items-center justify-center z-20"
//         aria-label="Search"
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
//             fill="white"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default MultiStepForm;

// "use client";
// import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
// import { useInView } from "react-intersection-observer";
// import Navbar from "@/components/shared/Navbar";
// import StepOne from "./components/StepOne";
// import StepTwo from "./components/StepTwo";
// import StepThree from "./components/StepThree";
// import StepFour from "./components/StepFour";
// import StepFive from "./components/StepFive";

// interface FormData {
//   whatsTheOccasion: string;
//   description: string;
//   cover: File | null;
//   howManyGuests: string;
//   photosPerPerson: string;
// }

// interface ValidationState {
//   whatsTheOccasion: boolean;
//   description: boolean;
//   cover: boolean;
//   howManyGuests: boolean;
//   photosPerPerson: boolean;
// }

// type FormFieldNames = keyof FormData;

// const MultiStepForm: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const totalSteps: number = 5;
//   const formContainerRef = useRef<HTMLDivElement>(null);

//   const [formData, setFormData] = useState<FormData>({
//     whatsTheOccasion: "",
//     description: "",
//     cover: null,
//     howManyGuests: "",
//     photosPerPerson: "",
//   });

//   const [validation, setValidation] = useState<ValidationState>({
//     whatsTheOccasion: false,
//     description: true, // Optional
//     cover: false,
//     howManyGuests: false,
//     photosPerPerson: false,
//   });

//   // Step refs for detecting which step is in view
//   const [stepOneRef, stepOneInView] = useInView({ threshold: 0.6 });
//   const [stepTwoRef, stepTwoInView] = useInView({ threshold: 0.6 });
//   const [stepThreeRef, stepThreeInView] = useInView({ threshold: 0.6 });
//   const [stepFourRef, stepFourInView] = useInView({ threshold: 0.6 });
//   const [stepFiveRef, stepFiveInView] = useInView({ threshold: 0.6 });

//   // Track current step in view
//   useEffect(() => {
//     if (stepOneInView) setCurrentStep(1);
//     else if (stepTwoInView) setCurrentStep(2);
//     else if (stepThreeInView) setCurrentStep(3);
//     else if (stepFourInView) setCurrentStep(4);
//     else if (stepFiveInView) setCurrentStep(5);
//   }, [
//     stepOneInView,
//     stepTwoInView,
//     stepThreeInView,
//     stepFourInView,
//     stepFiveInView,
//   ]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ): void => {
//     const { name, value } = e.target;
//     const target = e.target as HTMLInputElement;
//     const files = target.files;

//     if (name === "cover" && files?.[0]) {
//       setFormData((prev) => ({ ...prev, cover: files[0] }));
//       setValidation((prev) => ({ ...prev, cover: true }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     switch (name as FormFieldNames) {
//       case "whatsTheOccasion":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: value.trim().length > 0,
//         }));
//         break;
//       case "description":
//         setValidation((prev) => ({ ...prev, [name]: true }));
//         break;
//       case "howManyGuests":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: !isNaN(Number(value)) && Number(value) > 0,
//         }));
//         break;
//       case "photosPerPerson":
//         setValidation((prev) => ({
//           ...prev,
//           [name]: !isNaN(Number(value)) && Number(value) > 0,
//         }));
//         break;
//       default:
//         break;
//     }
//   };

//   const goToNextStep = (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     const nextStep = currentStep + 1;
//     if (nextStep <= totalSteps) {
//       const nextSection = document.getElementById(`step${nextStep}`);
//       nextSection?.scrollIntoView({ behavior: "smooth" });
//     }
//   };
//   const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     alert("Form submitted successfully!");
//   };

//   return (
//     <div className="relative">
//       <Navbar />

//       {/* Progress Bar */}
//       <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-20">
//         <div
//           className="h-full bg-white transition-all duration-300 ease-in-out"
//           style={{
//             width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
//           }}
//         />
//       </div>

//       {/* Form Steps */}
//       <div
//         className="bg-primary min-h-screen text-white overflow-y-auto snap-y snap-mandatory"
//         ref={formContainerRef}
//       >
//         <div id="step1" ref={stepOneRef} className="snap-start">
//           <StepOne
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step2" ref={stepTwoRef} className="snap-start">
//           <StepTwo
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step3" ref={stepThreeRef} className="snap-start">
//           <StepThree
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step4" ref={stepFourRef} className="snap-start">
//           <StepFour
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             goToNextStep={goToNextStep}
//           />
//         </div>

//         <div id="step5" ref={stepFiveRef} className="snap-start">
//           <StepFive
//             formData={formData}
//             handleChange={handleChange}
//             validation={validation}
//             handleSubmit={handleSubmit}
//           />
//         </div>
//       </div>

//       {/* Magnifier Button */}
//       <button
//         className="fixed bottom-6 right-6 w-10 h-10 bg-yellow-800 rounded-full flex items-center justify-center z-20"
//         aria-label="Search"
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
//             fill="white"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default MultiStepForm;

"use client";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod";
import Navbar from "@/components/shared/Navbar";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";
import EventSuccessModal from "./components/EventSuccessModal";
import {
  createEvent,
  ApiError,
  GUEST_LIMIT_OPTIONS,
  PHOTO_CAP_LIMIT_OPTIONS,
  isValidUrl,
  isValidFutureDate,
  CreateEventPayload,
  initPrecreatePayment,
  verifyPrecreatePayment,
} from "../utils/api";
import { isAuthenticated } from "../utils/auth";
import {
  FormData as CreateEventFormData,
  ValidationState,
  GuestLimitOptions,
  PhotoCapLimitOptions,
} from "../../types/event";
import { useEmailStore } from "@/store/userStore";

// Zod schema matching your backend (with optional customPhotoCapLimit)
const createEventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    eventFlyer: z.string().url("Event Flyer must be a valid URL").optional(),
    guestLimit: z.union([
      z.enum(["10", "100", "250", "500", "800", "1000+"]),
      z.literal("CUSTOM"),
    ]),
    photoCapLimit: z.union([
      z.enum(["5", "10", "15", "20", "25"]),
      z.literal("CUSTOM"),
    ]),
    customGuestLimit: z.number().int().min(1001).optional(),
    customPhotoCapLimit: z.number().int().min(26).optional(),
    eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Event Date must be a valid date",
    }),
    isPasswordProtected: z.boolean(),
    customPassword: z
      .string()
      .min(4, "Custom Password must be at least 4 characters")
      .optional(),
  })
  .refine(
    (data) =>
      data.guestLimit !== "CUSTOM" ||
      (typeof data.customGuestLimit === "number" &&
        data.customGuestLimit >= 1001),
    {
      message: "customGuestLimit must be provided and >= 1001 for CUSTOM",
      path: ["customGuestLimit"],
    }
  )
  .refine(
    (data) =>
      data.photoCapLimit !== "CUSTOM" ||
      (typeof data.customPhotoCapLimit === "number" &&
        data.customPhotoCapLimit > 25),
    {
      message: "customPhotoCapLimit must be provided and > 25 for CUSTOM",
      path: ["customPhotoCapLimit"],
    }
  );

type FormFieldNames = keyof CreateEventFormData;

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = 5;
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    eventFlyer: "",
    guestLimit: "10",
    photoCapLimit: "5",
    eventDate: "",
    isPasswordProtected: false,
    customPassword: "",
    customGuestLimit: undefined,
    customPhotoCapLimit: undefined,
  });

  const [validation, setValidation] = useState<ValidationState>({
    title: false,
    description: false,
    eventFlyer: true, // Optional field, starts as valid
    guestLimit: true, // Has default value
    photoCapLimit: true, // Has default value
    eventDate: false,
    isPasswordProtected: true, // Boolean, always valid
    customPassword: true, // Optional initially
    customGuestLimit: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventData, setCreatedEventData] = useState<{
    id: string;
    title: string;
    description: string;
    eventDate: string | null; // Allow null
    eventSlug: string;
    qrCodeData: string;
    isPasswordProtected: boolean;
    accessPassword?: string | null; // Allow null
    guestLimit: string; // Add this
    photoCapLimit: string; // Add this
    eventFlyer?: string | null; // Add this, allow null
  } | null>(null);

  // Step refs for detecting which step is in view
  const [stepOneRef, stepOneInView] = useInView({ threshold: 0.6 });
  const [stepTwoRef, stepTwoInView] = useInView({ threshold: 0.6 });
  const [stepThreeRef, stepThreeInView] = useInView({ threshold: 0.6 });
  const [stepFourRef, stepFourInView] = useInView({ threshold: 0.6 });
  const [stepFiveRef, stepFiveInView] = useInView({ threshold: 0.6 });

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

  // Verify Paystack pre-create payment on callback
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const reference = url.searchParams.get("reference");
      if (!reference) return;

      if (sessionStorage.getItem(`verified:${reference}`)) return;

      (async () => {
        try {
          setIsSubmitting(true);
          const res = await verifyPrecreatePayment(reference);
          const event = res?.event;
          const accessInfo = res?.accessInfo;

          if (event?.id) {
            const modalData = {
              id: event.id,
              title: event.title ?? "",
              description: event.description ?? "",
              eventDate: event.eventDate ?? null,
              eventSlug: event.eventSlug ?? "",
              qrCodeData: accessInfo?.qrCodeData ?? "",
              isPasswordProtected: !!event.isPasswordProtected,
              accessPassword: event.isPasswordProtected
                ? accessInfo?.generatedPassword ?? null
                : null,
              guestLimit: event.guestLimit ?? "",
              photoCapLimit: event.photoCapLimit ?? "",
              eventFlyer: event.eventFlyer ?? null,
            };

            setCreatedEventData(modalData);
            setShowSuccessModal(true);
            sessionStorage.setItem(`verified:${reference}`, "1");
            // Clean URL
            url.searchParams.delete("reference");
            window.history.replaceState({}, "", url.toString());
          } else {
            setSubmitError("Payment verified but event was not created.");
          }
        } catch {
          setSubmitError(
            "Unable to verify payment. If you were charged, please contact support."
          );
        } finally {
          setIsSubmitting(false);
        }
      })();
    } catch {
      // ignore URL constructor errors
    }
  }, []);

  // Update password validation when isPasswordProtected changes
  useEffect(() => {
    if (formData.isPasswordProtected) {
      setValidation((prev) => ({
        ...prev,
        customPassword: formData.customPassword.length >= 4,
      }));
    } else {
      setValidation((prev) => ({
        ...prev,
        customPassword: true,
      }));
    }
  }, [formData.isPasswordProtected, formData.customPassword]);

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
          (value === "CUSTOM" ||
            GUEST_LIMIT_OPTIONS.includes(value as GuestLimitOptions))
        );
      case "photoCapLimit":
        return (
          typeof value === "string" &&
          (value === "CUSTOM" ||
            PHOTO_CAP_LIMIT_OPTIONS.includes(value as PhotoCapLimitOptions))
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
      case "customGuestLimit":
        return (
          formData.guestLimit !== "CUSTOM" ||
          (typeof value === "number" &&
            Number.isInteger(value) &&
            value >= 1001)
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

    const actualValue =
      type === "checkbox"
        ? checked
        : name === "customGuestLimit"
        ? Number(value)
        : value;

    // Special handling: if turning off password protection, clear customPassword
    if (
      name === "isPasswordProtected" &&
      type === "checkbox" &&
      checked === false
    ) {
      setFormData((prev) => ({
        ...prev,
        isPasswordProtected: false,
        customPassword: "",
      }));
      setValidation((prev) => ({ ...prev, customPassword: true }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: actualValue }));
    }

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
        return validation.guestLimit && validation.customGuestLimit !== false;
      case 5:
        return (
          validation.photoCapLimit &&
          validation.eventDate &&
          validation.customPassword
        );
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
      setSubmitError(""); // Clear any previous errors
      const nextSection = document.getElementById(`step${nextStep}`);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setSubmitError("Please sign in to create an event");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    try {
      // Base payload
      const payload: CreateEventPayload = {
        title: formData.title,
        description: formData.description,
        eventFlyer: formData.eventFlyer || undefined,
        guestLimit: formData.guestLimit as GuestLimitOptions,
        photoCapLimit: formData.photoCapLimit as PhotoCapLimitOptions,
        eventDate: formData.eventDate,
        isPasswordProtected: formData.isPasswordProtected,
        customPassword: formData.isPasswordProtected
          ? formData.customPassword
          : undefined,
      };

      // Add custom values when selected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalPayload: any = { ...payload };
      if (formData.guestLimit === "CUSTOM") {
        finalPayload.guestLimit = "CUSTOM";
        finalPayload.customGuestLimit = Number(formData.customGuestLimit);
      }
      if (formData.photoCapLimit === "CUSTOM") {
        finalPayload.photoCapLimit = "CUSTOM";
        if (typeof formData.customPhotoCapLimit === "number") {
          finalPayload.customPhotoCapLimit = Number(
            formData.customPhotoCapLimit
          );
        }
      }

      // Validate payload
      createEventSchema.parse(finalPayload);
      // Determine if selected plan is free
      const isFreePlan =
        String(formData.guestLimit) === "10" &&
        String(formData.photoCapLimit) === "5";

      if (isFreePlan) {
        // Free plan: create immediately
        const apiResponse = await createEvent(
          finalPayload as CreateEventPayload
        );
        const event = (
          apiResponse as unknown as {
            event?: unknown;
            accessInfo?: unknown;
          } as {
            event?: {
              id?: string;
              title?: string;
              description?: string;
              eventDate?: string | null;
              eventSlug?: string;
              isPasswordProtected?: boolean;
              guestLimit?: string;
              photoCapLimit?: string;
              eventFlyer?: string | null;
            };
            accessInfo?: {
              qrCodeData?: string;
              generatedPassword?: string | null;
            };
          }
        ).event;
        const accessInfo = (
          apiResponse as unknown as {
            accessInfo?: {
              qrCodeData?: string;
              generatedPassword?: string | null;
            };
          }
        ).accessInfo;

        if (!event || !event.id) {
          throw new Error("Invalid createEvent response: missing event");
        }

        const modalData = {
          id: event.id,
          title: event.title ?? formData.title,
          description: event.description ?? formData.description,
          eventDate: event.eventDate ?? formData.eventDate ?? null,
          eventSlug: event.eventSlug ?? "",
          qrCodeData: accessInfo?.qrCodeData ?? "",
          isPasswordProtected: !!event.isPasswordProtected,
          accessPassword: event.isPasswordProtected
            ? accessInfo?.generatedPassword ?? null
            : null,
          guestLimit: event.guestLimit ?? String(formData.guestLimit),
          photoCapLimit: event.photoCapLimit ?? String(formData.photoCapLimit),
          eventFlyer: event.eventFlyer ?? formData.eventFlyer ?? null,
        };

        setCreatedEventData(modalData);
        setShowSuccessModal(true);
        return;
      }

      // Paid plans: init pre-create payment with full draft and email, then redirect
      const storedEmail =
        useEmailStore.getState().email ??
        (typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("email-storage") || "null")?.state
              ?.email ?? null
          : null);

      if (!storedEmail) {
        setSubmitError(
          "Email required to initialize payment. Please sign in again."
        );
        return;
      }

      const precreate = await initPrecreatePayment({
        title: finalPayload.title,
        description: finalPayload.description,
        eventFlyer: finalPayload.eventFlyer,
        guestLimit: String(finalPayload.guestLimit),
        photoCapLimit: String(finalPayload.photoCapLimit),
        customGuestLimit: finalPayload.customGuestLimit,
        customPhotoCapLimit: finalPayload.customPhotoCapLimit,
        eventDate: finalPayload.eventDate,
        isPasswordProtected: finalPayload.isPasswordProtected,
        customPassword: finalPayload.customPassword,
        email: storedEmail,
      });

      if (precreate?.authorizationUrl) {
        window.location.href = precreate.authorizationUrl;
        return;
      }

      setSubmitError(
        "Unable to start payment. Please try again or contact support."
      );
    } catch (error) {
      console.error("Error creating event:", error);

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
            errors[field] = Array.isArray(messages)
              ? messages[0]
              : (messages as string);
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
            <span className="text-gray-900">Creating your event...</span>
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

      {/* Success Modal */}
      {createdEventData && (
        <EventSuccessModal
          eventData={createdEventData}
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default MultiStepForm;
