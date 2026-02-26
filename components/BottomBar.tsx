"use client";

import { ActiveScene } from "@/types/pet";

interface BottomBarProps {
  onAction: (label: string) => void;
  activeScene: ActiveScene;
}

const ACTIONS: {
  icon: string;
  label: string;
  scene: ActiveScene | null;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    icon: "\uD83C\uDF5C",
    label: "Feed",
    scene: "feed",
    activeColor: "text-amber-500",
    activeBg: "bg-amber-100 ring-2 ring-amber-300",
  },
  {
    icon: "\uD83C\uDFBE",
    label: "Play",
    scene: "play",
    activeColor: "text-emerald-500",
    activeBg: "bg-emerald-100 ring-2 ring-emerald-300",
  },
  {
    icon: "\uD83D\uDEC1",
    label: "Bath",
    scene: "bath",
    activeColor: "text-sky-500",
    activeBg: "bg-sky-100 ring-2 ring-sky-300",
  },
  {
    icon: "\uD83D\uDCA4",
    label: "Sleep",
    scene: "sleep",
    activeColor: "text-indigo-500",
    activeBg: "bg-indigo-100 ring-2 ring-indigo-300",
  },
];

export default function BottomBar({ onAction, activeScene }: BottomBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3 px-4 py-3 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-pink-100">
        {ACTIONS.map((action) => {
          const isActive =
            action.scene !== null && action.scene === activeScene;
          return (
            <button
              key={action.label}
              onClick={() => onAction(action.label)}
              title={action.label}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? `${action.activeBg} scale-105`
                  : "hover:bg-pink-50 active:scale-90"
              }`}
            >
              <span className="text-xl">{action.icon}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? action.activeColor : "text-pink-400"
                }`}
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
