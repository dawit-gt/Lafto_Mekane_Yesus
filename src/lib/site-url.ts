/**
 * The public address of the website, without a trailing slash.
 *
 * Set NEXT_PUBLIC_SITE_URL to the real address (for example https://yourchurch.org)
 * in the PRODUCTION environment only. Leave it unset for local development and
 * preview deployments, so search engines are told to stay out of those.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (rawSiteUrl || "http://localhost:3000").replace(/\/+$/, "");

/** True only when a real, non-local address has been configured. */
export const isProductionSite = !!rawSiteUrl && !/localhost|127\.0\.0\.1/.test(rawSiteUrl);