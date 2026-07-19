import React from 'react';

/* ===== Shared SVG defs — hoisted to avoid filter ID collisions ===== */
/** Render this once at the page level (e.g. in LandingPage). */
export function ClayIconDefs() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* Soft drop shadows */}
        <filter id="clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={4} stdDeviation={5} floodColor="#000" floodOpacity={0.35} />
        </filter>
        <filter id="clay-shadow-light" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx={0} dy={3} stdDeviation={4} floodColor="#000" floodOpacity={0.25} />
        </filter>
        <filter id="clay-shadow-deep" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx={0} dy={6} stdDeviation={8} floodColor="#000" floodOpacity={0.4} />
        </filter>

        {/* Glossy specular highlight — off-center top-left */}
        <radialGradient id="gloss" cx="30%" cy="30%" r="60%" fx="25%" fy="25%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="50%" stopColor="#fff" stopOpacity={0.08} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>

        {/* Edge rim light */}
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
          <stop offset="40%" stopColor="#fff" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.15} />
        </linearGradient>

        {/* Clay base colors — radial gradient for 3D volume */}
        <radialGradient id="clay-blue" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>
        <radialGradient id="clay-purple" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="70%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
        <radialGradient id="clay-teal" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="70%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </radialGradient>
        <radialGradient id="clay-cyan" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="70%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </radialGradient>
        <radialGradient id="clay-green" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="70%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
        <radialGradient id="clay-orange" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="70%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="clay-indigo" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </radialGradient>
        <radialGradient id="clay-gold" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <radialGradient id="clay-navy" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="70%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <radialGradient id="clay-cream" cx="35%" cy="30%" r="70%" fx="28%" fy="25%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="70%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* Helper: wraps icon in a centered clay-style SVG */
function ClaySvgWrapper({ children, size = 120 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {children}
    </svg>
  );
}

/* ===== ICON COMPONENTS ===== */

/** Use Case — stick figure + oval speech bubble (blue/white) */
export function IconUseCase({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Speech bubble — glossy blue oval */}
      <ellipse cx="76" cy="54" rx="30" ry="22" fill="url(#clay-blue)" filter="url(#clay-shadow)" />
      <ellipse cx="76" cy="54" rx="30" ry="22" fill="url(#gloss)" />
      <ellipse cx="76" cy="54" rx="30" ry="22" fill="none" stroke="url(#rim)" strokeWidth={1} />
      {/* Speech bubble tail */}
      <path d="M58 68 L50 82 L66 72" fill="url(#clay-blue)" filter="url(#clay-shadow-light)" />
      <path d="M58 68 L50 82 L66 72" fill="url(#gloss)" />

      {/* Stick figure — white clay */}
      {/* Head */}
      <circle cx="32" cy="38" r="9" fill="#f1f5f9" filter="url(#clay-shadow-light)" />
      <circle cx="32" cy="38" r="9" fill="url(#gloss)" />
      {/* Body */}
      <line x1="32" y1="47" x2="32" y2="70" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" filter="url(#clay-shadow-light)" />
      {/* Arms */}
      <line x1="32" y1="54" x2="16" y2="62" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="32" y1="54" x2="48" y2="62" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
      {/* Legs */}
      <line x1="32" y1="70" x2="20" y2="88" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="32" y1="70" x2="44" y2="88" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
    </ClaySvgWrapper>
  );
}

/** Class/Object — stacked blocks with one floating (purple/teal) */
export function IconClassObject({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Bottom block (purple) */}
      <rect x="30" y="62" width="54" height="24" rx="6" fill="url(#clay-purple)" filter="url(#clay-shadow)" />
      {/* Block detail lines */}
      <line x1="30" y1="74" x2="84" y2="74" stroke="#6D28D9" strokeWidth="1" opacity={0.4} />
      {/* Middle block (purple) */}
      <rect x="34" y="40" width="50" height="22" rx="6" fill="url(#clay-purple)" filter="url(#clay-shadow)" />
      <line x1="34" y1="51" x2="84" y2="51" stroke="#6D28D9" strokeWidth="1" opacity={0.4} />
      {/* Top floating block (teal) — slightly offset and elevated */}
      <rect x="42" y="14" width="46" height="22" rx="6" fill="url(#clay-teal)" filter="url(#clay-shadow-deep)" />
      <line x1="42" y1="25" x2="88" y2="25" stroke="#0D9488" strokeWidth="1" opacity={0.4} />
      {/* Floating shadow spot on top block */}
      <rect x="42" y="14" width="46" height="22" rx="6" fill="url(#gloss)" />
      <rect x="30" y="62" width="54" height="24" rx="6" fill="url(#gloss)" />
      <rect x="34" y="40" width="50" height="22" rx="6" fill="url(#gloss)" />
    </ClaySvgWrapper>
  );
}

