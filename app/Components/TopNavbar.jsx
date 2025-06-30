"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Search, Menu, X, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import ProfilePop from "../Components/TopNavbarComponents/ProfilePop"
const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

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

  return (
    <> {pathname !== '/' && <header suppressHydrationWarning className="fixed top-0 w-full z-[9999] bg-gradient-to-b from-purple-900/10 to-gray-950/30 bg-opacity-80 backdrop-blur-sm flex border-b-purple-400/20 border-b-[1px] items-center justify-between h-16 sm:h-20 px-4 sm:px-20">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center">
        <a href="/" className="flex items-center mr-4">
          <Image
            className="rounded-full w-12  md:w-16  "
            src="/logo.svg"
            width={40}
            height={40}
            alt="logo"
            priority
          />
        </a>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex space-x-7 text-gray-400">
          <a href="/manga-list" className={`${currentPath == "/manga-list" ? "font-bold text-white" : ""}  hover:text-white`}>Home</a>
          <a href="/search" className={`${currentPath == "/search" ? "font-bold text-white" : ""} hover:text-white`}>Search</a>
          <a href="/library" className={`${currentPath == "/library" ? "font-bold text-white" : ""} hover:text-white`}>Library</a>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          className="lg:hidden text-white"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-950/90 backdrop-blur-md flex flex-col items-center py-4 lg:hidden">
          <a href="/manga-list" className="py-2 text-white font-medium hover:text-purple-400">Home</a>
          <a href="/search" className="py-2 text-white font-medium hover:text-purple-400">Search</a>
          <a href="#" className="py-2 text-white font-medium hover:text-purple-400">Library</a>
        </div>
      )}

      {/* Middle - Search Bar */}
      <div className="hidden lg:flex flex-grow max-w-2xl mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 brightness-200 opacity-60" />
          </div>
          <input
            type="text"
            className="bg-gray-800 block w-full pl-10 pr-3 py-2 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search Manga"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Mobile Search Toggle */}
      <button
        className="lg:hidden text-white mr-2"
        onClick={toggleSearch}
        aria-label={isSearchOpen ? "Close search" : "Open search"}
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Mobile Search Bar - Fullscreen */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-gray-950/90 backdrop-blur-md px-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 brightness-200 opacity-60" />
            </div>
            <input
              type="text"
              className="bg-gray-800 block w-full pl-10 pr-3 py-2 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <button className="hidden sm:block text-xs sm:text-sm font-medium bg-black border border-gray-700 hover:border-white text-white py-2 sm:py-3 px-3 sm:px-5 rounded-full">
          Upgrade
        </button>
        <div className="flex items-center">
        <ProfilePop/>
        </div>
      </div>
    </header>}</>
  );
};

export default TopNavbar;