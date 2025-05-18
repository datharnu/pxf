// "use client";
// import React from "react";
// import { FinalStepProps } from "./types";
// import Image from "next/image";
// const StepFive: React.FC<FinalStepProps> = ({
//   formData,
//   handleChange,
//   validation,
//   handleSubmit,
// }) => {
//   const photoOptions = [5, 10, 15, 25];

//   const handlePhotoOptionClick = (value: number) => {
//     handleChange({
//       target: {
//         name: "photosPerPerson",
//         value: value.toString(),
//       },
//     } as React.ChangeEvent<HTMLInputElement>);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-start p-6 snap-start">
//       {/* Phone Image */}
//       <div className="mb-6 relative w-[200px] h-[400px] rounded-[2.5rem] border-[14px] border-black shadow-2xl bg-black overflow-hidden">
//         <Image
//           src="/Adobe1.png" // Replace with your image
//           alt="Phone screen preview"
//           layout="fill"
//           objectFit="cover"
//         />
//       </div>

//       {/* Header */}
//       <h1 className="text-xl font-semibold text-center mb-2 text-white">
//         Photos per Person
//       </h1>
//       <p className="text-sm text-center text-gray-400 mb-6">
//         Limited # of photos each person can take before the end date
//       </p>

//       {/* Photo Options */}
//       <div className="flex gap-3 mb-6">
//         {photoOptions.map((num) => (
//           <button
//             key={num}
//             type="button"
//             onClick={() => handlePhotoOptionClick(num)}
//             className={`px-4 py-2 rounded-lg font-bold text-sm ${
//               Number(formData.photosPerPerson) === num
//                 ? "bg-violet-600 text-white"
//                 : "bg-gray-700 text-gray-300"
//             }`}
//           >
//             {num}
//           </button>
//         ))}
//       </div>

//       {/* Submit Button */}
//       <form onSubmit={handleSubmit} className="w-full max-w-md">
//         <button
//           type="submit"
//           disabled={!validation.photosPerPerson}
//           className={`w-full py-3 rounded-lg font-bold transition-colors ${
//             validation.photosPerPerson
//               ? "bg-violet-600 text-white hover:bg-violet-700"
//               : "bg-gray-700 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Next
//         </button>
//       </form>
//     </div>
//   );
// };

// export default StepFive;

"use client";
import React from "react";
import { useRouter } from "next/navigation"; // ✅ App Router
import { FinalStepProps } from "./types";
import Image from "next/image";

const StepFive: React.FC<FinalStepProps> = ({
  formData,
  handleChange,
  validation,
}) => {
  const router = useRouter();
  const photoOptions = [5, 10, 15, 25];

  const handlePhotoOptionClick = (value: number) => {
    handleChange({
      target: {
        name: "photosPerPerson",
        value: value.toString(),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const eventTitle = formData.whatsTheOccasion || "Sample Event";
  const eventDesc = formData.description || "Event description here";
  const eventCode = "ABC123";
  const shareUrl = "https://example.com/event/ABC123";
  const coverImage = "/Adobe1.png";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ You can submit formData to your backend here if needed

    // Redirect after submission
    router.push(
      `/my-events?created=true&title=${encodeURIComponent(
        eventTitle
      )}&description=${encodeURIComponent(
        eventDesc
      )}&eventCode=${encodeURIComponent(
        eventCode
      )}&shareUrl=${encodeURIComponent(
        shareUrl
      )}&coverImage=${encodeURIComponent(coverImage)}`
    );
    // ✅ Redirect to my-event page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 snap-start">
      {/* Phone Image */}
      <div className="mb-6 relative w-[200px] h-[400px] rounded-[2.5rem] border-[14px] border-black shadow-2xl bg-black overflow-hidden">
        <Image
          src="/Adobe1.png"
          alt="Phone screen preview"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <h1 className="text-xl font-semibold text-center mb-2 text-white">
        Photos per Person
      </h1>
      <p className="text-sm text-center text-gray-400 mb-6">
        Limited # of photos each person can take before the end date
      </p>

      {/* Photo Options */}
      <div className="flex gap-3 mb-6">
        {photoOptions.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handlePhotoOptionClick(num)}
            className={`px-4 py-2 rounded-lg font-bold text-sm ${
              Number(formData.photosPerPerson) === num
                ? "bg-violet-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <button
          type="submit"
          disabled={!validation.photosPerPerson}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            validation.photosPerPerson
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default StepFive;