/** BCE — shield + database cylinder + gear (cyan/green/orange) */
export function IconBCE({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Shield / Boundary (cyan) */}
      <g filter="url(#clay-shadow)">
        <path d="M16 28 L33 22 L50 28 L50 52 C50 62 33 74 33 74 C33 74 16 62 16 52 Z" fill="url(#clay-cyan)" />
        <path d="M16 28 L33 22 L50 28 L50 52 C50 62 33 74 33 74 C33 74 16 62 16 52 Z" fill="url(#gloss)" />
        <path d="M33 22 L33 74" stroke="#0891B2" strokeWidth="1.5" opacity={0.4} />
        <path d="M16 28 L33 22 L50 28" stroke="url(#rim)" strokeWidth={0.8} fill="none" />
      </g>

      {/* Database cylinder / Entity (green) */}
      <g filter="url(#clay-shadow)">
        <ellipse cx="65" cy="32" rx="14" ry="7" fill="url(#clay-green)" />
        <rect x="51" y="32" width="28" height="32" rx="0" fill="url(#clay-green)" />
        <ellipse cx="65" cy="64" rx="14" ry="7" fill="url(#clay-green)" />
        {/* Cylinder ridges */}
        <line x1="51" y1="42" x2="79" y2="42" stroke="#047857" strokeWidth="1" opacity={0.3} />
        <line x1="51" y1="52" x2="79" y2="52" stroke="#047857" strokeWidth="1" opacity={0.3} />
        {/* Gloss */}
        <rect x="51" y="32" width="28" height="32" fill="url(#gloss)" />
        <ellipse cx="65" cy="32" rx="14" ry="7" fill="url(#gloss)" />
      </g>

      {/* Gear / Control (orange) */}
      <g filter="url(#clay-shadow)" transform="translate(88, 44)">
        {/* Gear teeth */}
        {[0, 45, 90, 135].map((angle) => (
          <rect
            key={angle}
            x={-3}
            y={-14}
            width={6}
            height={10}
            rx={1.5}
            fill="url(#clay-orange)"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Gear body */}
        <circle cx="0" cy="0" r="11" fill="url(#clay-orange)" />
        <circle cx="0" cy="0" r="11" fill="url(#gloss)" />
        {/* Center hole */}
        <circle cx="0" cy="0" r="4" fill="#0c0d0e" opacity={0.6} />
        <circle cx="0" cy="0" r="4" fill="none" stroke="#C2410C" strokeWidth="0.5" opacity={0.5} />
      </g>
    </ClaySvgWrapper>
  );
}

/** Sequence Diagram — two rounded rect nodes + curved arrow (indigo/white) */
export function IconSequence({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Left node */}
      <g filter="url(#clay-shadow)">
        <rect x="12" y="30" width="28" height="22" rx="8" fill="url(#clay-indigo)" />
        <rect x="12" y="30" width="28" height="22" rx="8" fill="url(#gloss)" />
        {/* Life line */}
        <line x1="26" y1="52" x2="26" y2="88" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" opacity={0.6} />
      </g>

      {/* Right node */}
      <g filter="url(#clay-shadow)">
        <rect x="80" y="30" width="28" height="22" rx="8" fill="url(#clay-indigo)" />
        <rect x="80" y="30" width="28" height="22" rx="8" fill="url(#gloss)" />
        {/* Life line */}
        <line x1="94" y1="52" x2="94" y2="88" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" opacity={0.6} />
      </g>

      {/* Arrow from left to right */}
      <g filter="url(#clay-shadow-light)">
        <path
          d="M44 48 C58 48 56 38 70 38 L80 38"
          stroke="#818CF8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M74 32 L82 38 L74 44" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Arrow gloss */}
        <path
          d="M44 48 C58 48 56 38 70 38 L80 38"
          stroke="#fff"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity={0.3}
        />
      </g>
    </ClaySvgWrapper>
  );
}

