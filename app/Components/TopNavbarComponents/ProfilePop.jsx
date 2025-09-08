import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Moon,
  Sun,
  ChevronRight,
  Shield,
  HelpCircle,
  Github,
} from "lucide-react";
import { useTheme } from "../../providers/ThemeContext";
import PreferencesPopUp from "./PreferencesPopUp"; // update path if needed
import ComingSoonPopup from "./ComingSoonPopup"
function ProfilePop() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isComingSoonPopupOpen, setIsComingSoonPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  // let isLoggedIn = false,
  // user = { name: "Vraj", email: "vyasvraj92@gmail.com" }
  // signOut = () => {};
  const router = useRouter();
  const isDark = theme === "dark";

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

  const handleNavigation = (item) => {
    if (item.href) {
      if (item.external) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    } else if (item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  // const handleSignOut = () => {
  //   signOut();
  //   setIsOpen(false);
  //   router.push("/");
  // };

  const handleComingSoonPopupClose = () => {
    setIsComingSoonPopupOpen(prev => !prev);
  };


  const menuItems = [
{
      icon: Settings,
      label: "Preferences",
      action: () => setShowPreferences(true),
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      action: () => handleComingSoonPopupClose(),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => handleComingSoonPopupClose(),
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/VrajVyas11/AI_Manga_Reader",
      external: true,
    },
  ];

  return (
    <div className="relative inline-block">
      {/* Profile Button */}
      <button
        suppressHydrationWarning
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center border justify-center p-2.5 rounded-full shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-0 ${isDark
          ? "border-purple-500/30 bg-slate-900/80 hover:bg-slate-900"
          : "border-purple-300/50 bg-white/80 hover:bg-gray-50/80"
          }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <User
          size={28}
          className={`transition-colors duration-0 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        />
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div
          ref={popupRef}
          className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-md border ${isDark ? "bg-black border-slate-700/50" : "bg-gray-100 border-gray-500/30"
            }`}
          role="menu"
          aria-label="Profile menu"
        >
          {/* Header */}
          <div
            className={`px-6 py-5 border-b ${isDark ? "border-slate-700/50 bg-slate-800/30" : "border-gray-500/15 bg-gray-50/30"
              }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${isDark ? "bg-slate-900 border-purple-500/10" : "bg-gray-100 border-purple-300/30"
                  }`}
              >
                <User size={28} className={isDark ? "text-purple-400" : "text-purple-600"} />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? "text-slate-200" : "text-gray-900"}`}>
                  {"Guest Reader"}
                </h3>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                  {"Trial App Beta User"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex px-6 py-3 items-center justify-between transition-colors duration-150 group ${isDark ? "hover:bg-slate-800/50 text-slate-300" : "hover:bg-gray-100/50 text-gray-700"
                    }`}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-4">
                    <item.icon
                      size={20}
                      className={`transition-colors group-hover:text-purple-400 ${isDark ? "text-slate-400" : "text-gray-500"}`}
                    />
                    <span className={`transition-colors group-hover:text-purple-400 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-colors group-hover:text-purple-400 ${isDark ? "text-slate-500" : "text-gray-400"}`}
                  />
                </button>
              );
            })}

            {/* Theme Toggle */}
            <div
              className={`border-t mt-2 pt-2 ${isDark ? "border-slate-700/50" : "border-gray-500/15"}`}
            >
              <button
                onClick={toggleTheme}
                className={`w-full px-6 py-3 flex items-center justify-between transition-colors duration-150 group ${isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-100/50"
                  }`}
                role="menuitem"
              >
                <div className="flex items-center space-x-4">
                  {isDark ? (
                    <Moon size={20} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                  ) : (
                    <Sun size={20} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                  )}
                  <span className={`transition-colors group-hover:text-purple-400 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${isDark ? "bg-purple-600" : "bg-gray-400"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ${isDark ? "translate-x-6" : "translate-x-0.5"}`} />
                </div>
              </button>
            </div>
            {isComingSoonPopupOpen && <ComingSoonPopup handleComingSoonPopupClose={handleComingSoonPopupClose} />}
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesPopUp isDark={isDark} isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
    </div>
  );
}

export default ProfilePop;