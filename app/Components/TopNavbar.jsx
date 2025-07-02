"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import ProfilePop from "../Components/TopNavbarComponents/ProfilePop";
import { useTheme } from "../providers/ThemeContext";

const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
      }
    },
    [searchQuery]
  );

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [pathname])
  const isDark = theme === "dark";

  const headerClasses = `
    fixed top-0 w-full z-[9999] 
    bg-gradient-to-b 
    ${isDark ? "from-purple-900/10 to-gray-950/30 bg-opacity-80 border-b-purple-400/20 border-b-[1px]" : "from-purple-200/20 to-gray-200/30 bg-opacity-90 border-b-purple-300/40 border-b-[1px]"}
    backdrop-blur-sm 
    flex items-center justify-between 
    h-16 sm:h-20 
    px-4 sm:px-20
  `;
  const navLinkBaseClasses = "hover:text-purple-500 transition-colors duration-200";
  const navLinkActiveClasses = isDark ? "font-bold text-white" : "font-bold text-purple-700";

  const mobileMenuBg = isDark ? "bg-gray-950/90" : "bg-gray-100/90";
  const mobileMenuText = isDark ? "text-white" : "text-gray-900";
  const mobileMenuHover = isDark ? "hover:text-purple-400" : "hover:text-purple-600";

  const inputBg = isDark ? "bg-gray-800" : "bg-gray-200";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const inputPlaceholder = isDark ? "placeholder-gray-400" : "placeholder-gray-600";
  const inputFocusRing = isDark ? "focus:ring-purple-500" : "focus:ring-purple-700";

  if (!isMounted) {
    // Render nothing or a placeholder on server and initial client render
    return null;
  }
  return (
    <>
      {pathname !== "/" && (
        <header className={headerClasses}>
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center">
            <a href="/" className="flex items-center mr-4">
              <Image
                className="rounded-full w-12 md:w-16"
                src="/logo.svg"
                width={40}
                height={40}
                alt="logo"
                priority
              />
            </a>

            {/* Navigation Links - Desktop */}
            <div className={`hidden lg:flex space-x-7 ${isDark ? "text-gray-400" : "text-gray-700"}`}>
              <a
                href="/manga-list"
                className={`${currentPath === "/manga-list" ? navLinkActiveClasses : ""} ${navLinkBaseClasses}`}
              >
                Home
              </a>
              <a
                href="/search"
                className={`${currentPath === "/search" ? navLinkActiveClasses : ""} ${navLinkBaseClasses}`}
              >
                Search
              </a>
              <a
                href="/library"
                className={`${currentPath === "/library" ? navLinkActiveClasses : ""} ${navLinkBaseClasses}`}
              >
                Library
              </a>
              <a
                href="/download"
                className={`${currentPath === "/download" ? navLinkActiveClasses : ""} ${navLinkBaseClasses}`}
              >
                Download
              </a>
            </div>

            {/* Hamburger Menu - Mobile */}
            <button
              className={isDark ? "lg:hidden text-white" : "lg:hidden text-gray-900"}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu - Dropdown */}
          {isMenuOpen && (
            <div
              className={`absolute top-16 left-0 w-full ${mobileMenuBg} backdrop-blur-md flex flex-col items-center py-4 lg:hidden`}
            >
              <a href="/manga-list" className={`py-2 font-medium ${mobileMenuText} ${mobileMenuHover}`}>
                Home
              </a>
              <a href="/search" className={`py-2 font-medium ${mobileMenuText} ${mobileMenuHover}`}>
                Search
              </a>
              <a href="/library" className={`py-2 font-medium ${mobileMenuText} ${mobileMenuHover}`}>
                Library
              </a>
            </div>
          )}

          {/* Middle - Search Bar */}
          <div className="hidden lg:flex flex-grow max-w-2xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${isDark ? "brightness-200 opacity-60" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 ${inputBg} ${inputText} ${inputPlaceholder} ${inputFocusRing}`}
                placeholder="Search Manga"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            className={`${isDark ? "lg:hidden text-white" : "lg:hidden text-gray-900"} mr-2`}
            onClick={toggleSearch}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Mobile Search Bar - Fullscreen */}
          {isSearchOpen && (
            <div
              className={`lg:hidden absolute top-16 left-0 w-full ${mobileMenuBg} backdrop-blur-md px-4 py-4`}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 ${isDark ? "brightness-200 opacity-60" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 ${inputBg} ${inputText} ${inputPlaceholder} ${inputFocusRing}`}
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
          <div className="flex items-center space-x-3 sm:space-x-5">
            <div className="flex items-center">
              <ProfilePop />
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default TopNavbar;