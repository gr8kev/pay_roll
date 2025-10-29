import React from "react";

const NairaIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Vertical lines */}
    <path d="M6 20V4" />
    <path d="M18 20V4" />

    {/* Diagonal (cross bar) lines */}
    <path d="M6 10h12" />
    <path d="M6 14h12" />

    {/* Diagonal slant for N */}
    <path d="M6 4l12 16" />
  </svg>
);

export default NairaIcon;
