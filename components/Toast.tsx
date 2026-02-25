"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShow(true);
        const hideTimer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(hideTimer);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div
      className={`
        absolute bottom-24 left-1/2 -translate-x-1/2 z-20
        bg-white/90 backdrop-blur-sm border border-pink-200 
        rounded-2xl px-5 py-2.5 shadow-lg
        flex items-center gap-2
        transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <span className="text-lg">🌸</span>
      <span className="text-sm font-bold text-pink-500 font-kawaii">{message}</span>
    </div>
  );
}
