import { siteConfig } from "@/lib/site-config";

/**
 * A Google Map of the church. It needs no API key and sets no cookies until
 * the visitor scrolls to it (the frame loads lazily).
 */
export function ChurchMap({ className = "" }: { className?: string }) {
  const { latitude, longitude, shareUrl } = siteConfig.map;
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;

  return (
    <div className={className}>
      <iframe
        title={`Map showing the location of ${siteConfig.churchName}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-80 w-full rounded-sm border border-line sm:h-96"
      />
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-forest underline underline-offset-4"
      >
        Open in Google Maps →
      </a>
    </div>
  );
}