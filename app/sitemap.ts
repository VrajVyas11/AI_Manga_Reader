// app/sitemap.ts
import { MetadataRoute } from "next";

/**
 * Sitemap that fetches MangaDex but is safe for build/runtime:
 * - Limits results to avoid rate limits
 * - Dedupes manga
 * - Builds chapter URLs matching the app routes
 * - Uses BASE_URL env var (fall back to your deploy URL)
 */

const BASE_URL = process.env.BASE_URL || "https://aimangareader-production.up.railway.app/";
const POPULAR_LIMIT = 50; // lower limit to avoid large sitemaps / rate limits
const RECENT_LIMIT = 30;
const CHAPTERS_PER_MANGA = 8; // limit chapters fetched per manga
const POPULAR_MANGA_CHAPTER_LIMIT = 10; // only fetch chapters for top N manga

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("fetchJson error:", err, url);
    return null;
  }
}

async function getPopularManga() {
  const url = `https://api.mangadex.org/manga?limit=${POPULAR_LIMIT}&order[followedCount]=desc&includes[]=cover_art`;
  const data = await fetchJson(url);
  return Array.isArray(data?.data) ? data.data : [];
}

async function getRecentlyUpdatedManga() {
  const url = `https://api.mangadex.org/manga?limit=${RECENT_LIMIT}&order[latestUploadedChapter]=desc&includes[]=cover_art`;
  const data = await fetchJson(url);
  return Array.isArray(data?.data) ? data.data : [];
}

function safeDate(raw: unknown) {
  const d = new Date(String(raw ?? ""));
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/manga-list`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/library`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  // If you truly only want the few fixed routes, you can return staticPages here.
  // But if you want to include dynamic manga/chapter pages, continue below.
  const popular = await getPopularManga();
  const recent = await getRecentlyUpdatedManga();

  // combine + dedupe
  const map = new Map<string, {id:string,attributes:{updatedAt:Date}}>();
  for (const m of [...(popular || []), ...(recent || [])]) {
    if (m?.id) map.set(m.id, m);
  }
  const allManga = Array.from(map.values());

  const mangaPages: MetadataRoute.Sitemap = allManga.map((m: {id:string,attributes:{updatedAt:Date}}) => ({
    url: `${BASE_URL}/manga/${m.id}`,
    lastModified: safeDate(m?.attributes?.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // fetch chapter pages for top popular manga only and limit chapters per manga
  const chapterPages: MetadataRoute.Sitemap = [];
  const topManga = (popular || []).slice(0, POPULAR_MANGA_CHAPTER_LIMIT);

  for (const m of topManga) {
    if (!m?.id) continue;
    try {
      const feedUrl = `https://api.mangadex.org/manga/${m.id}/feed?limit=${CHAPTERS_PER_MANGA}&order[chapter]=desc&translatedLanguage[]=en`;
      const feed = await fetchJson(feedUrl);
      if (!Array.isArray(feed?.data)) continue;

      for (const ch of feed.data) {
        if (!ch?.id) continue;
        // Build chapter URL matching your app pattern:
        // /manga/{mangaId}/chapter/{chapterId}/read
        chapterPages.push({
          url: `${BASE_URL}/manga/${m.id}/chapter/${ch.id}/read`,
          lastModified: safeDate(ch?.attributes?.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    } catch (err) {
      console.error("Error fetching chapters for", m.id, err);
    }
  }

  // final dedupe by URL
  const seen = new Set<string>();
  const combined: MetadataRoute.Sitemap = [];
  for (const item of [...staticPages, ...mangaPages, ...chapterPages]) {
    if (!item?.url) continue;
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    combined.push(item);
  }

  return combined;
}