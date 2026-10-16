import React, { useState } from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * 1ST GRID ICON: Pomodoro Timer
 * File: PomodoroClockIcon.png
 */
export const PomodoroClockIcon: React.FC<IconProps> = ({ className = '', size = 96 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/PomodoroClockIcon.png"
        alt="Pomodoro Timer Clock"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block object-contain select-none drop-shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 22 52 L 42 66 L 36 78 L 52 84" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" />
      <line x1="38" y1="98" x2="24" y2="104" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="172" x2="42" y2="158" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      <path d="M 40 108 A 28 28 0 0 1 45 132 L 20 134 A 42 42 0 0 0 16 102 Z" fill="#facc15" stroke="#18181b" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 46 138 A 28 28 0 0 1 42 162 L 18 140 A 42 42 0 0 0 22 170 Z" fill="#facc15" stroke="#18181b" strokeWidth="3.5" strokeLinejoin="round" />

      <path d="M 178 52 L 158 66 L 164 78 L 148 84" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" />
      <line x1="162" y1="98" x2="176" y2="104" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      <line x1="170" y1="172" x2="158" y2="158" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      <path d="M 160 108 A 28 28 0 0 0 155 132 L 180 134 A 42 42 0 0 1 184 102 Z" fill="#facc15" stroke="#18181b" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 154 138 A 28 28 0 0 0 158 162 L 182 140 A 42 42 0 0 1 178 170 Z" fill="#facc15" stroke="#18181b" strokeWidth="3.5" strokeLinejoin="round" />

      <path d="M 66 160 L 52 184 L 68 184 L 78 164 Z" fill="#18181b" stroke="#18181b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 134 160 L 148 184 L 132 184 L 122 164 Z" fill="#18181b" stroke="#18181b" strokeWidth="3" strokeLinejoin="round" />

      <rect x="94" y="60" width="12" height="18" rx="3" fill="#18181b" />
      <path d="M 52 86 C 42 70 56 50 78 54 C 84 72 74 88 52 86 Z" fill="#60a5fa" stroke="#18181b" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 148 86 C 158 70 144 50 122 54 C 116 72 126 88 148 86 Z" fill="#60a5fa" stroke="#18181b" strokeWidth="4" strokeLinejoin="round" />

      <circle cx="100" cy="116" r="54" fill="#ef4444" stroke="#18181b" strokeWidth="4.5" />
      <circle cx="100" cy="116" r="42" fill="#67e8f9" stroke="#18181b" strokeWidth="3.5" />

      <circle cx="100" cy="84" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="118" cy="89" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="132" cy="103" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="137" cy="121" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="132" cy="139" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="118" cy="151" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="100" cy="156" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="82" cy="151" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="68" cy="139" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="63" cy="121" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="68" cy="103" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
      <circle cx="82" cy="89" r="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />

      <line x1="100" y1="116" x2="118" y2="140" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="116" x2="118" y2="140" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="116" x2="100" y2="92" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
      <line x1="100" y1="116" x2="100" y2="92" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="116" r="6" fill="#ef4444" stroke="#18181b" strokeWidth="3" />
    </svg>
  );
};

/**
 * 2ND GRID ICON: Task List (The Four Quadrants)
 * File: TaskCalendarIcon.png
 */
export const TaskCalendarIcon: React.FC<IconProps> = ({ className = '', size = 96 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/TaskCalendarIcon.png"
        alt="Task Calendar Matrix"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block object-contain select-none drop-shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="52" y="22" width="14" height="42" rx="7" fill="#ffffff" stroke="#09090b" strokeWidth="8" strokeLinecap="round" />
      <rect x="80" y="22" width="14" height="42" rx="7" fill="#ffffff" stroke="#09090b" strokeWidth="8" strokeLinecap="round" />
      <rect x="108" y="22" width="14" height="42" rx="7" fill="#ffffff" stroke="#09090b" strokeWidth="8" strokeLinecap="round" />
      <rect x="136" y="22" width="14" height="42" rx="7" fill="#ffffff" stroke="#09090b" strokeWidth="8" strokeLinecap="round" />

      <rect x="36" y="44" width="128" height="136" rx="28" fill="#09090b" />
      <rect x="46" y="96" width="108" height="74" rx="8" fill="#ffffff" />

      <g stroke="#09090b" strokeWidth="4">
        <line x1="46" y1="120" x2="154" y2="120" />
        <line x1="46" y1="145" x2="154" y2="145" />
        <line x1="68" y1="96" x2="68" y2="170" />
        <line x1="90" y1="96" x2="90" y2="170" />
        <line x1="112" y1="96" x2="112" y2="170" />
        <line x1="134" y1="96" x2="134" y2="170" />
      </g>

      <path
        d="M 104 128 L 122 148 L 158 106"
        stroke="#ef4444"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * 3RD GRID ICON: Journal Entry
 * File: JournalPenIcon.png
 */
export const JournalPenIcon: React.FC<IconProps> = ({ className = '', size = 96 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/JournalPenIcon.png"
        alt="Journal Writing"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block object-contain select-none drop-shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 52 20
           L 126 20
           C 128 20 130 22 130 24
           L 130 166
           C 130 168 128 170 126 170
           L 52 170
           C 50 170 48 168 48 166
           L 48 156 A 8 8 0 0 0 48 140
           L 48 132 A 8 8 0 0 0 48 116
           L 48 108 A 8 8 0 0 0 48 92
           L 48 84 A 8 8 0 0 0 48 68
           L 48 60 A 8 8 0 0 0 48 44
           L 48 36 A 8 8 0 0 0 48 20
           Z"
        fill="#f1f5f9"
        stroke="#09090b"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <line x1="68" y1="52" x2="114" y2="52" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="88" x2="110" y2="88" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="126" x2="110" y2="126" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />

      <rect x="116" y="166" width="62" height="30" rx="4" fill="#60a5fa" stroke="#09090b" strokeWidth="7" />
      <rect x="122" y="152" width="50" height="14" rx="2" fill="#f43f5e" stroke="#09090b" strokeWidth="6" />

      <path
        d="M 124 152
           C 114 128 104 104 96 90
           C 90 80 102 68 114 74
           L 156 104
           C 166 112 172 128 170 152
           Z"
        fill="#fbcfe8"
        stroke="#09090b"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />
      <path
        d="M 108 92
           C 102 96 98 106 104 116
           C 112 124 122 124 132 118
           Z"
        fill="#fbcfe8"
        stroke="#09090b"
        strokeWidth="6"
      />

      <g transform="rotate(-38 120 85)">
        <rect x="110" y="44" width="16" height="58" rx="5" fill="#3b82f6" stroke="#09090b" strokeWidth="6" />
        <rect x="110" y="34" width="16" height="12" rx="4" fill="#ec4899" stroke="#09090b" strokeWidth="5" />
        <polygon points="110,102 126,102 118,118" fill="#1e1b4b" stroke="#09090b" strokeWidth="5" strokeLinejoin="round" />
        <line x1="118" y1="118" x2="118" y2="128" stroke="#09090b" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/**
 * 4TH GRID ICON: Relaxing Music
 * File: RelaxingSoundIcon.png
 */
export const RelaxingSoundIcon: React.FC<IconProps> = ({ className = '', size = 96 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/RelaxingSoundIcon.png"
        alt="Relaxing Soundscape"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block object-contain select-none drop-shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="72" fill="#cffafe" stroke="#09090b" strokeWidth="2.5" />
      <path d="M 38 138 C 65 165 135 165 162 138 Z" fill="#86efac" />
      <line x1="36" y1="138" x2="164" y2="138" stroke="#09090b" strokeWidth="4" strokeLinecap="round" />

      <g transform="translate(24, 32)">
        <ellipse cx="8" cy="24" rx="6" ry="5" fill="#f43f5e" stroke="#09090b" strokeWidth="3" transform="rotate(-20 8 24)" />
        <ellipse cx="26" cy="20" rx="6" ry="5" fill="#f43f5e" stroke="#09090b" strokeWidth="3" transform="rotate(-20 26 20)" />
        <line x1="12" y1="22" x2="12" y2="4" stroke="#09090b" strokeWidth="3.5" />
        <line x1="30" y1="18" x2="30" y2="0" stroke="#09090b" strokeWidth="3.5" />
        <line x1="10" y1="4" x2="32" y2="0" stroke="#09090b" strokeWidth="4" />
      </g>
      <g transform="translate(122, 24)">
        <ellipse cx="14" cy="22" rx="6" ry="5" fill="#f59e0b" stroke="#09090b" strokeWidth="3" transform="rotate(-20 14 22)" />
        <line x1="18" y1="20" x2="18" y2="2" stroke="#09090b" strokeWidth="3.5" />
        <path d="M 18 2 C 26 4 28 10 24 16" stroke="#09090b" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g transform="translate(136, 52)">
        <ellipse cx="8" cy="22" rx="6" ry="5" fill="#f43f5e" stroke="#09090b" strokeWidth="3" transform="rotate(-20 8 22)" />
        <ellipse cx="24" cy="18" rx="6" ry="5" fill="#f43f5e" stroke="#09090b" strokeWidth="3" transform="rotate(-20 24 18)" />
        <line x1="12" y1="20" x2="12" y2="4" stroke="#09090b" strokeWidth="3.5" />
        <line x1="28" y1="16" x2="28" y2="0" stroke="#09090b" strokeWidth="3.5" />
        <line x1="10" y1="4" x2="30" y2="0" stroke="#09090b" strokeWidth="4" />
      </g>
      <g transform="translate(24, 86)">
        <ellipse cx="8" cy="18" rx="6" ry="5" fill="#84cc16" stroke="#09090b" strokeWidth="3" transform="rotate(-20 8 18)" />
        <line x1="12" y1="16" x2="12" y2="2" stroke="#09090b" strokeWidth="3.5" />
        <line x1="12" y1="2" x2="18" y2="2" stroke="#09090b" strokeWidth="3.5" />
      </g>
      <g transform="translate(148, 98)">
        <ellipse cx="10" cy="14" rx="6" ry="5" fill="#18181b" stroke="#09090b" strokeWidth="3" transform="rotate(-20 10 14)" />
        <line x1="14" y1="12" x2="14" y2="26" stroke="#09090b" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      <circle cx="100" cy="72" r="14" fill="#fed7aa" stroke="#09090b" strokeWidth="4" />
      <path d="M 86 72 A 16 16 0 0 1 114 72" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <rect x="80" y="66" width="6" height="12" rx="3" fill="#cbd5e1" stroke="#09090b" strokeWidth="2.5" />
      <rect x="114" y="66" width="6" height="12" rx="3" fill="#cbd5e1" stroke="#09090b" strokeWidth="2.5" />

      <path
        d="M 94 86
           C 86 88 64 98 48 120
           C 44 126 50 132 58 128
           C 72 120 86 112 90 128
           L 100 134
           L 110 128
           C 114 112 128 120 142 128
           C 150 132 156 126 152 120
           C 136 98 114 88 106 86
           Z"
        fill="#fed7aa"
        stroke="#09090b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 76 136
           C 66 142 66 152 82 152
           C 94 152 106 146 118 152
           C 134 152 134 142 124 136
           Z"
        fill="#fed7aa"
        stroke="#09090b"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 100 118
           C 94 112 86 104 86 96
           C 86 90 92 86 97 90
           L 100 93
           L 103 90
           C 108 86 114 90 114 96
           C 114 104 106 112 100 118
           Z"
        fill="#38bdf8"
        stroke="#09090b"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * 5TH GRID ICON: Breathing Exercise
 * File: BreathingFaceIcon.png
 */
export const BreathingFaceIcon: React.FC<IconProps> = ({ className = '', size = 96 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/BreathingFaceIcon.png"
        alt="Breathing Exercise"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`inline-block object-contain select-none drop-shadow-xs ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="88" fill="#121118" />
      <path
        d="M 76 36
           C 82 50 86 64 82 74
           C 92 84 104 90 102 96
           C 98 100 92 100 90 103
           C 94 105 98 107 94 113
           C 90 117 84 117 84 122
           C 84 130 92 136 86 144
           C 78 154 58 158 54 164"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 66 148 C 66 160 62 168 54 172"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 104 106
           L 138 106
           C 146 106 150 98 144 92"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 108 116
           L 148 116"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 116 126
           L 142 126
           C 152 126 156 136 148 142"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
