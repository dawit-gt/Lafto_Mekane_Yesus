import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  variant = "plain",
}: {
  children: ReactNode;
  className?: string;
  variant?: "plain" | "folio";
}) {
  if (variant === "folio") {
    return <div className={`folio ${className}`}>{children}</div>;
  }

  return (
    <div className={`rounded-sm border border-line bg-paper-raised p-6 ${className}`}>
      {children}
    </div>
  );
}