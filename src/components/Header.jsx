import { Shield, Eye, Moon, Sun, Download } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Header = ({ title }) => {
  const {
    userRole,
    toggleRole,
    darkMode,
    toggleDarkMode,
    exportToCSV,
    exportToJSON,
  } = useFinance();

  return (
    <header className="h-14 sm:h-16 lg:h-20 bg-cream-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-b-2 border-cocoa-700/20 dark:border-primary-500/30 flex items-center justify-between pl-16 pr-3 sm:pl-20 sm:pr-6 lg:pl-8 lg:pr-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-cocoa-800 dark:text-white tracking-tight truncate">
            {title}
          </h1>
          <p className="text-[10px] sm:text-xs text-coffee-500 dark:text-slate-400 hidden sm:block truncate">
            Welcome back! Here's your financial overview.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
        <div className="relative group">
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-cocoa-700 dark:text-slate-300 hover:bg-camel-300/20 dark:hover:bg-slate-800 border-2 border-cocoa-700/20 dark:border-primary-500/30 transition-all duration-300 hover:shadow-lg">
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-36 sm:w-44 bg-cream-50 dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-cocoa-700/20 dark:border-primary-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
            <button
              onClick={exportToCSV}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-cocoa-700 dark:text-slate-200 hover:bg-camel-300/20 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-camel-500 dark:bg-primary-500 rounded-full"></span>
              Export as CSV
            </button>
            <button
              onClick={exportToJSON}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-cocoa-700 dark:text-slate-200 hover:bg-coffee-400/10 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-coffee-500 dark:bg-blue-500 rounded-full"></span>
              Export as JSON
            </button>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border-2 border-cocoa-700/20 dark:border-primary-500/30 hover:bg-camel-300/20 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          {darkMode ? (
            <Sun size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
          ) : (
            <Moon
              size={16}
              className="text-cocoa-600 sm:w-[18px] sm:h-[18px]"
            />
          )}
        </button>

        <button
          onClick={toggleRole}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border-2 shadow-lg hover:scale-105 ${userRole === "admin" ? "bg-gradient-to-r from-camel-500 to-coffee-600 text-white border-camel-400/50 shadow-camel-500/25 hover:shadow-camel-500/40 dark:from-primary-600 dark:to-primary-700 dark:border-primary-400/50 dark:shadow-primary-500/25" : "bg-gradient-to-r from-coffee-500 to-cocoa-700 text-white border-coffee-400/50 shadow-coffee-500/25 hover:shadow-coffee-500/40 dark:from-amber-500 dark:to-orange-500 dark:border-amber-400/50 dark:shadow-amber-500/25"}`}
        >
          {userRole === "admin" ? (
            <>
              <Shield size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Admin</span>
            </>
          ) : (
            <>
              <Eye size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Viewer</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