/** Layered Architecture — 3 stacked rounded plates (gradient purple to blue) */
export function IconLayered({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Bottom plate (darkest purple-blue) */}
      <g filter="url(#clay-shadow)">
        <rect x="16" y="70" width="88" height="20" rx="10" fill="url(#clay-indigo)" />
        <rect x="16" y="70" width="88" height="20" rx="10" fill="url(#gloss)" />
        <rect x="16" y="70" width="88" height="20" rx="10" fill="none" stroke="url(#rim)" strokeWidth={0.8} />
      </g>

      {/* Middle plate (purple) */}
      <g filter="url(#clay-shadow)">
        <rect x="22" y="44" width="76" height="20" rx="10" fill="url(#clay-purple)" />
        <rect x="22" y="44" width="76" height="20" rx="10" fill="url(#gloss)" />
        <rect x="22" y="44" width="76" height="20" rx="10" fill="none" stroke="url(#rim)" strokeWidth={0.8} />
      </g>

      {/* Top plate (lightest) */}
      <g filter="url(#clay-shadow-deep)">
        <rect x="28" y="18" width="64" height="20" rx="10" fill="url(#clay-teal)" />
        <rect x="28" y="18" width="64" height="20" rx="10" fill="url(#gloss)" />
        <rect x="28" y="18" width="64" height="20" rx="10" fill="none" stroke="url(#rim)" strokeWidth={0.8} />
      </g>
    </ClaySvgWrapper>
  );
}

/** Design Patterns — two puzzle pieces interlocking (orange/cream) */
export function IconDesignPatterns({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Left puzzle piece (cream) */}
      <g filter="url(#clay-shadow)">
        <path
          d="M14 42
             C14 28 24 20 38 20
             L38 28
             C34 28 30 32 30 36
             C30 40 34 44 38 44
             L38 52
             L52 52
             L52 74
             C52 84 44 90 34 90
             C24 90 16 84 16 74
             L16 48
             C16 46 14 44 14 42 Z"
          fill="url(#clay-cream)"
        />
        <path
          d="M14 42
             C14 28 24 20 38 20
             L38 28
             C34 28 30 32 30 36
             C30 40 34 44 38 44
             L38 52
             L52 52
             L52 74
             C52 84 44 90 34 90
             C24 90 16 84 16 74
             L16 48
             C16 46 14 44 14 42 Z"
          fill="url(#gloss)"
        />
      </g>

      {/* Right puzzle piece (orange) */}
      <g filter="url(#clay-shadow)">
        <path
          d="M106 66
             C106 80 96 90 82 90
             L82 82
             C86 82 90 78 90 74
             C90 70 86 66 82 66
             L82 56
             L68 56
             L68 36
             C68 26 76 20 86 20
             C96 20 104 26 104 36
             L104 60
             C104 62 106 64 106 66 Z"
          fill="url(#clay-orange)"
        />
        <path
          d="M106 66
             C106 80 96 90 82 90
             L82 82
             C86 82 90 78 90 74
             C90 70 86 66 82 66
             L82 56
             L68 56
             L68 36
             C68 26 76 20 86 20
             C96 20 104 26 104 36
             L104 60
             C104 62 106 64 106 66 Z"
          fill="url(#gloss)"
        />
      </g>
    </ClaySvgWrapper>
  );
}

/** Microservices — connected circular nodes (indigo/cyan) */
export function IconMicroservices({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Connection lines */}
      <line x1="34" y1="38" x2="60" y2="28" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="34" y1="38" x2="30" y2="64" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="60" y1="28" x2="90" y2="40" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="60" y1="28" x2="70" y2="66" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="90" y1="40" x2="70" y2="66" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="30" y1="64" x2="70" y2="66" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="90" y1="40" x2="96" y2="66" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <line x1="70" y1="66" x2="96" y2="66" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />

      {/* Nodes */}
      {[
        { cx: 34, cy: 38 },
        { cx: 60, cy: 28 },
        { cx: 90, cy: 40 },
        { cx: 30, cy: 64 },
        { cx: 70, cy: 66 },
        { cx: 96, cy: 66 },
      ].map((n, i) => (
        <g key={i} filter="url(#clay-shadow-light)">
          <circle cx={n.cx} cy={n.cy} r={i % 2 === 0 ? 9 : 7} fill={i % 2 === 0 ? "url(#clay-indigo)" : "url(#clay-cyan)"} />
          <circle cx={n.cx} cy={n.cy} r={i % 2 === 0 ? 9 : 7} fill="url(#gloss)" />
        </g>
      ))}
    </ClaySvgWrapper>
  );
}

/** Database — classic cylinder (green/white) */
export function IconDatabase({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      <g filter="url(#clay-shadow-deep)">
        {/* Cylinder body */}
        <rect x="26" y="36" width="68" height="50" rx="0" fill="url(#clay-green)" />
        <rect x="26" y="36" width="68" height="50" fill="url(#gloss)" />
        {/* Horizontal ridges */}
        <line x1="26" y1="48" x2="94" y2="48" stroke="#047857" strokeWidth="1.5" opacity={0.25} />
        <line x1="26" y1="58" x2="94" y2="58" stroke="#047857" strokeWidth="1.5" opacity={0.25} />
        <line x1="26" y1="68" x2="94" y2="68" stroke="#047857" strokeWidth="1.5" opacity={0.25} />
        <line x1="26" y1="78" x2="94" y2="78" stroke="#047857" strokeWidth="1.5" opacity={0.25} />
        {/* Top ellipse */}
        <ellipse cx="60" cy="36" rx="34" ry="12" fill="url(#clay-green)" />
        <ellipse cx="60" cy="36" rx="34" ry="12" fill="url(#gloss)" />
        {/* Bottom ellipse */}
        <ellipse cx="60" cy="86" rx="34" ry="12" fill="url(#clay-green)" />
        {/* Rim highlight on bottom */}
        <ellipse cx="60" cy="86" rx="34" ry="12" fill="none" stroke="#34D399" strokeWidth={0.8} opacity={0.3} />
      </g>
    </ClaySvgWrapper>
  );
}

/** Quality Attributes / Trade-off — balance scale (gold/navy) */
export function IconQuality({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Base */}
      <g filter="url(#clay-shadow)">
        {/* Base triangle */}
        <path d="M44 90 L76 90 L68 76 L52 76 Z" fill="url(#clay-navy)" />
        {/* Center pillar */}
        <rect x="57" y="30" width="6" height="46" rx="3" fill="url(#clay-gold)" />
        <rect x="57" y="30" width="6" height="46" rx="3" fill="url(#gloss)" />
        {/* Beam */}
        <rect x="14" y="28" width="92" height="8" rx="4" fill="url(#clay-gold)" />
        <rect x="14" y="28" width="92" height="8" rx="4" fill="url(#gloss)" />

        {/* Left pan */}
        <path d="M18 36 L22 68 C22 72 26 76 30 76 L36 76 C40 76 42 72 42 68 L38 36" fill="url(#clay-navy)" />
        {/* Left chain */}
        <line x1="24" y1="36" x2="24" y2="58" stroke="#F59E0B" strokeWidth="2" />
        <line x1="36" y1="36" x2="36" y2="58" stroke="#F59E0B" strokeWidth="2" />
        {/* Left pan content — circle */}
        <circle cx="30" cy="66" r="5" fill="url(#clay-gold)" />

        {/* Right pan — tilted down to show trade-off */}
        <path d="M82 36 L78 72 C78 76 74 80 70 80 L64 80 C60 80 58 76 58 72 L62 36" fill="url(#clay-navy)" />
        {/* Right chain */}
        <line x1="72" y1="36" x2="72" y2="62" stroke="#F59E0B" strokeWidth="2" />
        <line x1="60" y1="36" x2="60" y2="62" stroke="#F59E0B" strokeWidth="2" />
        {/* Right pan content — square (different) */}
        <rect x="65" y="66" width="8" height="8" rx="1.5" fill="url(#clay-gold)" />
      </g>
    </ClaySvgWrapper>
  );
}

/** Testing/QA — magnifying glass over checkmark (blue/green) */
export function IconTesting({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Magnifying glass */}
      <g filter="url(#clay-shadow-deep)">
        {/* Handle */}
        <rect
          x="74"
          y="74"
          width="8"
          height="34"
          rx="4"
          fill="url(#clay-blue)"
          transform="rotate(45 78 91)"
        />
        <rect
          x="74"
          y="74"
          width="8"
          height="34"
          rx="4"
          fill="url(#gloss)"
          transform="rotate(45 78 91)"
        />
        {/* Rim */}
        <circle cx="34" cy="34" r="27" fill="none" stroke="url(#clay-blue)" strokeWidth="8" filter="url(#clay-shadow)" />
        <circle cx="34" cy="34" r="27" fill="none" stroke="url(#gloss)" strokeWidth="8" />
        {/* Glass area */}
        <circle cx="34" cy="34" r="23" fill="#0EA5E9" opacity={0.15} />
      </g>

      {/* Checkmark inside */}
      <g filter="url(#clay-shadow-light)">
        <path
          d="M20 36 L30 46 L48 24"
          stroke="url(#clay-green)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 36 L30 46 L48 24"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={0.4}
        />
      </g>
    </ClaySvgWrapper>
  );
}

