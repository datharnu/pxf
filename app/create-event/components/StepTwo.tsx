"use client";
import React from "react";
import { StepProps } from "./types";
import FormImages from "./FromImages";

const StepTwo: React.FC<StepProps> = ({
  formData,
  handleChange,
  goToNextStep,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 snap-start">
      <FormImages />

      <h1 className="text-2xl font-bold mb-8">Description (optional)</h1>

      <form className="w-full max-w-md" onSubmit={goToNextStep}>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center mb-6">
          <textarea
            name="description"
            placeholder="Enter a brief description..."
            value={formData.description}
            onChange={handleChange}
            className="bg-transparent border-none w-full focus:outline-none pl-3 text-white resize-none"
            rows={3}
          />
        </div>
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
