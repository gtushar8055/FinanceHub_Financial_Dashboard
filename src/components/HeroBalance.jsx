import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.abs(value),
  );

const AnimatedCounter = ({ value, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      setDisplayValue(Math.abs(value) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) animationFrame.current = requestAnimationFrame(animate);
    };
    startTime.current = null;
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {value < 0 && "-"}₹{formatINR(displayValue)}
    </span>
  );
};

const StatCard = ({ label, value, isIncome }) => (
  <div className="bg-amber-50 dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border-2 border-amber-800 dark:border-zinc-700">
    <p className="text-sm text-amber-700 dark:text-zinc-400 mb-1">{label}</p>
    <p
      className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isIncome ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      {isIncome ? "+" : "-"}₹{formatINR(value)}
    </p>
  </div>
);

const MiniChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803d" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#15803d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#92400e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#92400e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: "#92400e", fontSize: 11 }}
            axisLine={{ stroke: "#92400e" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fffbeb",
              border: "2px solid #92400e",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "13px",
            }}
            formatter={(value, name) => {
              const labels = {
                income: "Income",
                expenses: "Expenses",
                balance: "Balance",
              };
              return [`₹${formatINR(value)}`, labels[name] || name];
            }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#15803d"
            strokeWidth={2}
            fill="url(#incomeGradient)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#dc2626"
            strokeWidth={2}
            fill="url(#expenseGradient)"
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#92400e"
            strokeWidth={3}
            fill="url(#balanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const HeroBalance = ({ onScrollToActivity }) => {
  const { balance, totalIncome, totalExpenses, transactions } = useFinance();
  const { chartData } = useTransactionStats(transactions);

  const sparklineData = chartData.slice(-6).map((item) => ({
    month: item.month,
    income: item.income,
    expenses: item.expenses,
    balance: item.income - item.expenses,
  }));

  const isPositive = balance >= 0;

  return (
    <section
      id="overview"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 pt-24"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isPositive ? "bg-green-600" : "bg-red-500"}`}
          />
          <span className="text-sm font-medium text-amber-800 dark:text-zinc-400">
            {isPositive ? "Healthy Balance" : "Attention Needed"}
          </span>
        </div>

        {/* Main Balance */}
        <div className="text-center mb-6">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 ${isPositive ? "text-amber-900 dark:text-white" : "text-red-600"}`}
          >
            <AnimatedCounter value={balance} />
          </h1>
          <p className="text-amber-700 dark:text-zinc-400 text-base sm:text-lg">
            Current Balance
          </p>
        </div>

        {/* Financial Trends Chart - Full Width */}
        <div className="w-full max-w-5xl mx-auto mb-8 bg-amber-50 dark:bg-zinc-900 rounded-xl p-6 border-2 border-amber-800 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-amber-800 dark:text-zinc-300 uppercase tracking-wider">
              Monthly Trends
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-700 border-2 border-green-900" />
                <span className="text-xs text-amber-700 dark:text-zinc-400 font-medium">
                  Income
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-red-800" />
                <span className="text-xs text-amber-700 dark:text-zinc-400 font-medium">
                  Expenses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-800 border-2 border-amber-900" />
                <span className="text-xs text-amber-700 dark:text-zinc-400 font-medium">
                  Net
                </span>
              </div>
            </div>
          </div>
          <MiniChart data={sparklineData} />
        </div>

        {/* Income & Expenses - Full Width Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Income" value={totalIncome} isIncome={true} />
          <StatCard
            label="Total Expenses"
            value={totalExpenses}
            isIncome={false}
          />
          <div className="bg-amber-50 dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border-2 border-amber-800 dark:border-zinc-700">
            <p className="text-sm text-amber-700 dark:text-zinc-400 mb-1">
              Net Savings
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${balance >= 0 ? "text-amber-900 dark:text-white" : "text-red-600"}`}
            >
              ₹{formatINR(balance)}
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border-2 border-amber-800 dark:border-zinc-700">
            <p className="text-sm text-amber-700 dark:text-zinc-400 mb-1">
              Savings Rate
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 dark:text-white">
              {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Scroll Button */}
        <div className="text-center">
          <button
            onClick={onScrollToActivity}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 dark:bg-amber-700 text-white rounded-full font-medium hover:bg-amber-900 dark:hover:bg-amber-600 transition-colors border-2 border-amber-900 dark:border-amber-600"
          >
            View Transactions
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBalance;
