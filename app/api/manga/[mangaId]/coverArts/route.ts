/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mangaId: string }> }
) {
   const { mangaId } = await params
  if (!mangaId) {
    return NextResponse.json({ error: "mangaId is required" }, { status: 400 });
  }

  const baseUrl = "https://api.mangadex.org/cover";

  try {
    const res = await axios.get(baseUrl, {
      params: {
        "manga[]": mangaId,
        limit: 100,
      },
      timeout: 10000,
    });

    if (res.status !== 200) {
      return NextResponse.json(
        { error: "Failed to fetch from MangaDex", status: res.status },
        { status: res.status }
      );
    }

    const body = res.data || {};
    const rawCovers: any[] = Array.isArray(body.data) ? body.data : [];

    // Helper to strip extension from filename (e.g. "abc.jpg" -> "abc")
    const stripExt = (name: string) => {
      if (!name) return name;
      const idx = name.lastIndexOf(".");
      return idx > -1 ? name.slice(0, idx) : name;
    };

    // Build a list but keep all locales; mark those that are "ja"
    const covers = rawCovers.map((c: any) => {
      const fileName: string = c?.attributes?.fileName || "";
      const volume = c?.attributes?.volume || null;
      const locale = c?.attributes?.locale || null;
      const createdAt = c?.attributes?.createdAt || null;
      const updatedAt = c?.attributes?.updatedAt || null;
      const id = c?.id || null;

      // Official uploads/covers path (original file)
      const imageUrl = fileName
        ? `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
        : "";

      // Create a 256 thumbnail only if we can safely build it:
      // Mangadex uses <fileName_without_ext>.256.jpg for thumbnails
      const baseName = stripExt(fileName);
      const thumb256 = baseName ? `https://uploads.mangadex.org/covers/${mangaId}/${baseName}.256.jpg` : "";

      return {
        id,
        mangaId,
        fileName,
        volume,
        locale,
        createdAt,
        updatedAt,
        imageUrl,
        thumb256,
        raw: c,
      };
    });

    // Prefer "ja" covers first; if none exist, return all covers
    const jaCovers = covers.filter((c) => c.locale === "ja");
    const returned = jaCovers.length > 0 ? jaCovers : covers;

    return NextResponse.json({ result: "ok", total: returned.length, data: returned });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err.message || "Unknown error";
    console.error("Error fetching cover arts:", details);
    return NextResponse.json(
      { error: "Failed to fetch cover arts", details },
      { status }
    );
  }
}