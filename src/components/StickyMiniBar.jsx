import { TrendingUp, TrendingDown } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const formatINR = (value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(value));

const StickyMiniBar = ({ visible }) => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  if (!visible) return null;

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
      <div className="flex items-center gap-4 px-5 py-2.5 bg-amber-100 dark:bg-zinc-900 rounded-full shadow-lg border-2 border-amber-800 dark:border-zinc-700">
        <span className={`font-bold text-lg ${balance >= 0 ? "text-amber-900 dark:text-white" : "text-red-600"}`}>
          ₹{formatINR(balance)}
        </span>
        <div className="w-px h-5 bg-amber-600 dark:bg-zinc-600" />
        <div className="flex items-center gap-1 text-green-700 dark:text-green-400">
          <TrendingUp size={14} />
          <span className="text-sm font-semibold">+₹{formatINR(totalIncome)}</span>
        </div>
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown size={14} />
          <span className="text-sm font-semibold">-₹{formatINR(totalExpenses)}</span>
        </div>
      </div>
    </div>
  );
};

export default StickyMiniBar;
