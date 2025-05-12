// "use client";

// import { useForm } from "react-hook-form";

// export default function CreateEventForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data: unknown) => {
//     console.log("Event Data:", data);
//     alert("This is just UI – event would be created here.");
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h2 className="text-3xl font-bold mb-6">Create Your Event</h2>

//       {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         <div>
//           <label className="block mb-1 font-medium">Event Name</label>
//           <input
//             {...register("title", { required: true })}
//             placeholder="e.g. John & Ada Wedding"
//             className="w-full px-4 py-2 border rounded-md"
//           />
//           {errors.title && (
//             <p className="text-sm text-red-500 mt-1">Event name is required</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-1 font-medium">
//             Description (optional)
//           </label>
//           <textarea
//             {...register("description")}
//             rows={3}
//             placeholder="Say something about the event..."
//             className="w-full px-4 py-2 border rounded-md"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-1 font-medium">Max Guests</label>
//             <input
//               type="number"
//               defaultValue={10}
//               {...register("maxGuests")}
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Uploads per Guest</label>
//             <input
//               type="number"
//               defaultValue={10}
//               {...register("maxUploadsPerGuest")}
//               className="w-full px-4 py-2 border rounded-md"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition"
//         >
//           Continue
//         </button>
//       </form> */}
//     </div>
//   );
// }

import React from "react";
import EventSlider from "./components/EventSlider";
import Navbar from "@/components/shared/Navbar";

export default function CreateEvent() {
  return (
    <div>
      <Navbar />
      <EventSlider />
    </div>
  );
}
