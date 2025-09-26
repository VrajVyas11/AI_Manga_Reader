import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    "scope": "/", // Added: Defines the navigation scope. Prevents navigation outside the app's domain, enhancing PWA security and user experience.
    "name": "AI Manga Reader",
    "short_name": "AI Manga",
    "description": "Read manga, manhwa, and manhua with AI-powered OCR translation and TTS. Integrated with MangaDex for latest updates and community discussions. Features multiple reading modes, latest activity feeds, and personalized library management.",
    "start_url": "/", 
    "display": "standalone",
    "display_override": ["browser", "standalone"], // Added: Allows fallback to browser if standalone isn't supported, improving compatibility.
    "orientation": "any", // Improved: Changed to "any" for flexibility in reading modes (vertical/horizontal), better suiting manga content.
    "background_color": "#1f2937",
    "theme_color": "#1f2937",
    "icons": [
      {
        "src": "/logo.svg",
        "sizes": "any",
        "type": "image/svg+xml",
        "purpose": "any" 
      },
      {
        "src": "/icon-72x72.png", // Added: Smaller icon for better device compatibility (e.g., older Android).
        "sizes": "72x72",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icon-96x96.png", // Added: Common size for PWAs.
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icon-144x144.png", // Added: For medium-density screens.
        "sizes": "144x144",
        "type": "image/png",
        "purpose": "any"
      },
    ],
    "screenshots": [
      {
        "src": "../livedemoimages/1.png", 
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide",
        "label": "Landing Page - Discover trending manga and start reading instantly."
      },
      {
        "src": "../livedemoimages/9.png", 
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Read Chapter View - Enjoy AI-translated manga with TTS in vertical mode."
      },
      {
        "src": "../livedemoimages/2.png", 
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide",
        "label": "Manga List - Browse latest updates and community discussions."
      },
      {
        "src": "../livedemoimages/14.png", 
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Search Page - Find manga with advanced filters and sorting."
      },
            {
        "src": "../livedemoimages/6.png", 
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Manga Chapters - Find Manga chapter and language in which you want to read it in "
      },
            {
        "src": "../livedemoimages/16.png", 
        "sizes": "720x1280",
        "type": "image/png",
        "form_factor": "narrow",
        "label": "Library Page - Find your reading history , bookmarked manga and favourite chapters all in one place"
      }
    ],
    "shortcuts": [ // Added: Quick actions for home screen. Improves user engagement, which boosts SEO metrics like dwell time.
       {
        "name": "Library Manga",
        "short_name": "Library",
        "description": " Find your reading history , bookmarked manga and favourite chapters all in one place.",
        "url": "/library?utm_source=shortcut",
       },
        {
        "name": "Search Manga",
        "short_name": "Search",
        "description": "Quickly search for manga, manhwa, or manhua.",
        "url": "/search?utm_source=shortcut",
        // "icons": [
        //   {
        //     "src": "/icon-96x96.png",
        //     "sizes": "96x96",
        //     "type": "image/png"
        //   },
        //   {
        //     "src": "/icon-192x192.png",
        //     "sizes": "192x192",
        //     "type": "image/png"
        //   }
        // ]
      },
      {
        "name": "Latest Activity",
        "short_name": "Activity",
        "description": "View the latest community discussions and updates.",
        "url": "/manga-list?utm_source=shortcut",
        // "icons": [
        //   {
        //     "src": "/icon-96x96.png",
        //     "sizes": "96x96",
        //     "type": "image/png"
        //   },
        //   {
        //     "src": "/icon-192x192.png",
        //     "sizes": "192x192",
        //     "type": "image/png"
        //   }
        // ]
      }
    ],
    "categories": ["books", "entertainment", "education", "comics","manga","manhua","manhwa"],
    "lang": "en",
    "dir": "ltr",
    "prefer_related_applications": false,
    "related_applications": [], 
    "share_target": {
      "action": "/share",
      "method": "POST",
      "enctype": "multipart/form-data",
      "params": {
        "title": "title",
        "text": "text",
        "url": "url"
      }
    },
    "protocol_handlers": [
      {
        "protocol": "web+manga",
        "url": "/manga/%s" 
      }
    ]
  };
}