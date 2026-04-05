import { useState, useRef, useEffect } from "react";
import { Search, Download, Moon, Sun, Menu } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const CommandBar = ({ onOpenPalette, activeSection, onNavigate }) => {
  const { userRole, toggleRole, darkMode, toggleDarkMode, exportToCSV, exportToJSON } = useFinance();
  const [showExport, setShowExport] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Transactions" },
    { id: "insights", label: "Insights" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-amber-100/95 dark:bg-zinc-900/95 backdrop-blur-md border-b-2 border-amber-800 dark:border-zinc-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-800 dark:bg-amber-700 flex items-center justify-center border-2 border-amber-900 dark:border-amber-600">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <span className="font-bold text-amber-900 dark:text-white text-lg hidden sm:block">FinanceHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border-2
                ${activeSection === item.id
                  ? "bg-amber-200 dark:bg-zinc-800 text-amber-900 dark:text-white border-amber-800 dark:border-zinc-600"
                  : "text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white border-transparent hover:border-amber-600 dark:hover:border-zinc-600"
                }`}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={onOpenPalette} title="Search (Ctrl+K)"
            className="p-2 rounded-lg text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-200 dark:hover:bg-zinc-800 transition-colors border-2 border-transparent hover:border-amber-600 dark:hover:border-zinc-600">
            <Search size={20} />
          </button>

          <div className="relative" ref={exportRef}>
            <button onClick={() => setShowExport(!showExport)}
              className="p-2 rounded-lg text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-200 dark:hover:bg-zinc-800 transition-colors border-2 border-transparent hover:border-amber-600 dark:hover:border-zinc-600">
              <Download size={20} />
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-amber-50 dark:bg-zinc-800 rounded-xl shadow-lg border-2 border-amber-800 dark:border-zinc-600 py-1">
                <button onClick={() => { exportToCSV(); setShowExport(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-amber-100 dark:hover:bg-zinc-700 text-amber-800 dark:text-zinc-300 font-medium">Export CSV</button>
                <button onClick={() => { exportToJSON(); setShowExport(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-amber-100 dark:hover:bg-zinc-700 text-amber-800 dark:text-zinc-300 font-medium">Export JSON</button>
              </div>
            )}
          </div>

          <button onClick={toggleDarkMode}
            className="p-2 rounded-lg text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-200 dark:hover:bg-zinc-800 transition-colors border-2 border-transparent hover:border-amber-600 dark:hover:border-zinc-600">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button onClick={toggleRole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors border-2
              ${userRole === "admin"
                ? "bg-amber-200 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 border-amber-800 dark:border-amber-600"
                : "bg-amber-100 dark:bg-zinc-800 text-amber-700 dark:text-zinc-400 border-amber-600 dark:border-zinc-600"
              }`}>
            {userRole}
          </button>

          <button onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-amber-700 dark:text-zinc-400 hover:bg-amber-200 dark:hover:bg-zinc-800 border-2 border-transparent hover:border-amber-600">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden border-t-2 border-amber-800 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-900 px-4 py-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setShowMobileMenu(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold border-2 mb-1
                ${activeSection === item.id
                  ? "bg-amber-200 dark:bg-zinc-800 text-amber-900 dark:text-white border-amber-800 dark:border-zinc-600"
                  : "text-amber-700 dark:text-zinc-400 border-transparent"
                }`}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default CommandBar;
