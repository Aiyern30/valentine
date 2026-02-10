import React, { useState } from "react";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  recipientName: string;
  senderName: string;
  onOpen?: () => void;
  children?: React.ReactNode;
}

export default function AnimatedEnvelope({
  recipientName,
  senderName,
  onOpen,
  children,
}: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (!isOpen && !isOpening) {
      setIsOpening(true);
      setTimeout(() => {
        setIsOpen(true);
        onOpen?.();
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Envelope Container */}
        <div
          className={`relative transition-all duration-1000 ${
            isOpen
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-lg" />

          {/* Main Envelope Body */}
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-pink-500/30 shadow-2xl overflow-hidden">
            {/* Envelope Back */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-auto"
              style={{ minHeight: "400px" }}
            >
              {/* Envelope body */}
              <rect
                x="50"
                y="100"
                width="500"
                height="300"
                fill="url(#envelopeGradient)"
                stroke="rgba(236, 72, 153, 0.5)"
                strokeWidth="2"
                rx="8"
              />

              {/* Envelope flap lines */}
              <line
                x1="50"
                y1="100"
                x2="300"
                y2="250"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="1.5"
              />
              <line
                x1="550"
                y1="100"
                x2="300"
                y2="250"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="1.5"
              />

              {/* Bottom edges */}
              <line
                x1="50"
                y1="400"
                x2="300"
                y2="250"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="1.5"
              />
              <line
                x1="550"
                y1="400"
                x2="300"
                y2="250"
                stroke="rgba(236, 72, 153, 0.3)"
                strokeWidth="1.5"
              />

              {/* Top Flap - Animated */}
              <g
                className={`transition-all duration-800 origin-center ${
                  isOpening ? "animate-flapOpen" : ""
                }`}
                style={{
                  transformOrigin: "300px 100px",
                  transform: isOpening ? "rotateX(180deg)" : "rotateX(0deg)",
                }}
              >
                <path
                  d="M 50 100 L 300 250 L 550 100 Z"
                  fill="url(#flapGradient)"
                  stroke="rgba(236, 72, 153, 0.6)"
                  strokeWidth="2"
                  className={isOpening ? "animate-flapOpen" : ""}
                />
              </g>

              {/* Seal/Heart */}
              <g
                className={`transition-all duration-500 ${isOpening ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
              >
                <circle
                  cx="300"
                  cy="250"
                  r="30"
                  fill="url(#sealGradient)"
                  filter="url(#glow)"
                />
                <circle
                  cx="300"
                  cy="250"
                  r="28"
                  fill="rgba(236, 72, 153, 0.9)"
                />
                <text
                  x="300"
                  y="262"
                  textAnchor="middle"
                  fontSize="28"
                  fill="white"
                >
                  ♥
                </text>
              </g>

              {/* Gradients and Filters */}
              <defs>
                <linearGradient
                  id="envelopeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(31, 41, 55, 0.9)" />
                  <stop offset="100%" stopColor="rgba(17, 24, 39, 0.9)" />
                </linearGradient>

                <linearGradient
                  id="flapGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 0.3)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
                </linearGradient>

                <radialGradient id="sealGradient">
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 1)" />
                  <stop offset="100%" stopColor="rgba(219, 39, 119, 1)" />
                </radialGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Text Labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-center space-y-8 mt-12">
                <div className="text-pink-300 font-handwriting text-2xl">
                  To:{" "}
                  <span className="text-pink-400 font-semibold">
                    {recipientName}
                  </span>
                </div>
                <div className="text-pink-300 font-handwriting text-2xl">
                  From:{" "}
                  <span className="text-pink-400 font-semibold">
                    {senderName}
                  </span>
                </div>
              </div>
            </div>

            {/* Tap to Open Prompt */}
            <div
              onClick={handleTap}
              className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer transition-all duration-300 ${
                isOpening ? "opacity-0" : "opacity-100 hover:scale-110"
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-pink-400">
                <div className="animate-bounce">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Tap to open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content - Appears after opening */}
        <div
          className={`transition-all duration-1000 ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
          }`}
        >
          {isOpen && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-pink-500/30 shadow-2xl p-8 animate-fadeInUp">
              {children || (
                <div className="text-center space-y-4">
                  <div className="text-pink-400 text-4xl mb-4">💕</div>
                  <h2 className="text-2xl font-bold text-white">
                    Your Message
                  </h2>
                  <p className="text-gray-300">The envelope has been opened!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes flapOpen {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-180deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-flapOpen {
          animation: flapOpen 0.8s ease-in-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @font-face {
          font-family: "Handwriting";
          src: local("Brush Script MT"), local("Lucida Handwriting");
        }

        .font-handwriting {
          font-family: "Handwriting", cursive;
        }
      `}</style>
    </div>
  );
}
