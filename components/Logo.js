import React from 'react';

export default function Logo({ className = "", size = 32, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer stylized S - Synchronous */}
      <path
        d="M30 20C30 20 45 10 70 15C95 20 90 45 70 50C50 55 10 50 10 75C10 100 45 95 70 85"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* Inner accent representing 'Build' and 'Digital' sync */}
      <path
        d="M40 40C40 40 50 35 60 40C70 45 70 55 60 60C50 65 30 65 30 75"
        stroke="#F05E23"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Center dot - Focal point of synchronization */}
      <circle cx="50" cy="50" r="4" fill="#F05E23" />
    </svg>
  );
}
