// "use client";
// import React from "react";
// import { StepProps } from "./types";
// import FormImages from "./FromImages";

// const StepTwo: React.FC<StepProps> = ({
//   formData,
//   handleChange,
//   goToNextStep,
// }) => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
//       <FormImages />

//       <h1 className="text-2xl font-bold mb-8">Description (optional)</h1>

//       <form className="w-full max-w-md" onSubmit={goToNextStep}>
//         <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center mb-6">
//           <textarea
//             name="description"
//             placeholder="Enter a brief description..."
//             value={formData.description}
//             onChange={handleChange}
//             className="bg-transparent border-none w-full focus:outline-none pl-3 text-white resize-none"
//             rows={3}
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full py-3 rounded-lg font-bold transition-colors bg-white text-black hover:bg-gray-200"
//         >
//           Next
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StepTwo;

"use client";
import React from "react";
import FormImages from "./FromImages";

interface StepTwoProps {
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

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  handleChange,
  goToNextStep,
  fieldError,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
      <FormImages />

      <h1 className="text-2xl font-bold mb-8">Description</h1>
      <p className="text-gray-400 mb-4 text-center">
        Tell your guests what this event is about (min. 10 characters)
      </p>

      <form className="w-full max-w-md" onSubmit={goToNextStep}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center mb-2">
          <textarea
            name="description"
            placeholder="Enter a brief description..."
            value={formData.description}
            onChange={handleChange}
            className="bg-transparent border-none w-full focus:outline-none pl-3 text-white resize-none"
            rows={3}
            minLength={10}
            required
          />
        </div>
        {fieldError && (
          <p className="text-red-400 text-sm mb-4">{fieldError}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold transition-colors bg-white text-black hover:bg-gray-200"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StepTwo;
