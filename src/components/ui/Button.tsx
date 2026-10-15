import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "brass";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] px-5 py-2.5 text-sm font-semibold tracking-wide transition duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-paper-raised shadow-[0_8px_0_0_color-mix(in_srgb,var(--forest-deep)_55%,transparent)] hover:shadow-[0_10px_0_0_color-mix(in_srgb,var(--brass)_70%,transparent)]",
  secondary: "bg-transparent text-forest border border-forest hover:bg-forest hover:text-paper-raised",
  ghost: "bg-transparent text-brass hover:text-brass-dim underline underline-offset-4 decoration-1 px-0",
  brass: "bg-brass text-forest-deep hover:bg-paper-raised",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  onClick,
  disabled,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}