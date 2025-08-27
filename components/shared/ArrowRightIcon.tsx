import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  width?: string;
  height?: string;
}
export default function ArrowRightIcon({
  width = "24",
  height = "24",
  ...props
}: Props) {
  return (
    <svg
      width={width}
      {...props}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="arrowLeft-01">
        <path
          id="Vector"
          d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
