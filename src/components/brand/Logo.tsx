import Image from "next/image";

/** The church's logo picture (public/logo.png). It has a white background. */
export function Logo({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      priority
      className={`rounded-full bg-white object-contain ${className}`}
    />
  );
}
