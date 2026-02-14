import { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

export function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
            {icon}
          </div>
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </header>
  );
}
