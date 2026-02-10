import React, { useState } from "react";
import { easeInOut, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function SuperRealisticEnvelope({
  recipientName,
  senderName,
  onOpen,
  children,
}: {
  recipientName: string;
  senderName: string;
  onOpen?: () => void;
  children?: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [step, setStep] = useState<"closed" | "opening" | "opened">("closed");

  const handleOpen = () => {
    if (step === "closed") {
      setStep("opening");
      setTimeout(() => {
        setStep("opened");
        setIsOpened(true);
        onOpen?.();
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes flapOpen {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(-180deg) translateZ(20px);
          }
          100% {
            transform: rotateX(-180deg) translateZ(0px);
          }
        }

        @keyframes letterSlideUp {
          0% {
            transform: translateY(0) translateZ(0);
          }
          100% {
            transform: translateY(-60px) translateZ(10px);
          }
        }

        @keyframes sealBreak {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(0.5) rotate(180deg);
            opacity: 0.5;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        .envelope-flap-opening {
          animation: flapOpen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .letter-sliding {
          animation: letterSlideUp 1s ease-out 0.4s forwards;
        }

        .seal-breaking {
          animation: sealBreak 0.8s ease-out forwards;
        }
      `}</style>

      {!isOpened ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-3xl"
        >
          <div
            onClick={handleOpen}
            className="relative cursor-pointer"
            style={{ perspective: "1200px" }}
          >
            <div className="relative bg-linear-to-br from-gray-800/90 to-gray-900/90 rounded-3xl p-8 md:p-16 border-2 border-pink-500/30">
              <div
                className="relative"
                style={{
                  transformStyle: "preserve-3d",
                  width: "100%",
                  aspectRatio: "3/2",
                }}
              >
                {/* Envelope back */}
                <div className="absolute inset-0 border-2 border-pink-400/30 rounded-xl bg-linear-to-br from-gray-700/20 to-gray-800/20" />

                {/* Letter inside */}
                <div
                  className={`absolute inset-0 m-auto w-[85%] h-[75%] bg-linear-to-br from-pink-50/10 to-purple-50/10 rounded-lg border border-pink-200/20 ${
                    step === "opening" ? "letter-sliding" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                />

                {/* Bottom flaps */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="100"
                    x2="50"
                    y2="50"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2="50"
                    y2="50"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Top flap with 3D effect */}
                <div
                  className={`absolute inset-x-0 top-0 h-1/2 ${
                    step === "opening" ? "envelope-flap-opening" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "bottom center",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 50"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="topFlapGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                        <stop
                          offset="100%"
                          stopColor="rgba(236, 72, 153, 0.3)"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 0 L 50 50 L 100 0 Z"
                      fill="url(#topFlapGradient)"
                      stroke="rgba(236, 72, 153, 0.6)"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="50"
                      y2="50"
                      stroke="rgba(236, 72, 153, 0.7)"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="100"
                      y1="0"
                      x2="50"
                      y2="50"
                      stroke="rgba(236, 72, 153, 0.7)"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>

                {/* Wax seal */}
                <div
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 ${
                    step === "opening" ? "seal-breaking" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-pink-500/60 rounded-full blur-xl" />
                    <motion.div
                      className="relative w-20 h-20 bg-linear-to-br from-pink-500 via-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-pink-300/30"
                      animate={
                        step === "closed"
                          ? {
                              scale: [1, 1.08, 1],
                              boxShadow: [
                                "0 0 20px rgba(236, 72, 153, 0.5)",
                                "0 0 30px rgba(236, 72, 153, 0.8)",
                                "0 0 20px rgba(236, 72, 153, 0.5)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: easeInOut,
                      }}
                    >
                      <span className="text-4xl filter drop-shadow-lg">♥</span>
                    </motion.div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-[28%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <p className="text-pink-200 text-xl md:text-2xl font-light">
                    To: <span className="font-semibold">{recipientName}</span>
                  </p>
                </div>

                <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <p className="text-pink-200 text-xl md:text-2xl font-light">
                    From: <span className="font-semibold">{senderName}</span>
                  </p>
                </div>
              </div>

              {/* Tap to open */}
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                animate={
                  step === "closed"
                    ? { opacity: 1, y: [0, 8, 0] }
                    : { opacity: 0 }
                }
                transition={{
                  y: { duration: 1.5, repeat: Infinity },
                  opacity: { duration: 0.3 },
                }}
              >
                <ChevronDown className="w-6 h-6 text-pink-300" />
                <span className="text-sm font-medium text-pink-300">
                  Tap to open
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full max-w-3xl"
        >
          <div className="bg-linear-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-pink-500/30 shadow-2xl p-8 md:p-12">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
}
