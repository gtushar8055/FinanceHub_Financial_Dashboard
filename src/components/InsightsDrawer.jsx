import { X, TrendingUp, AlertCircle, Lightbulb, PiggyBank, Target } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";

const formatINR = (value) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(value));

const InsightCard = ({ icon: Icon, title, message, type = "info" }) => {
  const colors = {
    positive: "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-700",
    negative: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-600",
    warning: "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-700",
    info: "text-amber-800 dark:text-blue-400 bg-amber-100 dark:bg-blue-900/30 border-amber-800",
  };

  return (
    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-zinc-800 border-2 border-amber-800 dark:border-zinc-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2 ${colors[type]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-semibold text-amber-900 dark:text-white">{title}</p>
        <p className="text-sm text-amber-700 dark:text-zinc-400 mt-0.5">{message}</p>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-amber-700 dark:text-zinc-400">{label}</span>
        <span className="font-semibold text-amber-900 dark:text-white">₹{formatINR(value)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-amber-200 dark:bg-zinc-700 overflow-hidden border border-amber-400 dark:border-zinc-600">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const InsightsDrawer = ({ isOpen, onClose }) => {
  const { transactions, totalIncome, totalExpenses } = useFinance();
  const { highestSpendingCategory, savingsRate, chartData, categoryData } = useTransactionStats(transactions);

  const monthlyData = chartData.slice(-4);
  const maxExpense = Math.max(...categoryData.map((c) => c.amount), 1);

  const insights = [
    savingsRate >= 20 ? { icon: PiggyBank, title: "Great Savings", message: `You're saving ${savingsRate}% of your income!`, type: "positive" }
      : { icon: AlertCircle, title: "Low Savings", message: `Savings rate is ${savingsRate}%. Try to save 20%+`, type: "warning" },
    highestSpendingCategory ? { icon: Target, title: `Top: ${highestSpendingCategory.category}`, message: `₹${formatINR(highestSpendingCategory.amount)} spent`, type: "info" } : null,
    totalExpenses > totalIncome * 0.8 ? { icon: AlertCircle, title: "High Expenses", message: "Expenses are over 80% of income", type: "negative" }
      : { icon: TrendingUp, title: "Healthy Balance", message: "Your spending is under control", type: "positive" },
  ].filter(Boolean);

  const avgMonthlyExpense = totalExpenses / Math.max(chartData.length, 1);
  const recommendations = [
    savingsRate < 20 && "Set up automatic transfers to a savings account",
    highestSpendingCategory?.amount > avgMonthlyExpense && `Budget for ${highestSpendingCategory.category}`,
    "Review subscriptions and cancel unused services",
    "Track daily expenses for awareness",
  ].filter(Boolean);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-amber-50 dark:bg-zinc-900 shadow-xl border-l-2 border-amber-800 dark:border-zinc-700 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-800 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-900">
          <div>
            <h2 className="text-lg font-bold text-amber-900 dark:text-white">Insights</h2>
            <p className="text-sm text-amber-700 dark:text-zinc-400">Financial analysis</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-zinc-800 border-2 border-transparent hover:border-amber-600">
            <X size={20} className="text-amber-700 dark:text-zinc-400" />
          </button>
        </div>

        <div className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-amber-800 dark:text-zinc-400 uppercase tracking-wider mb-3">Key Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, i) => <InsightCard key={i} {...insight} />)}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-amber-800 dark:text-zinc-400 uppercase tracking-wider mb-3">Monthly Comparison</h3>
            <div className="h-44 bg-amber-50 dark:bg-zinc-800 rounded-xl p-3 border-2 border-amber-800 dark:border-zinc-700">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#92400e", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#fffbeb", border: "2px solid #92400e", borderRadius: "8px", padding: "8px" }}
                    formatter={(value) => [`₹${formatINR(value)}`, ""]} />
                  <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {monthlyData.map((_, i) => <Cell key={i} fill="#15803d" />)}
                  </Bar>
                  <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {monthlyData.map((_, i) => <Cell key={i} fill="#dc2626" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-green-700 border border-green-900" /><span className="text-amber-700 dark:text-zinc-400">Income</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-red-600 border border-red-800" /><span className="text-amber-700 dark:text-zinc-400">Expenses</span></div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-amber-800 dark:text-zinc-400 uppercase tracking-wider mb-3">Expense Breakdown</h3>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, i) => {
                const colors = ["bg-amber-800", "bg-red-600", "bg-green-700", "bg-amber-600", "bg-amber-500"];
                return <ProgressBar key={cat.category} label={cat.category} value={cat.amount} max={maxExpense} color={colors[i % colors.length]} />;
              })}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-amber-800 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Lightbulb size={14} /> Tips</h3>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-zinc-400">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-600">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default InsightsDrawer;
