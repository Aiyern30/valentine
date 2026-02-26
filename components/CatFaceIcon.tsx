"use client";

import { CatType } from "@/types/cat";
import { BREED_CONFIGS } from "@/game/catBreeds";

function hexToCSS(hex: number): string {
  return "#" + hex.toString(16).padStart(6, "0");
}

interface CatFaceIconProps {
  type: CatType;
  size?: number;
}

/**
 * Renders a tiny SVG cat face using the breed's color config.
 * Shows head, ears, eyes, and nose in a compact icon.
 */
export default function CatFaceIcon({ type, size = 28 }: CatFaceIconProps) {
  const cfg = BREED_CONFIGS[type];
  const main = hexToCSS(cfg.mainColor);
  const ear = hexToCSS(cfg.earInner);
  const nose = hexToCSS(cfg.noseColor);
  const eye = hexToCSS(cfg.eyeColor);
  const pattern = hexToCSS(cfg.patternColor);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ears */}
      {cfg.isScottishFold ? (
        <>
          {/* Folded ears */}
          <polygon points="8,12 14,6 14,16" fill={main} />
          <polygon points="32,12 26,6 26,16" fill={main} />
          <line
            x1="10"
            y1="10"
            x2="13"
            y2="14"
            stroke={ear}
            strokeWidth="0.8"
            opacity="0.6"
          />
          <line
            x1="30"
            y1="10"
            x2="27"
            y2="14"
            stroke={ear}
            strokeWidth="0.8"
            opacity="0.6"
          />
        </>
      ) : cfg.isSphynx || cfg.isOriental ? (
        <>
          {/* Very large ears */}
          <polygon points="5,14 12,1 16,18" fill={main} />
          <polygon points="35,14 28,1 24,18" fill={main} />
          <polygon points="7,14 12,4 15,17" fill={ear} opacity="0.6" />
          <polygon points="33,14 28,4 25,17" fill={ear} opacity="0.6" />
        </>
      ) : cfg.isMaineCoon ? (
        <>
          {/* Tufted ears */}
          <polygon points="6,16 13,2 16,18" fill={main} />
          <polygon points="34,16 27,2 24,18" fill={main} />
          <polygon points="8,15 13,5 15,17" fill={ear} />
          <polygon points="32,15 27,5 25,17" fill={ear} />
          {/* Tufts */}
          <line
            x1="11"
            y1="2"
            x2="10"
            y2="-1"
            stroke={pattern}
            strokeWidth="1"
            opacity="0.7"
          />
          <line
            x1="29"
            y1="2"
            x2="30"
            y2="-1"
            stroke={pattern}
            strokeWidth="1"
            opacity="0.7"
          />
        </>
      ) : (
        <>
          {/* Normal ears */}
          <polygon points="7,16 13,3 16,18" fill={main} />
          <polygon points="33,16 27,3 24,18" fill={main} />
          <polygon points="9,15 13,6 15,17" fill={ear} />
          <polygon points="31,15 27,6 25,17" fill={ear} />
        </>
      )}

      {/* Pointed ear tips */}
      {cfg.hasPointedPattern && !cfg.isScottishFold && (
        <>
          <polygon points="8,14 13,3 14,10" fill={pattern} opacity="0.7" />
          <polygon points="32,14 27,3 26,10" fill={pattern} opacity="0.7" />
        </>
      )}

      {/* Head */}
      <circle
        cx="20"
        cy="22"
        r={cfg.isPersian ? 15 : cfg.isOriental ? 13 : 14}
        fill={main}
      />

      {/* Persian fluffy cheeks */}
      {cfg.isPersian && (
        <>
          <circle cx="12" cy="24" r="5" fill={pattern} opacity="0.3" />
          <circle cx="28" cy="24" r="5" fill={pattern} opacity="0.3" />
        </>
      )}

      {/* Pointed face mask */}
      {cfg.hasPointedPattern && (
        <ellipse
          cx="20"
          cy="24"
          rx="10"
          ry="8"
          fill={pattern}
          opacity={cfg.isPersian ? 0.7 : 0.9}
        />
      )}

      {/* Sphynx wrinkles */}
      {cfg.isSphynx && (
        <>
          <line
            x1="14"
            y1="16"
            x2="26"
            y2="16"
            stroke="#d0b098"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <line
            x1="15"
            y1="18"
            x2="25"
            y2="18"
            stroke="#d0b098"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </>
      )}

      {/* Calico patches */}
      {type === "calico" && (
        <>
          <circle cx="14" cy="22" r="5" fill="#ff9933" />
          <circle cx="26" cy="20" r="4" fill="#333333" />
        </>
      )}

      {/* Stripes */}
      {cfg.hasStripes && (
        <>
          <ellipse
            cx="15"
            cy="22"
            rx="1.5"
            ry="5"
            fill={pattern}
            opacity="0.5"
          />
          <ellipse
            cx="20"
            cy="22"
            rx="1.5"
            ry="5"
            fill={pattern}
            opacity="0.5"
          />
          <ellipse
            cx="25"
            cy="22"
            rx="1.5"
            ry="5"
            fill={pattern}
            opacity="0.5"
          />
        </>
      )}

      {/* Eyes */}
      {cfg.openEyes || cfg.isSphynx ? (
        <>
          {/* Open eyes */}
          <circle cx="15" cy="21" r="3" fill="white" />
          <circle cx="25" cy="21" r="3" fill="white" />
          <circle cx="15" cy="21" r="1.8" fill={eye} />
          <circle cx="25" cy="21" r="1.8" fill={eye} />
          <circle cx="15" cy="21" r="0.8" fill="black" />
          <circle cx="25" cy="21" r="0.8" fill="black" />
          {/* Shine */}
          <circle cx="14.2" cy="20" r="0.6" fill="white" />
          <circle cx="24.2" cy="20" r="0.6" fill="white" />
        </>
      ) : cfg.isPersian ? (
        <>
          {/* Sleepy Persian eyes */}
          <ellipse cx="15" cy="22" rx="3.5" ry="2.5" fill="white" />
          <ellipse cx="25" cy="22" rx="3.5" ry="2.5" fill="white" />
          <circle cx="15" cy="22" r="1.5" fill="#cc8833" />
          <circle cx="25" cy="22" r="1.5" fill="#cc8833" />
          <circle cx="15" cy="22" r="0.7" fill="black" />
          <circle cx="25" cy="22" r="0.7" fill="black" />
        </>
      ) : (
        <>
          {/* Happy squinting eyes */}
          <path
            d="M 12,21 A 4,4 0 0,1 18,21"
            stroke={eye}
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 22,21 A 4,4 0 0,1 28,21"
            stroke={eye}
            strokeWidth="1.5"
            fill="none"
          />
        </>
      )}

      {/* Nose */}
      {cfg.isPersian ? (
        <circle cx="20" cy="25" r="1.5" fill={nose} />
      ) : (
        <polygon points="19,25 21,25 20,27" fill={nose} />
      )}

      {/* Whiskers */}
      <line
        x1="8"
        y1="25"
        x2="16"
        y2="24"
        stroke="#aaaaaa"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <line
        x1="32"
        y1="25"
        x2="24"
        y2="24"
        stroke="#aaaaaa"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <line
        x1="9"
        y1="27"
        x2="16"
        y2="26"
        stroke="#aaaaaa"
        strokeWidth="0.6"
        opacity="0.7"
      />
      <line
        x1="31"
        y1="27"
        x2="24"
        y2="26"
        stroke="#aaaaaa"
        strokeWidth="0.6"
        opacity="0.7"
      />
    </svg>
  );
}
