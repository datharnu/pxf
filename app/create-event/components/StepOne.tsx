// "use client";
// import React from "react";

// import { StepProps } from "./types";
// import FormImages from "./FromImages";

// const StepOne: React.FC<StepProps> = ({
//   formData,
//   handleChange,
//   validation,
//   goToNextStep,
// }) => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
//       <FormImages />

//       <h1 className="text-2xl font-bold mb-8">What&apos;s the occasion?</h1>

//       <form className="w-full max-w-md" onSubmit={goToNextStep}>
//         <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center mb-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             className="w-5 h-5 text-gray-400"
//           >
//             <path
//               d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
//               fill="currentColor"
//             />
//           </svg>
//           <input
//             type="text"
//             name="whatsTheOccasion"
//             placeholder="e.g. John & Ada Wedding"
//             value={formData.whatsTheOccasion}
//             onChange={handleChange}
//             className="bg-transparent border-none w-full focus:outline-none pl-3 text-white"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={!validation.whatsTheOccasion}
//           className={`w-full py-3 rounded-lg font-bold transition-colors ${
//             validation.whatsTheOccasion
//               ? "bg-white text-black hover:bg-gray-200"
//               : "bg-gray-700 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Next
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StepOne;

"use client";
import React from "react";
import FormImages from "./FromImages";

interface StepOneProps {
  formData: {
    title: string;
    description: string;
    eventFlyer: string;
    guestLimit: string;
    photoCapLimit: string;
    eventDate: string;
    isPasswordProtected: boolean;
    customPassword: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validation: {
    title: boolean;
    description: boolean;
    eventFlyer: boolean;
    guestLimit: boolean;
    photoCapLimit: boolean;
    eventDate: boolean;
    isPasswordProtected: boolean;
    customPassword: boolean;
  };
  goToNextStep: (e: { preventDefault: () => void }) => void;
  fieldError?: string;
}

const StepOne: React.FC<StepOneProps> = ({
  formData,
  handleChange,
  validation,
  goToNextStep,
  fieldError,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
      <FormImages />

      <h1 className="text-2xl font-bold mb-8">What&apos;s the occasion?</h1>

      <form className="w-full max-w-md" onSubmit={goToNextStep}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gray-400"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
            />
          </svg>
          <input
            type="text"
            name="title"
            placeholder="e.g. John & Ada Wedding"
            value={formData.title}
            onChange={handleChange}
            className="bg-transparent border-none w-full focus:outline-none pl-3 text-white"
            required
            minLength={3}
          />
        </div>
        {fieldError && (
          <p className="text-red-400 text-sm mb-4">{fieldError}</p>
        )}
        <button
          type="submit"
          disabled={!validation.title}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            validation.title
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StepOne;
