"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("news");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["news", "weather", "countries", "crypto", "settings"];
      let found = "news";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            found = id;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "news", label: "News" },
    { id: "weather", label: "Weather" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50">
        <h1 className="text-xl font-bold">News & Weather</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <aside className="md:hidden w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-40">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition mb-4"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <nav className="flex flex-col gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition",
                  activeSection === section.id ? "bg-black text-white dark:bg-black" : ""
                )}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 md:sticky md:top-0 md:h-screen"
        )}
      >
        <h1 className="text-2xl font-bold mb-6">News & Weather</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition mb-6"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <nav className="flex flex-col gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition",
                activeSection === section.id ? "bg-black text-white dark:bg-black" : ""
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 min-h-screen flex flex-col">
        {children}
        {/* Footer */}
        <footer className="mt-auto text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          © 2025 Ritesh Raj
        </footer>
      </main>
    </div>
  );
}
