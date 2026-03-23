/**
 * Geo-IP → Uniform Quirks
 *
 * Vercel injects geo headers on every edge request at no extra latency cost
 * (resolved from its own Anycast network, not a third-party round-trip).
 * This module reads those headers and converts them to Uniform quirks so that
 * <Personalize> can select geo-targeted variants server-side — including on
 * the very first request with JavaScript disabled.
 *
 * Header reference (set by Vercel, read-only on edge / serverless functions):
 *   x-vercel-ip-country          ISO 3166-1 alpha-2 country code   e.g. "FI"
 *   x-vercel-ip-country-region   ISO 3166-2 subdivision code        e.g. "FI-18"
 *   x-vercel-ip-city             URL-encoded city name              e.g. "San%20Francisco"
 *
 * Quirk key convention (configure these in your Uniform manifest):
 *   vc-country   →  "FI"
 *   vc-region    →  "FI-18"
 *   vc-city      →  "San Francisco"  (decoded)
 *
 * Local development: Vercel headers are absent, so all values are undefined
 * and no quirks are set — the default (un-personalised) variant is shown.
 * To test geo locally, set UNIFORM_DEV_GEO_COUNTRY / REGION / CITY in .env.
 */

/** Canonical Uniform quirk key names for Vercel geo. Import these wherever
 *  you reference geo quirks to avoid hard-coding strings. */
export const GEO_QUIRK_KEYS = {
  country: 'vc-country',
  region:  'vc-region',
  city:    'vc-city',
} as const;

export type GeoQuirkKey = typeof GEO_QUIRK_KEYS[keyof typeof GEO_QUIRK_KEYS];

/** Raw geo values extracted from a single request. undefined means absent. */
export type GeoData = {
  country?: string;
  region?:  string;
  city?:    string;
};

/**
 * Reads Vercel's edge-injected geo headers from the incoming Request.
 *
 * Falls back to UNIFORM_DEV_GEO_* environment variables in development so
 * you can test geo-targeted content locally without a Vercel deployment:
 *
 *   UNIFORM_DEV_GEO_COUNTRY=FI
 *   UNIFORM_DEV_GEO_REGION=FI-18
 *   UNIFORM_DEV_GEO_CITY=Helsinki
 *
 * @param request  The incoming Fetch API Request (from a React Router loader).
 */
export function getGeoData(request: Request): GeoData {
  const country = request.headers.get('x-vercel-ip-country') ?? undefined;
  const region  = request.headers.get('x-vercel-ip-country-region') ?? undefined;

  // Vercel URL-encodes city names (spaces → %20, accented chars → %XX).
  const rawCity = request.headers.get('x-vercel-ip-city') ?? undefined;
  const city    = rawCity ? safeDecodeURIComponent(rawCity) : undefined;

  // Dev fallback: allows local geo testing without Vercel headers.
  if (process.env.NODE_ENV !== 'production') {
    return {
      country: country ?? process.env.UNIFORM_DEV_GEO_COUNTRY ?? undefined,
      region:  region  ?? process.env.UNIFORM_DEV_GEO_REGION  ?? undefined,
      city:    city    ?? process.env.UNIFORM_DEV_GEO_CITY     ?? undefined,
    };
  }

  return { country, region, city };
}

/**
 * Converts a GeoData object into a Uniform Quirks-compatible record.
 *
 * Only keys with actual values are included — supplying an empty string or
 * undefined quirk would shadow any visitor-stored value in the manifest
 * evaluator, producing incorrect results.
 *
 * @example
 *   geoToQuirks({ country: 'FI', city: 'Helsinki' })
 *   // → { 'vc-country': 'FI', 'vc-city': 'Helsinki' }
 */
export function geoToQuirks(geo: GeoData): Record<GeoQuirkKey, string> {
  const quirks: Partial<Record<GeoQuirkKey, string>> = {};
  if (geo.country) quirks[GEO_QUIRK_KEYS.country] = geo.country;
  if (geo.region)  quirks[GEO_QUIRK_KEYS.region]  = geo.region;
  if (geo.city)    quirks[GEO_QUIRK_KEYS.city]     = geo.city;
  return quirks as Record<GeoQuirkKey, string>;
}

/** decodeURIComponent wrapper that never throws on malformed input. */
function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
