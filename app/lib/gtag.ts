// lib/gtag.ts
export const GA_MEASUREMENT_ID = "G-KNS1W3ZXQQ";

declare global {
  interface Window {
    // eslint-disable-next-line no-unused-vars
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
};