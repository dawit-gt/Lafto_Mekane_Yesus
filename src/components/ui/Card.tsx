import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-line bg-paper-raised p-6 transition duration-200 hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-lg hover:shadow-forest/10 ${className}`}
    >
      {children}
    </div>
  );
}
