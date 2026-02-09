import Link from "next/link";
import {
  Calendar,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Mic2,
  Plus,
  PenLine,
  Sparkles,
  Smile,
} from "lucide-react";

export function DashboardActions() {
  const actions = [
    {
      title: "Create Confession",
      description: "Write a digital love letter",
      icon: <PenLine className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      href: "/dashboard/confessions/new",
    },
    {
      title: "Ask a Question",
      description: "The classic Yes/No game",
      icon: <Smile className="w-6 h-6 text-pink-500" />,
      color: "bg-pink-50 dark:bg-pink-900/20",
      href: "/dashboard/ask",
    },
    {
      title: "Upload Memory",
      description: "Add photos to gallery",
      icon: <ImageIcon className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      href: "/dashboard/gallery/upload",
    },
    {
      title: "Plan Date",
      description: "Add to calendar",
      icon: <Calendar className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      href: "/dashboard/calendar/new",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className="group flex flex-col p-5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/50 rounded-2xl shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color} group-hover:scale-110 transition-transform`}
          >
            {action.icon}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {action.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {action.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