/** DevOps/CI-CD — infinity loop + gear (teal/orange) */
export function IconDevOps({ size }: { size?: number }) {
  return (
    <ClaySvgWrapper size={size}>
      {/* Infinity loop */}
      <g filter="url(#clay-shadow)">
        <path
          d="M34 50
             C34 32 52 22 60 30
             C68 22 86 32 86 50
             C86 68 68 78 60 70
             C52 78 34 68 34 50 Z"
          fill="none"
          stroke="url(#clay-teal)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M34 50
             C34 32 52 22 60 30
             C68 22 86 32 86 50
             C86 68 68 78 60 70
             C52 78 34 68 34 50 Z"
          fill="none"
          stroke="url(#gloss)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.4}
        />
      </g>

      {/* Gear (orange) — overlapping the center of infinity */}
      <g filter="url(#clay-shadow)" transform="translate(60, 50)">
        {/* Gear teeth */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <rect
            key={angle}
            x={-3}
            y={-12}
            width={6}
            height={8}
            rx={1.5}
            fill="url(#clay-orange)"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Gear body */}
        <circle cx="0" cy="0" r="9" fill="url(#clay-orange)" />
        <circle cx="0" cy="0" r="9" fill="url(#gloss)" />
        {/* Center hole */}
        <circle cx="0" cy="0" r="3" fill="#0c0d0e" opacity={0.5} />
      </g>
    </ClaySvgWrapper>
  );
}

/* ===== MAP OF ALL TOPICS ===== */

export interface TopicIconInfo {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  component: React.FC<{ size?: number }>;
  color: string;
}

export const TOPIC_ICONS: TopicIconInfo[] = [
  {
    id: 'use-case',
    label: 'Use Case',
    labelEn: 'Use Case Diagram',
    description: 'Phân tích yêu cầu qua kịch bản tương tác',
    component: IconUseCase,
    color: '#0EA5E9',
  },
  {
    id: 'class-object',
    label: 'Class & Object',
    labelEn: 'Class/Object',
    description: 'Cấu trúc tĩnh và quan hệ giữa các lớp',
    component: IconClassObject,
    color: '#8B5CF6',
  },
  {
    id: 'bce',
    label: 'BCE Pattern',
    labelEn: 'Boundary–Entity–Control',
    description: 'Phân tách ranh giới, thực thể và điều khiển',
    component: IconBCE,
    color: '#06B6D4',
  },
  {
    id: 'sequence',
    label: 'Sequence Diagram',
    labelEn: 'Sequence Diagram',
    description: 'Tương tác động giữa các đối tượng theo thời gian',
    component: IconSequence,
    color: '#6366F1',
  },
  {
    id: 'layered',
    label: 'Layered Architecture',
    labelEn: 'Layered Architecture',
    description: 'Kiến trúc phân tầng — tách biệt mối quan tâm',
    component: IconLayered,
    color: '#8B5CF6',
  },
  {
    id: 'design-patterns',
    label: 'Design Patterns',
    labelEn: 'Design Patterns',
    description: 'Giải pháp tái sử dụng cho vấn đề thiết kế',
    component: IconDesignPatterns,
    color: '#F97316',
  },
  {
    id: 'microservices',
    label: 'Microservices',
    labelEn: 'Microservices',
    description: 'Kiến trúc hướng dịch vụ phân tán',
    component: IconMicroservices,
    color: '#6366F1',
  },
  {
    id: 'database',
    label: 'Database & RDS',
    labelEn: 'Database/RDS',
    description: 'Thiết kế lưu trữ và truy xuất dữ liệu',
    component: IconDatabase,
    color: '#10B981',
  },
  {
    id: 'quality',
    label: 'Quality Attributes',
    labelEn: 'Quality Attributes',
    description: 'Đánh đổi — cân bằng chất lượng phần mềm',
    component: IconQuality,
    color: '#F59E0B',
  },
  {
    id: 'testing',
    label: 'Testing & QA',
    labelEn: 'Testing/QA',
    description: 'Kiểm thử và đảm bảo chất lượng',
    component: IconTesting,
    color: '#3B82F6',
  },
  {
    id: 'devops',
    label: 'DevOps & CI/CD',
    labelEn: 'DevOps/CI-CD',
    description: 'Tích hợp liên tục — triển khai tự động',
    component: IconDevOps,
    color: '#14B8A6',
  },
];
