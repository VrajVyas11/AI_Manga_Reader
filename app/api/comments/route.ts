/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';

let browserPromise: Promise<Browser> | null = null;
export const dynamic = 'force-dynamic'; // Ensure dynamic execution in Next.js
export const maxDuration = 60; // Vercel timeout in seconds

// Initialize browser singleton
async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
            ],
            timeout: 60000,
        });
    }
    return browserPromise;
}

// Cleanup browser on process exit
process.on('SIGINT', async () => {
    if (browserPromise) {
        const browser = await browserPromise;
        await browser.close();
        browserPromise = null;
    }
    process.exit();
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const thread = searchParams.get('thread');
    const repliesCount = parseInt(searchParams.get('repliesCount') || '0', 10);

    if (!thread || isNaN(repliesCount)) {
        return NextResponse.json(
            {
                data: [],
                total: 0,
                timestamp: new Date().toISOString(),
                source: 'MangaDex Forums',
                error: 'Missing or invalid thread or repliesCount parameters',
            },
            { status: 400 }
        );
    }
    console.log(`page-${Math.max(1, Math.ceil(repliesCount / 20))}`);

    const forumUrl = `https://forums.mangadex.org/threads/${thread}/page-${Math.max(1, Math.ceil(repliesCount / 20))}`;
    const maxComments = 20;
    const maxRetries = 2;

    let browser;
    let page;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            browser = await getBrowser();
            page = await browser.newPage();

            await page.setUserAgent(
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.154 Mobile Safari/537.36'
            );
            await page.setExtraHTTPHeaders({
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'cache-control': 'max-age=0',
                dnt: '1',
                'if-modified-since': 'Sun, 01 Jun 2025 10:23:30 GMT',
                priority: 'u=0, i',
                referer: 'https://forums.mangadex.org/',
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'upgrade-insecure-requests': '1',
            });

            await page.setRequestInterception(true);
            page.on('request', (request: { resourceType: () => any; abort: () => void; continue: () => void; }) => {
                const resourceType = request.resourceType();
                if (['image', 'stylesheet', 'font', 'media', 'script', 'xhr', 'fetch'].includes(resourceType)) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            const response = await page.goto(forumUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 15000,
            });

            if (!response || response.status() !== 200) {
                throw new Error(`Failed to load page: ${response ? response.status() : 'No response'}`);
            }

            await page.waitForSelector('article.message.message--post', { timeout: 5000 }).catch(() => {
                console.warn('Selector not found, proceeding with available content');
            });

            const htmlContent = await page.content();
            const $ = cheerio.load(htmlContent);
            const comments = [];

            const elements = $('article.message.message--post').toArray();
            for (const element of elements) {
                if (comments.length >= maxComments) break;

                const $element = $(element);

                const username = $element.find('.message-name a.username').text().trim();
                if (!username) continue;

                let avatarUrl = $element.find('.message-avatar img').attr('src');
                if (avatarUrl && avatarUrl.startsWith('/')) {
                    avatarUrl = `https://forums.mangadex.org${avatarUrl}`;
                }

                const userTitle = $element.find('.message-userBanner').first().text().trim() || 'User';
                const joinedDate = $element.find('.message-userExtras .pairs--justified:contains("Joined") dd').text().trim() || 'Unknown';
                const messageCount = $element.find('.message-userExtras .pairs--justified:contains("Messages") dd').text().trim() || '0';

                const postId: any = $element.attr('id')?.replace('js-post-', '') || `post_${comments.length + 1}`;
                const timestamp = $element.find('time.u-dt').attr('datetime') || new Date().toISOString();
                const timeAgo = $element.find('time.u-dt').text().trim() || 'A moment ago';
                const postUrl = $element.find('.message-attribution-main a[href*="/post-"]').attr('href') || '#';
                const fullPostUrl = postUrl.startsWith('/') ? `https://forums.mangadex.org${postUrl}` : postUrl;

                const commentContent = $element.find('.message-body .bbWrapper').text().trim();
                if (!commentContent) continue;

                const reactionType = $element.find('.reactionsBar .reaction-sprite').attr('alt') || 'Like';
                const reactionUsers = $element.find('.reactionsBar-link bdi').text().trim() || 'None';

                comments.push({
                    id: postId,
                    username,
                    avatarUrl: avatarUrl || `https://forums.mangadex.org/community/avatars/s/0/${Math.floor(Math.random() * 100)}.jpg?1673176662`,
                    userTitle,
                    joinedDate,
                    messageCount,
                    commentContent,
                    timestamp,
                    timeAgo,
                    postUrl: fullPostUrl,
                    reactionType,
                    reactionUsers,
                    threadUrl: forumUrl,
                });
            }

            await page.close();

            if (comments.length === 0) {
                throw new Error('No comments found in the HTML');
            }

            return NextResponse.json({
                data: comments.slice(0, maxComments),
                total: comments.length,
                timestamp: new Date().toISOString(),
                source: 'MangaDex Forums Thread Comments',
            });
        } catch (error: any) {
            attempt++;
            if (page) await page.close();
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt >= maxRetries) {
                console.error('Error scraping forum comments:', error.message);
                return NextResponse.json(
                    {
                        data: [],
                        total: 0,
                        timestamp: new Date().toISOString(),
                        source: 'MangaDex Forums Thread Comments',
                        error: `Failed to scrape data after ${maxRetries} attempts: ${error.message}`,
                    },
                    { status: error.response?.status || 500 }
                );
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }

    return NextResponse.json(
        {
            data: [],
            total: 0,
            timestamp: new Date().toISOString(),
            source: 'MangaDex Forums Thread Comments',
            error: 'Unexpected error: retries exhausted',
        },
        { status: 500 }
    );
}