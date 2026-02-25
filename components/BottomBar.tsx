"use client";

const ACTIONS = [
  { icon: "🎀", label: "Dress Up" },
  { icon: "🍡", label: "Feed" },
  { icon: "🎮", label: "Play" },
  { icon: "🛁", label: "Bath" },
  { icon: "💤", label: "Sleep" },
];

interface BottomBarProps {
  onAction?: (label: string) => void;
}

export default function BottomBar({ onAction }: BottomBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-center pb-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-white/85 backdrop-blur-md rounded-3xl px-5 py-3 shadow-lg border border-pink-100">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction?.(action.label)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-50 to-pink-100 border border-pink-200 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 group-hover:shadow-md group-active:scale-95 transition-all duration-200">
              {action.icon}
            </div>
            <span className="text-[10px] font-bold text-pink-400 font-kawaii">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
