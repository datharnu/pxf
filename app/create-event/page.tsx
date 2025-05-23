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

"use client";
import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { useInView } from "react-intersection-observer";
import Navbar from "@/components/shared/Navbar";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import StepFour from "./components/StepFour";
import StepFive from "./components/StepFive";

interface FormData {
  whatsTheOccasion: string;
  description: string;
  cover: File | null;
  howManyGuests: string;
  photosPerPerson: string;
}

interface ValidationState {
  whatsTheOccasion: boolean;
  description: boolean;
  cover: boolean;
  howManyGuests: boolean;
  photosPerPerson: boolean;
}

type FormFieldNames = keyof FormData;

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = 5;
  const formContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    whatsTheOccasion: "",
    description: "",
    cover: null,
    howManyGuests: "",
    photosPerPerson: "",
  });

  const [validation, setValidation] = useState<ValidationState>({
    whatsTheOccasion: false,
    description: true, // Optional
    cover: false,
    howManyGuests: false,
    photosPerPerson: false,
  });

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (name === "cover" && files?.[0]) {
      setFormData((prev) => ({ ...prev, cover: files[0] }));
      setValidation((prev) => ({ ...prev, cover: true }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name as FormFieldNames) {
      case "whatsTheOccasion":
        setValidation((prev) => ({
          ...prev,
          [name]: value.trim().length > 0,
        }));
        break;
      case "description":
        setValidation((prev) => ({ ...prev, [name]: true }));
        break;
      case "howManyGuests":
        setValidation((prev) => ({
          ...prev,
          [name]: !isNaN(Number(value)) && Number(value) > 0,
        }));
        break;
      case "photosPerPerson":
        setValidation((prev) => ({
          ...prev,
          [name]: !isNaN(Number(value)) && Number(value) > 0,
        }));
        break;
      default:
        break;
    }
  };

  // const goToNextStep = (e: FormEvent<HTMLButtonElement>): void => {
  //   e.preventDefault();
  //   const nextStep = currentStep + 1;
  //   if (nextStep <= totalSteps) {
  //     const nextSection = document.getElementById(`step${nextStep}`);
  //     nextSection?.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const goToNextStep = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const nextStep = currentStep + 1;
    if (nextStep <= totalSteps) {
      const nextSection = document.getElementById(`step${nextStep}`);
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
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
          />
        </div>

        <div id="step2" ref={stepTwoRef} className="snap-start">
          <StepTwo
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
          />
        </div>

        <div id="step3" ref={stepThreeRef} className="snap-start">
          <StepThree
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
          />
        </div>

        <div id="step4" ref={stepFourRef} className="snap-start">
          <StepFour
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            goToNextStep={goToNextStep}
          />
        </div>

        <div id="step5" ref={stepFiveRef} className="snap-start">
          <StepFive
            formData={formData}
            handleChange={handleChange}
            validation={validation}
            handleSubmit={handleSubmit}
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

export default MultiStepForm;
