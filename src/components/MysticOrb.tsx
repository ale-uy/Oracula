'use client';

export default function MysticOrb() {
  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
      >
        {/* Silueta de la adivina */}
        <path
          d="M100 40 C80 40, 60 60, 60 90 C60 120, 80 150, 100 150 C120 150, 140 120, 140 90 C140 60, 120 40, 100 40"
          fill="#4C1D95"
          opacity="0.6"
          className="animate-float"
        />
        
        {/* Bola de cristal - base */}
        <ellipse
          cx="100"
          cy="140"
          rx="45"
          ry="15"
          fill="#8B5CF6"
          className="animate-pulse"
        />
        
        {/* Bola de cristal - esfera */}
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="url(#crystalGradient)"
          className="animate-glow"
        />
        
        {/* Destellos en la bola */}
        <circle
          cx="80"
          cy="80"
          r="8"
          fill="white"
          opacity="0.6"
          className="animate-twinkle"
        />
        <circle
          cx="115"
          cy="90"
          r="5"
          fill="white"
          opacity="0.4"
          className="animate-twinkle-delay"
        />
        <circle
          cx="95"
          cy="110"
          r="4"
          fill="white"
          opacity="0.5"
          className="animate-twinkle-delay-2"
        />
        
        {/* Ondas místicas */}
        <path
          d="M60 100 C80 90, 120 90, 140 100"
          stroke="#C4B5FD"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
          className="animate-wave"
        />
        <path
          d="M65 110 C85 100, 115 100, 135 110"
          stroke="#C4B5FD"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          className="animate-wave-delay"
        />
        
        {/* Gradientes y filtros */}
        <defs>
          <radialGradient id="crystalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
