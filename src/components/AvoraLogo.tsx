import React, { useState } from 'react';

interface AvoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const AvoraLogo: React.FC<AvoraLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true
}) => {
  const [imgError, setImgError] = useState(false);

  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';
  const width = isSm ? 120 : isMd ? 170 : isLg ? 260 : 360;
  const height = showTagline 
    ? (isSm ? 54 : isMd ? 75 : isLg ? 115 : 155) 
    : (isSm ? 36 : isMd ? 52 : isLg ? 80 : 110);

  // If AvoraLogo.png exists in public/ or root, render the actual image file
  if (!imgError) {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src="/AvoraLogo.png"
          alt="Avora - Focus your time. Find your balance."
          style={{ width: `${width}px`, height: 'auto', maxHeight: `${height * 1.4}px` }}
          className="object-contain drop-shadow-xs"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Graceful fallback to crisp vector SVG
  return (
    <div className={`inline-flex flex-col items-center select-none text-[#201c2b] dark:text-[#ebeaf1] ${className}`}>
      <svg
        viewBox="0 0 500 240"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto max-w-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="goldOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cca153" />
            <stop offset="50%" stopColor="#e5c178" />
            <stop offset="100%" stopColor="#ba8a38" />
          </linearGradient>
          <filter id="goldShine" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ba8a38" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Golden Orbit Ring wrapping AV */}
        <path
          d="M 68 112 C 60 120 70 127 105 120 C 145 112 175 95 185 88"
          stroke="url(#goldOrbit)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#goldShine)"
          opacity="0.95"
        />

        {/* Letter A */}
        <path
          d="M 125 160 L 78 52 L 31 160 M 47 126 L 109 126"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Intersecting V */}
        <path
          d="M 92 70 L 136 178 L 180 70"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Golden Orbit Arc front part */}
        <path
          d="M 35 118 C 42 108 72 98 128 92"
          stroke="url(#goldOrbit)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="2 4"
          opacity="0.65"
        />

        {/* Letter O (Clock Face with orbital track) */}
        <g transform="translate(235, 115)">
          <line x1="0" y1="-32" x2="0" y2="-24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <line x1="0" y1="24" x2="0" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <line x1="-32" y1="0" x2="-24" y2="0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <line x1="-22" y1="-22" x2="-16" y2="-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <line x1="-22" y1="22" x2="-16" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

          <line x1="0" y1="0" x2="0" y2="-27" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-14" y2="-23" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
          <circle cx="0" cy="0" r="4" fill="currentColor" />

          <path
            d="M 4 -32 A 38 38 0 0 1 4 32"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M 4 -20 A 24 24 0 0 1 4 20"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          <circle cx="21" cy="-12" r="3.5" fill="currentColor" />
        </g>

        {/* Letter R */}
        <path
          d="M 288 160 L 288 68 L 332 68 C 348 68 358 78 358 92 C 358 106 348 116 332 116 L 288 116 M 326 116 L 358 160"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Letter A */}
        <path
          d="M 465 160 L 418 52 L 371 160 M 387 126 L 449 126"
          stroke="currentColor"
          strokeWidth="15"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Tagline */}
        {showTagline && (
          <text
            x="250"
            y="210"
            textAnchor="middle"
            fill="currentColor"
            fontSize="21"
            fontFamily="Outfit, sans-serif"
            fontWeight="300"
            letterSpacing="0.08em"
            opacity="0.85"
          >
            Focus your time. Find your balance.
          </text>
        )}
      </svg>
    </div>
  );
};
