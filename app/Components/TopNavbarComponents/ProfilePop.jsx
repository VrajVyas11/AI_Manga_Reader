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
  };

  const menuItems = [
    { icon: User, label: "Profile", hasSubmenu: true, AuthNeeded: true, isLoggedIn: false },
    { icon: Settings, label: "Preferences", hasSubmenu: true },
    { icon: Palette, label: "Theme Settings", hasSubmenu: true },
    { icon: Download, label: "Downloads", count: 8 },
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Privacy & Security" },
    { icon: HelpCircle, label: "Help & Support" },
  ];

  // Define color classes based on theme
  const bgPopup = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "bg-slate-950/95 border-slate-700/50" : "bg-white/95 border-gray-300"}`;
  const bgHeader = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/50" : "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"}`;
  const textPrimary = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-slate-200" : "text-gray-900"}`;
  const textSecondary = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-slate-400" : "text-gray-600"}`;
  const textMenu = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-slate-300" : "text-gray-800"}`;
  const textMenuHover = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "group-hover:text-slate-200" : "group-hover:text-gray-900"}`;
  const iconMenu = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-gray-500 group-hover:text-gray-700"}`;
  const hoverBg = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-gray-200"}`;
  const borderTop = ` transition-colors duration-0 ease-in-out ${isDarkMode ? "border-t border-slate-700/50" : "border-t border-gray-300"}`;

  return (
    <div className="relative inline-block">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={togglePopup}
        className={`flex items-center border justify-center p-2.5 rounded-full duration-0 shadow-lg hover:shadow-xl backdrop-blur-3xl  transition-colors  ${isDarkMode ? "border-white/20 bg-gray-800/40" : "border-gray-300 bg-gray-100/40"
          }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <User size={28} className={` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-transparent fill-slate-300" : "text-gray-700"}`} />
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div
          ref={popupRef}
          className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-md border ${bgPopup}`}
          role="menu"
          aria-label="Profile menu"
        >
          {/* Header */}
          <div className={`px-4 py-4 border-b rounded-t-xl ${borderTop} ${bgHeader}`}>
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border   transition-colors duration-0 ease-in-out ${isDarkMode ? "bg-white/5 border-white/20" : "bg-gray-200 border-gray-300"
                  }`}
              >
                <User size={24} className={` transition-colors duration-0 ease-in-out ${isDarkMode ? "text-white" : "text-gray-900"}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${textPrimary}`}>Manga Reader</h3>
                <p className={`text-sm ${textSecondary}`}>Premium Member</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full ${item.AuthNeeded && !item.isLoggedIn ? "hidden" : "flex"
                  } px-4 py-3 items-center justify-between transition-colors duration-150 group ${hoverBg}`}
                role="menuitem"
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={18} className={`${iconMenu} transition-colors`} />
                  <span className={`${textMenu} ${textMenuHover} transition-colors`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.count && (
                    <span
                      className={`bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronRight
                      size={16}
                      className={`${iconMenu} transition-colors`}
                    />
                  )}
                </div>
              </button>
            ))}

            {/* Theme Toggle */}
            <div className={`${borderTop} mt-2 pt-2`}>
              <button
                onClick={handleToggleTheme}
                className={`w-full px-4 py-3 flex items-center justify-between transition-colors duration-150 group`}
                role="menuitem"
              >
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <Moon size={18} className={`${iconMenu} duration-0 transition-colors`} />
                  ) : (
                    <Sun size={18} className={`${iconMenu} duration-0 transition-colors`} />
                  )}
                  <span className={`${textMenu} ${textMenuHover} transition-colors`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-0 ${isDarkMode ? "bg-blue-500" : "bg-gray-600"
                    } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition- duration-0 ${isDarkMode ? "translate-x-6" : "translate-x-0.5"
                      }`}
                  />
                </div>
              </button>
            </div>

            {/* Logout */}
            {isLoggedIn ? (
              <div className={`${borderTop} mt-2 pt-2`}>
                <button
                  className="w-full px-4 py-3 flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 transition-colors duration-150 group"
                  role="menuitem"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-row">
                <div className={`${borderTop} w-full mt-2 pt-2`}>
                  <button
                    className="w-full px-4 py-3 flex justify-center items-center space-x-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/20 transition-colors duration-150 group"
                    role="menuitem"
                  >
                    <LogIn size={18} />
                    <span>Sign In </span>
                  </button>
                </div>
                <div className={`${borderTop} w-full mt-2 pt-2`}>
                  <button
                    className="w-full px-4 py-3 flex justify-center items-center space-x-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/20 transition-colors duration-150 group"
                    role="menuitem"
                  >
                    <DoorClosed size={20} />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePop;