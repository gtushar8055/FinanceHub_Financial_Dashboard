import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Menu,
  X,
  Wallet,
  User,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { sidebarOpen, setSidebarOpen } = useFinance();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-cream-50 dark:bg-slate-800 rounded-xl shadow-lg border-2 border-cocoa-700/20 dark:border-primary-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Menu size={22} className="text-cocoa-700 dark:text-slate-200" />
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-cream-50 dark:bg-slate-900 border-r-2 border-cocoa-700/20 dark:border-primary-500/30 shadow-2xl lg:shadow-none transform transition-all duration-300 ease-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 border-b-2 border-cocoa-700/20 dark:border-primary-500/30 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-camel-500 via-coffee-500 to-cocoa-700 rounded-xl flex items-center justify-center shadow-lg shadow-camel-500/25 animate-pulse-slow">
              <Wallet size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-bold text-cocoa-800 dark:text-white text-base sm:text-lg tracking-tight">
                FinanceHub
              </span>
              <p className="text-[9px] sm:text-[10px] text-coffee-500 dark:text-slate-400 font-medium">
                Smart Money Manager
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-camel-300/20 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} className="text-coffee-500 dark:text-slate-400" />
          </button>
        </div>

        <nav className="p-3 sm:p-4 space-y-2 flex-1">
          <p className="px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-bold text-coffee-400 dark:text-slate-500 uppercase tracking-widest">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${isActive ? "bg-gradient-to-r from-camel-500 to-coffee-600 text-white shadow-lg shadow-camel-500/25 dark:from-primary-600 dark:to-primary-700 dark:shadow-primary-500/25" : "text-cocoa-700 dark:text-slate-300 hover:bg-camel-300/20 dark:hover:bg-slate-800 hover:shadow-md"}`}
              >
                <Icon
                  size={18}
                  className={`transition-all duration-300 group-hover:scale-110 sm:w-5 sm:h-5 ${isActive ? "text-white" : "text-coffee-400 dark:text-slate-500"}`}
                />
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute right-3 sm:right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 sm:p-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-camel-300/20 to-cream-200 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-4 sm:p-5 border-2 border-cocoa-700/20 dark:border-primary-500/30 shadow-inner">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-camel-400/20 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <User
                  size={12}
                  className="text-coffee-600 dark:text-primary-400 sm:w-3.5 sm:h-3.5"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-cocoa-700 dark:text-slate-200 uppercase tracking-wide">
                Developer
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-coffee-600 dark:text-slate-300 font-medium">
              Finance Dashboard
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
