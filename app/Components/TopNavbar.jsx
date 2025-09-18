"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Home,
  NotebookTabs,
  // Download,
  Compass,
} from "lucide-react";
import { usePathname } from "next/navigation";
import ProfilePop from "../Components/TopNavbarComponents/ProfilePop";
import { useTheme } from "../providers/ThemeContext";
import Link from "next/link";

const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { theme } = useTheme();
  const pathname = usePathname();
  const searchInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Mobile breadcrumb open state
  const [mobileCrumbsOpen, setMobileCrumbsOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update currentPath when pathname changes
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [pathname]);

  // Generate breadcrumbs based on pathname
  useEffect(() => {
    if (!pathname) return;
    const paths = pathname.split("/").filter(Boolean);
    const crumbs = paths.map((path, i) => ({
      name: path
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      path: "/" + paths.slice(0, i + 1).join("/"),
    }));

    if (crumbs[0]?.name === "Manga") {
      const isReading = crumbs.some((crumb) => crumb.path.includes("read"));
      setBreadcrumbs([
        { name: "Home", path: "/manga-list" },
        { name: "Chapters", path: `${crumbs[1]?.path}/chapters` },
        ...(isReading ? [{ name: "Read", path: crumbs[3]?.path }] : []),
      ]);
    } else {
      setBreadcrumbs(crumbs);
    }

    // close mobile crumbs when path changes
    setMobileCrumbsOpen(false);
  }, [pathname]);

  // Handle search on Enter key
  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (searchQuery.trim()) {
          window.location.href = `/search?query=${encodeURIComponent(searchQuery.trim())}`;
        }
      }
    },
    [searchQuery]
  );

  // Keyboard shortcut ⌘+K or Ctrl+K to focus search input
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isDark = isMounted ? theme === "dark" : true;

  // Conditions for showing breadcrumbs and nav links
  const shouldShowBreadCrumbs =
    (breadcrumbs.length > 0 &&
      !["Manga List", "Library", "Search"].includes(breadcrumbs[0].name));

  const shouldShowNavLinks = !breadcrumbs.some(
    (crumb) => crumb.name === "Chapters" || crumb.name === "Chapter"
  );

  const navItems = [
    { path: "/manga-list", name: "Home", icon: Home },
    { path: "/search", name: "Search", icon: Search },
    { path: "/library", name: "Library", icon: NotebookTabs },
    // { path: "/download", name: "Download", icon: Download },
  ];

  if (pathname === "/") return null;

  return (
    <header
      suppressHydrationWarning
      className={`fixed backdrop-blur-sm top-0 left-0 right-0 z-[9999] w-full bg-gradient-to-b transition-colors duration-0 ${isDark ? shouldShowNavLinks ? "from-purple-900/10 to-gray-950/30 bg-opacity-80 border-b-purple-400/20 border-b-[1px]" : "from-purple-900/5 to-gray-950/15 bg-opacity-80 border-b-gray-800/30 border-b-[1px]" : shouldShowNavLinks ? "from-purple-200/10 to-gray-200/30 bg-opacity-80 border-b-purple-300/40 border-b-[1px]" : "from-purple-200/5 to-gray-200/15 bg-opacity-80 border-b-purple-300/30 border-b-[1px]"} flex items-center justify-between h-16 sm:h-20 px-4 sm:px-20`}
    >
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center">
        <Link prefetch={true} href="/" className="flex items-center mr-2">
          <Image
            className="rounded-full w-12 md:w-16"
            src="/logo.svg"
            width={40}
            height={40}
            alt="logo"
            priority
          />
        </Link>

        {/* Breadcrumbs - Desktop */}
        {shouldShowBreadCrumbs && (
          <nav
            suppressHydrationWarning
            aria-label="Breadcrumb"
            className={`hidden lg:flex font-mono absolute text-lg overflow-hidden z-[9999] md:flex items-center select-none px-6 py-3 rounded-xl
          ${breadcrumbs.some(
              (crumb) => crumb.name === "Chapters" || crumb.name === "Chapter"
            )
                ? "top-[20%] left-[12%]"
                : "-bottom-[65%] left-0"
              }
        `}
          >
            <span
              className={`flex items-center transition-colors duration-200 ${isDark ? "text-gray-100 hover:text-purple-300" : "text-gray-700 hover:text-purple-600"
                }`}
            >
              <Compass strokeWidth={3} className="w-6 h-6 mr-2" />
            </span>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight
                  className={`mx-2 w-3 h-3 ${isDark ? "text-gray-100" : "text-gray-600"
                    }`}
                  aria-hidden="true"
                />
                <Link
                  prefetch={true}
                  href={crumb.path}
                  aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                  className={`transition-colors duration-200 ${i === breadcrumbs.length - 1
                    ? isDark
                      ? "text-purple-500 font-semibold"
                      : "text-purple-700 font-semibold"
                    : isDark
                      ? "text-gray-300 hover:text-purple-300"
                      : "text-gray-700 hover:text-purple-600"
                    }`}
                >
                  <span
                    style={
                      isDark
                        ? { textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }
                        : { textShadow: "1px 1px 4px rgba(255, 255, 255, 0.5)" }
                    }
                  >
                    {crumb.name === "Manga List" ? "Home" : crumb.name}
                  </span>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Navigation Links - Desktop */}
        <nav
          suppressHydrationWarning
          aria-label="Primary"
          className={`ml-5 space-x-8 transition-colors duration-200 ${shouldShowNavLinks ? "hidden lg:flex" : "hidden"
            } ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          {navItems.map(({ path, name, icon: Icon }) => (
            <Link
              prefetch={true}
              key={path}
              href={path}
              className={`flex items-center gap-2 text-base justify-center transition-colors duration-0 hover:text-purple-500 ${currentPath === path
                ? isDark
                  ? "font-bold text-white"
                  : "font-bold text-purple-700"
                : ""
                }`}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
        </nav>

        {/* Mobile Breadcrumb: collapsible single-button -> expands to show trail (mobile only) */}

        {shouldShowBreadCrumbs && (
          <div
            suppressHydrationWarning
            className="lg:hidden relative">
            <button
              type="button"
              aria-expanded={mobileCrumbsOpen}
              aria-controls="mobile-breadcrumb-panel"
              onClick={() => setMobileCrumbsOpen((v) => !v)}
              className={`flex items-center  rounded-full transition-colors duration-150 ${isDark ? "bg-gray-800/30 " : "bg-white/40 border border-gray-200/50"}`}
            >
              <Compass strokeWidth={1.5} className="w-6 h-6" />
            </button>

            {/* Slide-out panel showing full crumbs (appears to the right of button) */}
            {mobileCrumbsOpen && (
              <div
                id="mobile-breadcrumb-panel"
                className={`absolute top-0 left-full ml-2 -mt-2 py-1 z-30 min-w-fit rounded-full shadow-lg overflow-hidden  ${isDark ? "bg-[#0f001a] border border-gray-800/80 backdrop-blur-xl" : "bg-white/40 border border-gray-200/50"}`}
                role="dialog"
                aria-label="Breadcrumbs"
              >
                <nav className="flex justify-center items-center text-xs flex-row py-2 pl-3 pr-5">
                  {breadcrumbs.map((crumb, i) => (
                    <React.Fragment key={crumb.path}>
                      <ChevronRight
                        className={`mx-2 w-3 h-3 ${isDark ? "text-gray-100" : "text-gray-600"
                          }`}
                        aria-hidden="true"
                      />
                      <Link
                        prefetch={true}
                        href={crumb.path}
                        aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                        className={`transition-colors duration-200 ${i === breadcrumbs.length - 1
                          ? isDark
                            ? "text-purple-500 font-semibold"
                            : "text-purple-700 font-semibold"
                          : isDark
                            ? "text-gray-300 hover:text-purple-300"
                            : "text-gray-700 hover:text-purple-600"
                          }`}
                      >
                        <span
                          style={
                            isDark
                              ? { textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }
                              : { textShadow: "1px 1px 4px rgba(255, 255, 255, 0.5)" }
                          }
                        >
                          {crumb.name === "Manga List" ? "Home" : crumb.name}
                        </span>
                      </Link>
                    </React.Fragment>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
        {/* Hamburger Menu - Mobile */}
        {!shouldShowBreadCrumbs && <button
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`transition-colors duration-0 lg:hidden ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>}

      </div>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div
          className={`absolute top-16 lg:hidden left-0 w-full ${isDark ? "bg-gray-950/90" : "bg-gray-100/90"
            } backdrop-blur-md flex flex-col items-center py-4`}
        >
          {navItems.slice(0, 3).map(({ path, name }) => (
            <Link
              prefetch={true}
              key={path}
              href={path}
              className={`py-2 font-medium ${isDark ? "text-white" : "text-gray-900"
                } ${isDark ? "hover:text-purple-400" : "hover:text-purple-600"}`}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
      <div className=" flex justify-center items-center w-fit min-w-fit">
        {/* Mobile Search Toggle */}
        <button
          onClick={toggleSearch}
          aria-label={isSearchOpen ? "Close search" : "Open search"}
          className={`mr-2 transition-colors duration-0 lg:hidden ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          <Search className="w-6 h-6" />
        </button>
        {/* Mobile Search Bar - Fullscreen */}
        {isSearchOpen && (
          <div
            className={`lg:hidden absolute top-16 left-0 w-full ${isDark ? "bg-gray-950/90" : "bg-gray-100/90"
              } backdrop-blur-md px-4 py-4`}
          >
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isDark ? "brightness-200 opacity-60" : "text-gray-500"
                  }`}
              >
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                ref={searchInputRef}
                className={`block w-full pl-10 transition-colors duration-0 pr-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 ${isDark ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500" : "bg-gray-200 text-gray-900 placeholder-gray-600 focus:ring-purple-700"
                  }`}
                placeholder="Search Manga"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Right - Controls and Profile */}
        <div className="flex items-center w-fit space-x-2">
          {/* Center Search + Right Profile */}
          <div className="flex flex-row w-full justify-center items-center gap-5">
            <div className="hidden lg:flex flex-1 w-96 mx-8 relative group">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isDark ? "text-gray-500 group-focus-within:text-purple-400" : "text-gray-400 group-focus-within:text-purple-500"
                  }`}
              >
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className={`w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all duration-0 outline-none shadow-lg ${isDark
                  ? "bg-gray-900/70 border border-gray-700/50 text-white placeholder-gray-400 focus:bg-gray-900/90 focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 focus:shadow-purple-500/5"
                  : "bg-white/70 border border-gray-300/50 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 focus:shadow-purple-500/20"
                  } focus:shadow-xl`}
                placeholder="Search for manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                aria-label="Search manga"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd
                  className={`px-2 py-1 text-xs rounded-md font-mono ${isDark
                    ? "bg-gray-800/80 text-gray-400 border border-gray-600/50"
                    : "bg-gray-200/80 text-gray-500 border border-gray-300/50"
                    }`}
                >
                  ⌘ + K
                </kbd>
              </div>
            </div>
          </div>
          <ProfilePop />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;