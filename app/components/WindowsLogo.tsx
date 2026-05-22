export default function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Windows logo"
    >
      <defs>
        {/* Red (top-left) */}
        <linearGradient id="xp-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59a3f" />
          <stop offset="35%" stopColor="#e8721c" />
          <stop offset="70%" stopColor="#c8501a" />
          <stop offset="100%" stopColor="#8a2f16" />
        </linearGradient>
        {/* Green (top-right) */}
        <linearGradient id="xp-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b6e24a" />
          <stop offset="40%" stopColor="#8ec22b" />
          <stop offset="80%" stopColor="#5f8a1f" />
          <stop offset="100%" stopColor="#3f5a18" />
        </linearGradient>
        {/* Blue (bottom-left) */}
        <linearGradient id="xp-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ea8e8" />
          <stop offset="35%" stopColor="#3f6cc8" />
          <stop offset="75%" stopColor="#27408f" />
          <stop offset="100%" stopColor="#16265c" />
        </linearGradient>
        {/* Yellow (bottom-right) */}
        <linearGradient id="xp-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="40%" stopColor="#f1c12a" />
          <stop offset="80%" stopColor="#a07a17" />
          <stop offset="100%" stopColor="#5e4710" />
        </linearGradient>
        {/* Soft sheen */}
        <linearGradient id="xp-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="50%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="translate(20 10) skewX(-14) rotate(-6)">
        {/* Top-left red panel */}
        <path d="M5,8 C30,2 55,2 78,8 L72,72 C50,66 28,66 5,72 Z" fill="url(#xp-red)" />
        <path d="M5,8 C30,2 55,2 78,8 L75,26 C52,20 30,20 7,26 Z" fill="url(#xp-sheen)" />

        {/* Top-right green panel */}
        <path d="M88,8 C112,2 138,2 162,8 L158,70 C135,64 112,64 84,72 Z" fill="url(#xp-green)" />
        <path d="M88,8 C112,2 138,2 162,8 L160,26 C136,20 113,20 86,26 Z" fill="url(#xp-sheen)" />

        {/* Bottom-left blue panel */}
        <path d="M5,82 C28,76 50,76 72,82 L68,144 C46,138 25,138 5,144 Z" fill="url(#xp-blue)" />
        <path d="M5,82 C28,76 50,76 72,82 L70,100 C48,94 27,94 6,100 Z" fill="url(#xp-sheen)" />

        {/* Bottom-right yellow panel */}
        <path d="M84,82 C112,76 135,76 158,82 L154,144 C132,138 110,138 84,144 Z" fill="url(#xp-yellow)" />
        <path d="M84,82 C112,76 135,76 158,82 L156,100 C134,94 112,94 86,100 Z" fill="url(#xp-sheen)" />
      </g>
    </svg>
  );
}
