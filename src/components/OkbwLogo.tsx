import React from 'react';

interface OkbwLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  variant?: 'emblem' | 'full' | 'horizontal';
  showText?: boolean;
}

export const OkbwLogo: React.FC<OkbwLogoProps> = ({
  size = 'md',
  className = '',
  variant = 'horizontal',
  showText = true
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    custom: ''
  };

  const currentSizeClass = size !== 'custom' ? sizeMap[size] : '';

  // Clean SVG emblem
  const LogoEmblem = (
    <div className={`relative flex-shrink-0 ${currentSizeClass} ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle Container */}
        <circle 
          cx="250" 
          cy="250" 
          r="236" 
          className="stroke-[#0A2540] dark:stroke-slate-200" 
          strokeWidth="10" 
          fill="#FFFFFF" 
        />

        {/* Inner Symbols */}
        <g transform="translate(130, 110)">
          
          {/* Gear Element (Left) */}
          <g transform="translate(55, 65)">
            {/* Gear Body */}
            <path 
              d="M-12 -65 L12 -65 L10 -48 A52 52 0 0 1 34 -38 L50 -50 L65 -35 L53 -19 A52 52 0 0 1 58 10 L75 12 L75 38 L58 40 A52 52 0 0 1 34 68 L49 84 L34 99 L19 87 A52 52 0 0 1 -10 92 L-12 109 L-38 109 L-40 92 A52 52 0 0 1 -68 68 L-84 83 L-99 68 L-87 53 A52 52 0 0 1 -92 24 L-109 22 L-109 -4 L-92 -6 A52 52 0 0 1 -68 -34 L-83 -50 L-68 -65 L-53 -53 A52 52 0 0 1 -24 -58 L-22 -75 Z" 
              fill="#0A2540" 
            />
            
            {/* Gear Aperture Center Ring */}
            <circle cx="-15" cy="18" r="43" fill="#FFFFFF" />
            <circle cx="-15" cy="18" r="39" stroke="#0A2540" strokeWidth="4" fill="#0A2540" />
            
            {/* Aperture Blades */}
            <g transform="translate(-15, 18)">
              <path d="M0 -36 L22 -10 L12 0 L-10 -20 Z" fill="#0A2540" />
              <path d="M28 -12 L30 18 L15 15 L12 -6 Z" fill="#0A2540" />
              <path d="M25 18 L-2 34 L-4 18 L16 8 Z" fill="#0A2540" />
              <path d="M-8 32 L-34 12 L-20 6 L-2 20 Z" fill="#0A2540" />
              <path d="M-33 8 L-24 -24 L-12 -12 L-18 6 Z" fill="#0A2540" />
              <path d="M-18 -25 L12 -33 L8 -18 L-8 -15 Z" fill="#0A2540" />

              {/* Aperture Iris Center Eye (Orange) */}
              <circle cx="0" cy="0" r="23" fill="#FF5E14" />
              <circle cx="-5" cy="-5" r="7" fill="#FFFFFF" opacity="0.85" />
              <circle cx="4" cy="4" r="3" fill="#FFFFFF" opacity="0.6" />
            </g>
          </g>

          {/* Document / 'B' Monogram (Right) */}
          <g transform="translate(138, 2)">
            {/* Main 'B' Body */}
            <path 
              d="M 0 0 
                 L 42 0 
                 L 72 32 
                 L 72 48 
                 C 88 52, 98 66, 98 84 
                 C 98 100, 86 112, 70 116 
                 C 90 120, 102 136, 102 156 
                 C 102 180, 84 198, 56 198 
                 L 0 198 
                 Z" 
              fill="#0A2540" 
            />
            
            {/* Cutout top loop */}
            <path 
              d="M 18 20 
                 L 40 20 
                 L 60 42 
                 C 68 50, 74 62, 74 76 
                 C 74 92, 60 102, 42 102 
                 L 18 102 
                 Z" 
              fill="#FFFFFF" 
            />

            {/* Cutout bottom loop */}
            <path 
              d="M 18 118 
                 L 46 118 
                 C 66 118, 78 130, 78 152 
                 C 78 172, 64 180, 44 180 
                 L 18 180 
                 Z" 
              fill="#FFFFFF" 
            />

            {/* Folded Dog-Ear Top-Right Corner */}
            <path d="M 42 0 L 72 32 L 42 32 Z" fill="#FFFFFF" />
            <path d="M 42 0 L 42 32 L 72 32" stroke="#0A2540" strokeWidth="4.5" strokeLinejoin="round" fill="#FFFFFF" />
          </g>

        </g>

        {/* Okbw text inside circular badge */}
        <text 
          x="250" 
          y="375" 
          textAnchor="middle" 
          fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif" 
          fontSize="88" 
          fontWeight="900" 
          letterSpacing="-1.5" 
          fill="#0A2540"
        >
          Okbw
        </text>

        {/* Separator rule */}
        <line x1="95" y1="400" x2="405" y2="400" stroke="#0A2540" strokeWidth="3.5" strokeLinecap="round" />

        {/* Subtitle */}
        <text 
          x="250" 
          y="432" 
          textAnchor="middle" 
          fontFamily="'Plus Jakarta Sans', 'Outfit', sans-serif" 
          fontSize="20.5" 
          fontWeight="700" 
          letterSpacing="5" 
          fill="#0A2540"
        >
          BUREAUTIQUE ET DESIGN
        </text>
      </svg>
    </div>
  );

  if (variant === 'emblem' || !showText) {
    return LogoEmblem;
  }

  return (
    <div className="flex items-center space-x-3 select-none">
      {LogoEmblem}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className="font-black text-xl tracking-tight text-[#0A2540] dark:text-white font-['Outfit']">
              Okbw
            </span>
            <span className="font-bold text-sm text-[#FF5E14] tracking-wide">
              BUREAUTIQUE & DESIGN
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5">
            L'excellence documentaire, la créativité visuelle
          </span>
        </div>
      )}
    </div>
  );
};
