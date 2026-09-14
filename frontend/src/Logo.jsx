import React from 'react';

export function LogoMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-mark ${className}`}
      aria-label="StudentControl Emblem"
    >
      <defs>
        <linearGradient id="scGradientPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563B9" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      
      {/* Background shield - sleek translucent rounded container with transparent background */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#scGradientPrimary)" />
      
      {/* Dynamic Graduation Cap Symbol */}
      <path
        d="M24 10L39 17.5L24 25L9 17.5L24 10Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M14 21.5V28.5C14 31.5 18.5 34 24 34C29.5 34 34 31.5 34 28.5V21.5L24 26.5L14 21.5Z"
        fill="white"
        fillOpacity="0.75"
      />
      {/* Tassel */}
      <path
        d="M36 19V27.5C36 28.3 35.3 29 34.5 29C33.7 29 33 28.3 33 27.5V19"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="33" cy="29.5" r="1.5" fill="#93C5FD" />

      {/* Verification Checkmark Emblem overlay */}
      <circle cx="35" cy="35" r="7" fill="#10B981" stroke="white" strokeWidth="2" />
      <path d="M32 35L34 37L38 33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = 36, variant = 'full', className = '', light = false }) {
  if (variant === 'mark') {
    return <LogoMark size={size} className={className} />;
  }

  const textColor = light ? '#FFFFFF' : '#1E293B';
  const subtextColor = light ? '#94A3B8' : '#64748B';

  return (
    <div className={`studentcontrol-logo ${variant} ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <LogoMark size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
        <span style={{ fontSize: size * 0.52, fontWeight: 800, letterSpacing: '-0.03em', color: textColor, fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          Student<span style={{ color: '#2563B9' }}>Control</span>
        </span>
        <span style={{ fontSize: size * 0.28, fontWeight: 600, color: subtextColor, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Gestão de Assiduidade
        </span>
      </div>
    </div>
  );
}
