/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer';

// Remove singleton pattern - create fresh browser for each request
async function createBrowser(): Promise<Browser> {
    return puppeteer.launch({
        headless: true, // Use new headless mode
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--no-first-run',
            '--no-default-browser-check',
            '--memory-pressure-off',
            '--max_old_space_size=4096'
        ],
        timeout: 30000, // Reduced timeout
        defaultViewport: {
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
        },
    });
}

async function setupPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    
    // Set reasonable timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(15000);

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
    });

    // Block unnecessary resources more aggressively
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const resourceType = request.resourceType();
        const url = request.url();
        
        // Block more resource types and specific patterns
        if (['image', 'stylesheet', 'font', 'media', 'script', 'xhr', 'fetch', 'websocket', 'eventsource'].includes(resourceType) ||
            url.includes('analytics') || 
            url.includes('tracking')||
            url.includes('ads') ||
            url.includes('beacon')) {
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
    const maxRetries = 3; // Increased retries
    const baseDelay = 500; // Base delay for exponential backoff

    let browser: Browser | null = null;
    let page: Page | null = null;

    // Cleanup function
    const cleanup = async () => {
        try {
            if (page && !page.isClosed()) {
                await page.close();
            }
        } catch (e:any) {
            console.warn('Error closing page:', e.message);
        }
        
        try {
            if (browser && browser.connected) {
                await browser.close();
            }
        } catch (e:any) {
            console.warn('Error closing browser:', e.message);
        }
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries} - Creating fresh browser instance`);
            
            // Create fresh browser for each attempt
            browser = await createBrowser();
            page = await setupPage(browser);

            console.log(`Navigating to: ${forumUrl}`);
            const response = await page.goto(forumUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 12000,
            });

            if (!response || response.status() !== 200) {
                throw new Error(`HTTP ${response?.status() ?? 'No response'}: Failed to load page`);
            }

            console.log('Page loaded successfully, waiting for content...');
            
            // Wait for content with shorter timeout
            try {
                await page.waitForSelector('.block-row.block-row--separated', { 
                    timeout: 3000,
                    visible: true 
                });
            } catch (e) {
                console.warn('Selector timeout, checking if content exists...',e);
                // Check if any content exists
                const hasContent = await page.$('.block-row');
                if (!hasContent) {
                    throw new Error('No forum content found on page');
                }
            }

            const htmlContent = await page.content();
            console.log(`Retrieved HTML content (${htmlContent.length} characters)`);
            
            const $ = cheerio.load(htmlContent);
            const comments = [];

            const elements = $('.block-row.block-row--separated').toArray();
            console.log(`Found ${elements.length} potential comment elements`);
            
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
                    avatarUrl: avatarUrl ?? `https://forums.mangadex.org/community/avatars/s/0/${Math.floor(Math.random() * 100)}.jpg?1673176662`,
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

            console.log(`Successfully parsed ${comments.length} comments`);
            
            // Cleanup before returning success
            await cleanup();

            if (comments.length === 0) {
                throw new Error('No valid comments found after parsing');
            }

            return NextResponse.json({
                data: comments.slice(0, maxComments),
                total: comments.length,
                timestamp: new Date().toISOString(),
                source: 'MangaDex Forums Latest Activity',
            });

        } catch (error: any) {
            console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
            
            // Cleanup on error
            await cleanup();

            if (attempt === maxRetries) {
                console.error('All attempts exhausted:', error.message);
                return NextResponse.json(
                    {
                        data: [],
                        total: 0,
                        timestamp: new Date().toISOString(),
                        source: 'MangaDex Forums Latest Activity',
                        error: `Failed to scrape data after ${maxRetries} attempts: ${error.message}`,
                    },
                    { status: 500 }
                );
            }

            // Exponential backoff with jitter
            const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
            console.log(`Waiting ${Math.round(delay)}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return NextResponse.json(
        {
            data: [],
            total: 0,
            timestamp: new Date().toISOString(),
            source: 'MangaDx Forums Latest Activity',
            error: 'Unexpected error: all retries exhausted',
        },
        { status: 500 }
    );
}

// Helper function to clean and parse manga title
function cleanMangaTitle(title: string) {
    let mangaTitle = "Unknown Manga Title";
    let volumeNo = "";
    let chapterNo = "";
    let chapterTitle = "";

    if (!title || title.trim() === "") {
        return { mangaTitle, volumeNo, chapterNo, chapterTitle };
    }

    // Handle titles with or without "Vol."
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