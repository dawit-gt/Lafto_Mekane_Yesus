/* eslint-disable @next/next/no-img-element */

/**
 * Shows an image the church added through the Media library (any https link).
 * With no link it shows a quiet placeholder block, or nothing if `hideIfEmpty`.
 * The picture is decorative here: the title or name is always printed next to it.
 */
export function SiteImage({
  src,
  className = "",
  hideIfEmpty = false,
}: {
  src: string | null | undefined;
  className?: string;
  hideIfEmpty?: boolean;
}) {
  if (!src) {
    return hideIfEmpty ? null : <div aria-hidden="true" className={`bg-line ${className}`} />;
  }
  return <img src={src} alt="" loading="lazy" className={`bg-line object-cover ${className}`} />;
}