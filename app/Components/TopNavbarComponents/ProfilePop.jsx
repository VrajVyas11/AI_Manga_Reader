import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  Palette,
  Download,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogIn,
  DoorClosed,
} from "lucide-react";
import { useTheme } from "@/app/providers/ThemeContext";

function ProfilePop() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const isLoggedIn = false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleTheme = () => {
    toggleTheme();

    // Set cookie with the *new* theme value (invert current)
    const newTheme = isDarkMode ? "light" : "dark";
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
     window.location.reload();
  };
  const menuItems = [
    { icon: User, label: 'Profile', hasSubmenu: true, AuthNeeded: true, isLoggedIn: false },
    { icon: Settings, label: 'Preferences', hasSubmenu: true },
    { icon: Palette, label: 'Theme Settings', hasSubmenu: true },
    { icon: Download, label: 'Downloads', count: 8 },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="relative inline-block">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className="flex items-center border border-white/20 justify-center p-2.5 rounded-full bg-gray-800/40 backdrop-blur-3xl  duration-200 shadow-lg hover:shadow-xl"
      >
        <User size={28} className="text-transparent fill-slate-300" />
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20  flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold">Manga Reader</h3>
                <p className="text-slate-400 text-sm">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full ${(item.AuthNeeded && !item.isLoggedIn) ? "hidden" : "flex"} px-4 py-3 items-center justify-between hover:bg-slate-800/50 transition-colors duration-150 group`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    size={18}
                    className="text-slate-400 group-hover:text-slate-300 transition-colors"
                  />
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.count && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                      {item.count}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronRight
                      size={16}
                      className="text-slate-500 group-hover:text-slate-400 transition-colors"
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Theme Toggle */}
            <div className="border-t border-slate-700/50 mt-2 pt-2">
              <button
                onClick={handleToggleTheme}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors duration-150 group"
              >
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Moon size={18} className="text-slate-400 group-hover:text-slate-300 transition-colors" />
                  ) : (
                    <Sun size={18} className="text-slate-400 group-hover:text-slate-300 transition-colors" />
                  )}
                  <span className="text-slate-300 group-hover:text-slate-200 transition-colors">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-blue-500' : 'bg-slate-600'} relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Logout */}
            {isLoggedIn ? <div className="border-t border-slate-700/50 mt-2 pt-2">
              <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-500/10 hover:border-red-500/20 transition-colors duration-150 group text-red-400 hover:text-red-300">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
              :
              <div className=' w-full flex flex-row'>
              <div className="border-t w-full border-slate-700/50 mt-2 pt-2">
                <button className="w-full px-4 py-3 flex justify-center items-center space-x-3 hover:bg-blue-500/10 hover:border-blue-500/20 transition-colors duration-150 group text-blue-400 hover:text-blue-300">
                  <LogIn size={18} />
                  <span>Sign In </span>
                </button>
              </div>
                <div className="border-t w-full border-slate-700/50 mt-2 pt-2">
                <button className="w-full px-4 py-3 flex justify-center items-center space-x-3 hover:bg-purple-500/10 hover:border-purple-500/20 transition-colors duration-150 group text-purple-400 hover:text-purple-300">
                  <DoorClosed size={20} />
                  <span>Sign Up</span>
                </button>
              </div>
              </div>
            }

          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePop;