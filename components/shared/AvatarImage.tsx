"use client";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes
import { useFullnameStore } from "@/store/userStore";
import { UserIcon } from "lucide-react";

interface AvatarDisplayProps {
  avatarImage?: string | null;
  fullname?: string | null;
  width?: number;
  height?: number;
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarImage,
  fullname,
  width = 25,
  height = 10,
  className,
}) => {
  // If no image, use first letter of name or a default
  if (!avatarImage) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-blue-100 text-blue-600 rounded-full",
          className
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {fullname ? (
          <span className="text-sm font-bold">
            {fullname.charAt(0).toUpperCase()}
          </span>
        ) : (
          <UserIcon className="w-3/4 h-3/4 text-blue-400" />
        )}
      </div>
    );
  }

  // If image is available
  return (
    <Image
      src={avatarImage}
      alt={fullname ? `${fullname}'s avatar` : "User avatar"}
      width={width}
      height={height}
      className={cn("rounded-full object-cover", className)}
      onError={(e) => {
        // Fallback if image fails to load
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

// In your component
const ProfileAvatar = () => {
  //   const portraitImage = usePortraitImageStore((state) => state.portraitImage);
  const fullname = useFullnameStore((state) => state.fullname);
  // console.log("Fullname from AVatar:", fullname);
  //   console.log("Avatar:" + portraitImage);

  return (
    <AvatarDisplay
      fullname={fullname}
      className="w-[40px] h-[40px] object-cover"
      width={36}
      height={36}
    />
  );
};

export default ProfileAvatar;
