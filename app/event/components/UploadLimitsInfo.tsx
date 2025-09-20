// Component to display upload limits information to users

import React from "react";
import { getUploadLimitsDisplay } from "@/app/utils/uploadLimits";

interface UploadLimitsInfoProps {
  guestLimit: string;
  isCreator: boolean;
}

export const UploadLimitsInfo: React.FC<UploadLimitsInfoProps> = ({
  guestLimit,
  isCreator,
}) => {
  const limits = getUploadLimitsDisplay(guestLimit);

  return (
    <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-400">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        <span className="font-medium text-zinc-300">
          Upload Limits for this Event
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Event Creator:</span>
          <span
            className={`font-medium ${
              isCreator ? "text-amber-400" : "text-zinc-400"
            }`}
          >
            {limits.creator} media files
          </span>
        </div>
        <div className="flex justify-between">
          <span>Each Guest:</span>
          <span
            className={`font-medium ${
              !isCreator ? "text-amber-400" : "text-zinc-400"
            }`}
          >
            {limits.guest} media files
          </span>
        </div>
        <div className="text-xs text-zinc-500 mt-2">
          You are uploading as:{" "}
          <span className="text-amber-400 font-medium">
            {isCreator ? "Creator" : "Guest"}
          </span>
        </div>
      </div>
    </div>
  );
};
