import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";

const COLORS = ["#92400e", "#dc2626", "#15803d", "#d97706", "#7c3aed", "#db2777"];

const formatINR = (value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(value));

const CategoryBreakdown = () => {
  const { transactions } = useFinance();
  const { categoryData } = useTransactionStats(transactions);

  const chartData = useMemo(() => categoryData.slice(0, 6).map((cat, i) => ({ ...cat, color: COLORS[i % COLORS.length] })), [categoryData]);
  const totalExpenses = chartData.reduce((sum, cat) => sum + cat.amount, 0);

  if (chartData.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-amber-100/50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-white mb-4">Spending Breakdown</h2>
          <p className="text-amber-700 dark:text-zinc-400">Add some expenses to see your breakdown</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 bg-amber-50 dark:bg-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-white mb-2">Spending Breakdown</h2>
          <p className="text-amber-700 dark:text-zinc-400">Where your money goes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Chart */}
          <div className="relative h-72 bg-amber-50 dark:bg-zinc-900 rounded-xl p-4 border-2 border-amber-800 dark:border-zinc-700">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius="45%" outerRadius="75%" paddingAngle={2} dataKey="amount" stroke="none">
                  {chartData.map((entry) => <Cell key={entry.category} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#fffbeb", border: "2px solid #92400e", borderRadius: "8px", padding: "8px 12px" }}
                  formatter={(value) => [`₹${formatINR(value)}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-sm text-amber-700 dark:text-zinc-400">Total</p>
              <p className="text-xl font-bold text-amber-900 dark:text-white">₹{formatINR(totalExpenses)}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="grid sm:grid-cols-2 gap-3">
            {chartData.map((cat) => {
              const percentage = ((cat.amount / totalExpenses) * 100).toFixed(0);
              return (
                <div key={cat.category} className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-zinc-900 border-2 border-amber-800 dark:border-zinc-700">
                  <div className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-amber-900" style={{ backgroundColor: cat.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-amber-900 dark:text-white truncate">{cat.category}</p>
                    <p className="text-xs text-amber-700 dark:text-zinc-400">{percentage}% of total</p>
                  </div>
                  <p className="font-bold text-amber-900 dark:text-white">₹{formatINR(cat.amount)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBreakdown;
