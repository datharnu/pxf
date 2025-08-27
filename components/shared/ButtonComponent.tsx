import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: () => void;
  withIcon?: boolean;
  icon?: React.ReactNode;
}

export default function ButtonComponent({
  onClick,
  title,
  icon,
  withIcon,
  ...props
}: Props) {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`p-2 w-full rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed group ${
        props.className
      } ${withIcon ? "flex gap-2 items-center justify-center" : ""}`}
    >
      {title}
      {withIcon && icon}
    </button>
  );
}
