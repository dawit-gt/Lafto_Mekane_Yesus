import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  tone = "paper",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "raised" | "forest";
  id?: string;
}) {
  const bg =
    tone === "raised" ? "bg-paper-raised" : tone === "forest" ? "tone-dark bg-gradient-to-br from-forest-deep to-forest text-paper-raised" : "bg-paper";

  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">{children}</div>
    </section>
  );
}
