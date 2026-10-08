/**
 * Accepts a normal YouTube watch/share URL and returns an embeddable URL.
 * Returns null if the URL isn't recognized as YouTube — callers should
 * fall back to a plain link in that case rather than an <iframe>.
 */
export function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
      if (!videoId && parsed.pathname.startsWith("/embed/")) {
        return url; // already an embed URL
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}