import { useState, useEffect, useRef, useMemo } from "react";
import { Search, ArrowRight, Plus, FileDown, Moon, Users, X } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const formatINR = (value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(value));

const CommandPalette = ({ isOpen, onClose, onNavigate, onAddTransaction }) => {
  const { transactions, userRole, toggleRole, toggleDarkMode, exportToCSV, exportToJSON } = useFinance();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands = useMemo(() => [
    { id: "nav-overview", label: "Go to Overview", icon: ArrowRight, action: () => { onNavigate("overview"); onClose(); } },
    { id: "nav-activity", label: "Go to Activity", icon: ArrowRight, action: () => { onNavigate("activity"); onClose(); } },
    { id: "nav-insights", label: "Go to Insights", icon: ArrowRight, action: () => { onNavigate("insights"); onClose(); } },
    ...(userRole === "admin" ? [{ id: "add-transaction", label: "Add Transaction", icon: Plus, action: () => { onAddTransaction(); onClose(); } }] : []),
    { id: "export-csv", label: "Export to CSV", icon: FileDown, action: () => { exportToCSV(); onClose(); } },
    { id: "export-json", label: "Export to JSON", icon: FileDown, action: () => { exportToJSON(); onClose(); } },
    { id: "toggle-theme", label: "Toggle Dark Mode", icon: Moon, action: () => { toggleDarkMode(); onClose(); } },
    { id: "switch-role", label: `Switch to ${userRole === "admin" ? "Viewer" : "Admin"}`, icon: Users, action: () => { toggleRole(); onClose(); } },
  ], [userRole, onNavigate, onClose, onAddTransaction, exportToCSV, exportToJSON, toggleDarkMode, toggleRole]);

  const filteredTransactions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return transactions.filter(t => t.description.toLowerCase().includes(lowerQuery) || t.category.toLowerCase().includes(lowerQuery)).slice(0, 5);
  }, [query, transactions]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    return commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, commands]);

  const allResults = [...filteredCommands, ...filteredTransactions.map(t => ({
    id: `tx-${t.id}`, label: t.description, sublabel: `${t.category} - ₹${formatINR(t.amount)}`, icon: null, isTransaction: true, action: () => { onNavigate("activity"); onClose(); }
  }))];

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, allResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && allResults[selectedIndex]) { e.preventDefault(); allResults[selectedIndex].action(); }
    else if (e.key === "Escape") { onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[90%] max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <Search size={18} className="text-zinc-400" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Search transactions, commands..." className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none" />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X size={16} className="text-zinc-400" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filteredCommands.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 mb-2">Commands</p>
              {filteredCommands.map((cmd, i) => (
                <button key={cmd.id} onClick={cmd.action}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${selectedIndex === i ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                  {cmd.icon && <cmd.icon size={16} />}
                  <span className="font-medium">{cmd.label}</span>
                </button>
              ))}
            </div>
          )}

          {filteredTransactions.length > 0 && (
            <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 mb-2">Transactions</p>
              {filteredTransactions.map((tx, i) => {
                const resultIndex = filteredCommands.length + i;
                return (
                  <button key={tx.id} onClick={() => { onNavigate("activity"); onClose(); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedIndex === resultIndex ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
                    <div className="text-left">
                      <p className={`font-medium ${selectedIndex === resultIndex ? "text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300"}`}>{tx.description}</p>
                      <p className="text-sm text-zinc-500">{tx.category}</p>
                    </div>
                    <span className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                      {tx.type === "income" ? "+" : "-"}₹{formatINR(tx.amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {allResults.length === 0 && query && (
            <div className="px-4 py-8 text-center">
              <p className="text-zinc-500">No results for "{query}"</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
          <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Enter</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
