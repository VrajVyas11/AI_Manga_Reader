/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function createBrowser() {
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
        // Vercel/AWS Lambda
        const chromium = await import('@sparticuz/chromium');
        return puppeteer.launch({
            args: chromium.default.args,
            executablePath: await chromium.default.executablePath(),
            headless: true,
        });
    } else {
        // Render/Railway/Local
        const puppeteerRegular = await import('puppeteer');
        return puppeteerRegular.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
}

async function setupPage(browser: any) {
    const page = await browser.newPage();
    
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(15000);

    await page.setViewport({ width: 1280, height: 720 });

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
    });

    await page.setRequestInterception(true);
    page.on('request', (request: any) => {
        const resourceType = request.resourceType();
        const url = request.url();
        
        if (['image', 'stylesheet', 'font', 'media', 'script', 'xhr', 'fetch'].includes(resourceType) ||
            url.includes('analytics') || 
            url.includes('tracking') ||
            url.includes('ads')) {
            request.abort();
        } else {
            request.continue();
        }
    });

    return page;
}

export async function GET() {
    const forumUrl = 'https://forums.mangadex.org/whats-new/latest-activity';
    const maxComments = 10;
    const maxRetries = 3;
    const baseDelay = 500;

    let browser: any = null;
    let page: any = null;

    const cleanup = async () => {
        try {
            if (page && !page.isClosed()) await page.close();
        } catch (e: any) {
            console.warn('Error closing page:', e.message);
        }
        
        try {
            if (browser) await browser.close();
        } catch (e: any) {
            console.warn('Error closing browser:', e.message);
        }
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}`);
            
            browser = await createBrowser();
            page = await setupPage(browser);

            const response = await page.goto(forumUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 12000,
            });

            if (!response || response.status() !== 200) {
                throw new Error(`HTTP ${response?.status() ?? 'No response'}`);
            }

            try {
                await page.waitForSelector('.block-row.block-row--separated', { 
                    timeout: 3000,
                    visible: true 
                });
            } catch  {
                const hasContent = await page.$('.block-row');
                if (!hasContent) throw new Error('No forum content found');
            }

            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const comments = [];

            const elements = $('.block-row.block-row--separated').toArray();
            
            for (const element of elements) {
                if (comments.length >= maxComments) break;

                const $element = $(element);
                const username = $element.find('.username').text().trim();
                if (!username) continue;

                let avatarUrl = $element.find('.avatar img').attr('src');
                if (avatarUrl && avatarUrl.startsWith('/')) {
                    avatarUrl = `https://forums.mangadex.org${avatarUrl}`;
                }

                const titleElement = $element.find('.contentRow-title a[href*="/threads/"]').text().trim();
                const { mangaTitle, volumeNo, chapterNo, chapterTitle } = cleanMangaTitle(titleElement);

                const reactionType = $element.find('.reaction-text').text().trim() ?? 'Like';
                const commentContent = $element.find('.contentRow-snippet').text().trim();
                if (!commentContent && !titleElement) continue;

                const timeAgo = $element.find('time.u-dt').text().trim() ?? 'A moment ago';
                const threadUrl = $element.find('a[href*="/threads/"]').attr('href') ?? '#';
                const repliedTO = $element.find('a[href*="/posts/"]').text();
                const postUrl = $element.find('a[href*="/posts/"]').attr('href') ?? '#';

                const fullThreadUrl = threadUrl.startsWith('/') ? `https://forums.mangadex.org${threadUrl}` : threadUrl;
                if (mangaTitle === "Unknown Manga Title") continue;

                comments.push({
                    id: `comment_${comments.length + 1}`,
                    username,
                    avatarUrl: avatarUrl ?? `https://forums.mangadex.org/community/avatars/s/0/${Math.floor(Math.random() * 100)}.jpg`,
                    mangaTitle,
                    volumeNo,
                    chapterNo,
                    chapterTitle,
                    repliedTO,
                    postUrl,
                    reactionType,
                    commentContent,
                    timeAgo,
                    threadUrl: fullThreadUrl,
                });
            }

            await cleanup();

            if (comments.length === 0) {
                throw new Error('No valid comments found');
            }

            return NextResponse.json({
                data: comments.slice(0, maxComments),
                total: comments.length,
                timestamp: new Date().toISOString(),
                source: 'MangaDex Forums Latest Activity',
            });

        } catch (error: any) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            await cleanup();

            if (attempt === maxRetries) {
                return NextResponse.json(
                    {
                        data: [],
                        total: 0,
                        timestamp: new Date().toISOString(),
                        source: 'MangaDex Forums Latest Activity',
                        error: `Failed after ${maxRetries} attempts: ${error.message}`,
                    },
                    { status: 500 }
                );
            }

            const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return NextResponse.json(
        {
            data: [],
            total: 0,
            timestamp: new Date().toISOString(),
            source: 'MangaDex Forums Latest Activity',
            error: 'All retries exhausted',
        },
        { status: 500 }
    );
}

function cleanMangaTitle(title: string) {
    let mangaTitle = "Unknown Manga Title";
    let volumeNo = "";
    let chapterNo = "";
    let chapterTitle = "";

    if (!title || title.trim() === "") {
        return { mangaTitle, volumeNo, chapterNo, chapterTitle };
    }

    const regexWithVol = /^(.*?)\s*-\s*Vol\.?\s*(\d+)?\s*Ch\.?\s*([\d.]+)\s*(?:-\s*(.*))?$/i;
    const regexWithoutVol = /^(.*?)\s*-\s*Ch\.?\s*([\d.]+)\s*(?:-\s*(.*))?$/i;

    let match = title.trim().match(regexWithVol);
    if (match) {
        mangaTitle = match[1]?.trim() ?? "Unknown Manga Title";
        volumeNo = match[2] ?? "";
        chapterNo = match[3] ?? "";
        chapterTitle = match[4]?.trim() ?? "";
    } else {
        match = title.trim().match(regexWithoutVol);
        if (match) {
            mangaTitle = match[1]?.trim() ?? "Unknown Manga Title";
            volumeNo = "";
            chapterNo = match[2] ?? "";
            chapterTitle = match[3]?.trim() ?? "";
        } else {
            mangaTitle = title.trim();
        }
    }

    return { mangaTitle, volumeNo, chapterNo, chapterTitle };
}