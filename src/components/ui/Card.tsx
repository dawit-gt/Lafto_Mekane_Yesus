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
      className={`rounded-sm border border-line bg-paper-raised p-6 ${className}`}
    >
      {children}
    </div>
  );
}
