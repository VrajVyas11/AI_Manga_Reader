// lib/gtag.ts

declare global {
  interface Window {
    // eslint-disable-next-line no-unused-vars
    gtag?: (...args: unknown[]) => void;
  }
}

const getMeasurementId = (): string | null => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;

  // Map hostnames to Measurement IDs
  if (hostname.includes('vercel.app')) {
    return 'G-EXTSESX735'; // Vercel
  } else if (hostname.includes('railway.app') || hostname.includes('railways.com')) {
    return 'G-KNS1W3ZXQQ'; // Railways
  } else if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    return 'G-TK8GP58K1M'; // Render
  }

  // Fallback to Railways if no match (or add a default)
  return 'G-KNS1W3ZXQQ';
};

export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag) return;

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  window.gtag("config", measurementId, { page_path: url });
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !window.gtag) return;

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  window.gtag("event", action, params);
};