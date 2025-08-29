import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Layers,
  ImageIcon,
  Globe,
  Bolt,
  Clock,
  Sliders,
  Users,
  Share2,
  Infinity,
  Bookmark,
} from "lucide-react";

const features = [
  { title: "Free of charge", description: "Access all content without spending a penny", icon: Sparkles },
  { title: "Safe to use", description: "Secure browsing with no risk to your device", icon: ShieldCheck },
  { title: "Various genres", description: "Find manga from every genre and category", icon: Layers },
  { title: "High-quality scans", description: "Crystal clear images for the best reading experience", icon: ImageIcon },
  { title: "Anti-overload server", description: "Fast loading times even during peak hours", icon: Bolt },
  { title: "Fast updates", description: "Get the latest chapters as soon as they're released", icon: Clock },
  { title: "Zero ads & pop-ups", description: "Enjoy an uninterrupted reading experience", icon: Sliders },
  { title: "Global access", description: "Read from anywhere without restrictions", icon: Globe },
  { title: "User-friendly interface", description: "Easy navigation and intuitive design", icon: Users },
  { title: "Social sharing", description: "Share your favorite manga with friends", icon: Share2 },
  { title: "Cross-device sync", description: "Continue reading across all your devices", icon: Infinity },
  { title: "Unlimited reading", description: "No caps or limits on how much you can read", icon: Bookmark },
];

const LandingContent = () => {
  return (
    <section className="text-gray-50 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:py-16">
        {/* HERO */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                Read. Discover. Repeat.
              </h1>

              <p className="mt-4 text-lg text-gray-300 max-w-2xl">
                AI Manga Reader delivers a clean, fast, and private reading experience. High-quality scans, smart
                navigation, and cross-device sync — all available for free with zero interruptions.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/manga-list"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white font-semibold shadow-sm"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-purple-500/20 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  Browse Manga
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-white/10 text-gray-100 hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="text-yellow-300 font-semibold">New</span>
                  <span className="text-sm">Explore features</span>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-white/6 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Ad-free</div>
                    <div className="text-xs text-gray-400">No trackers, no pop-ups</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-white/6 flex items-center justify-center">
                    <Bolt className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Fast</div>
                    <div className="text-xs text-gray-400">Optimized for low latency</div>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative">
              <div className="rounded-2xl bg-white/6 p-1 shadow-xl">
                <div className="rounded-xl p-6 bg-transparent">
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <div
                      className="h-64 sm:h-72 md:h-80 w-full bg-center bg-cover rounded-xl shadow-inner flex items-end justify-between p-4"
                      style={{
                        backgroundImage:
                          "url('https://uploads.mangadex.org/covers/ade0306c-f4b6-4890-9edb-1ddf04df2039/fd49e2ad-69fc-416a-8deb-a71cc36b0b50.jpg')",
                      }}
                      aria-hidden="true"
                    >
                      <div className="bg-black/40 rounded-md px-3 py-2 text-sm text-white">
                        Featured: <span className="font-semibold">Top Picks</span>
                      </div>
                      <div className="space-x-2 hidden sm:inline-flex">
                        <span className="bg-white/10 px-3 py-1 rounded text-xs text-gray-200">24h updates</span>
                        <span className="bg-white/10 px-3 py-1 rounded text-xs text-gray-200">Curated</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MiniCard title="Action" color="bg-purple-500/10" />
                      <MiniCard title="Romance" color="bg-purple-400/10" />
                      <MiniCard title="Fantasy" color="bg-purple-600/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div id="features" className="mt-14 lg:mt-18 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">What makes AI Manga Reader great</h2>
          <p className="mt-2 text-gray-300 max-w-2xl">
            Carefully crafted reading experience with performance and clarity in mind. A gentle purple aesthetic with
            subtle yellow accents keeps your focus on the story.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <FeatureCard key={idx} feature={f} />
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-12 rounded-xl mx-auto max-w-6xl bg-white/6 border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Ready to dive in?</h3>
            <p className="text-gray-300 mt-1">Start reading now — no signup required.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/manga-list"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-md bg-purple-600/90 hover:bg-purple-600/100 text-white font-semibold shadow"
            >
              Start Reading
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-white/10 text-gray-100 hover:bg-white/6 transition"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* WHY / SAFETY — redesigned */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Safety & performance */}
            <div className="rounded-2xl  p-6 shadow-sm border border-white/5">
              <div className="flex flex-col items-start gap-4">
                <div className=" flex flex-row justify-start items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Safe & private by design</h3>
                </div>
                <div>
                  <p className="mt-2 text-gray-300 leading-relaxed">
                    We avoid aggressive advertising and don’t require personal data to get started. Your privacy is respected —
                    minimal exposure by default so you can jump straight to reading.
                  </p>

                  <div className=" grid grid-cols-1 sm:grid-cols-2 mt-6 gap-3">
                    <div className="flex items-start flex-col gap-3 rounded-lg bg-white/5 p-3">
                      <div className="mt-1 w-full text-wrap min-w-fit flex flex-row gap-3 text-yellow-300">
                        <Bolt className="w-5 h-5" />
                        <div className="font-medium text-white">Performance focused</div>
                      </div>
                      <div>

                        <div className="text-sm px-5 text-gray-400">Smart caching and optimized pages for buttery smooth reading</div>
                      </div>
                    </div>

                    <div className="flex items-start flex-col gap-3 rounded-lg bg-white/5 p-3">
                      <div className="mt-1 w-full text-wrap min-w-fit flex flex-row gap-3 text-purple-300">
                        <ShieldCheck className="w-5 h-5" />
                        <div className="font-medium text-white">Secure</div>
                      </div>
                      <div>
                        
                        <div className="text-sm px-5 text-gray-400">No trackers; we link only to trusted third-party hosts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reader-first & stats */}
            <div className="rounded-2xl  p-6 shadow-sm border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Designed for readers</h3>
                  </div>
                </div>
                <p className="mt-2 text-gray-300 leading-relaxed">
                  A dark-first palette, generous spacing and distraction-free layouts let you read longer without fatigue.
                  Subtle tones and controlled accents guide your focus to the story.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 p-3 flex flex-col">
                    <div className="text-sm text-gray-300">Titles</div>
                    <div className="mt-1 text-white font-semibold text-lg">10k+</div>
                  </div>

                  <div className="rounded-lg bg-white/5 p-3 flex flex-col">
                    <div className="text-sm text-gray-300">Updates / day</div>
                    <div className="mt-1 text-white font-semibold text-lg">Hundreds</div>
                  </div>

                  <div className="rounded-lg bg-white/5 p-3 flex flex-col">
                    <div className="text-sm text-gray-300">Countries</div>
                    <div className="mt-1 text-white font-semibold text-lg">Global</div>
                  </div>

                  <div className="rounded-lg bg-white/5 p-3 flex flex-col">
                    <div className="text-sm text-gray-300">Sync</div>
                    <div className="mt-1 text-white font-semibold text-lg">Cross-device</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <footer className="mt-16 pt-10 border-t border-white/10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © AI Manga Reader {new Date().getFullYear()} — Read freely, safely.
            </div>

            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-300 hover:text-white">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default LandingContent;

/* ----- small subcomponents (local to this file) ----- */

function MiniCard({ title, color = "bg-purple-500/10" }) {
  return (
    <div className={`rounded-lg p-3 flex items-center gap-3 ${color}`} aria-hidden="true">
      <div className="w-10 h-10 rounded-md bg-white/8 flex items-center justify-center">
        <Layers className="w-5 h-5 text-purple-300" />
      </div>
      <div>
        <div className="text-sm text-white font-medium">{title}</div>
        <div className="text-xs text-gray-400">Popular</div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  const Icon = feature.icon || Sparkles;
  return (
    <article
      className="rounded-xl p-5 bg-white/6 border border-white/10 hover:bg-white/10 transition-transform duration-200 hover:scale-[1.02] shadow-sm"
      role="article"
    >
      <div className="flex items-start gap-4">
        <span className="p-3 rounded-md bg-white/8 text-purple-300">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <h4 className="text-white font-semibold">{feature.title}</h4>
          <p className="mt-1 text-sm text-gray-300">{feature.description}</p>
        </div>
      </div>
    </article>
  );
}
