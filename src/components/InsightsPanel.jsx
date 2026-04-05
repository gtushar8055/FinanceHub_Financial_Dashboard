import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";

const InsightsPanel = () => {
  const { transactions, darkMode } = useFinance();
  const {
    highestSpendingCategory,
    avgMonthlyExpense,
    savingsRate,
    chartData,
    categoryData,
    totalExpenses,
  } = useTransactionStats(transactions);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cream-50 dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-2xl border-4 border-cocoa-900 dark:border-cocoa-800">
          <p className="font-bold text-cocoa-800 dark:text-white mb-2 text-sm sm:text-base">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-xs sm:text-sm font-medium"
              style={{ color: entry.color }}
            >
              {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getMonthlyChange = () => {
    if (chartData.length < 2) return { change: 0, isIncrease: false };
    const currentMonth = chartData[chartData.length - 1]?.expenses || 0;
    const previousMonth = chartData[chartData.length - 2]?.expenses || 0;
    if (previousMonth === 0) return { change: 0, isIncrease: false };
    const change = (
      ((currentMonth - previousMonth) / previousMonth) *
      100
    ).toFixed(1);
    return {
      change: Math.abs(change),
      isIncrease: currentMonth > previousMonth,
    };
  };

  const monthlyChange = getMonthlyChange();

  const insights = [
    {
      icon: Target,
      title: "Highest Spending",
      value: highestSpendingCategory.category,
      subtext: `₹${highestSpendingCategory.amount.toLocaleString("en-IN")} total`,
      bgColor:
        "bg-gradient-to-br from-camel-300/20 to-camel-400/10 dark:from-orange-900/20 dark:to-amber-900/20",
      iconBg: "bg-camel-400/30 dark:bg-orange-900/50",
      iconColor: "text-coffee-600 dark:text-orange-400",
    },
    {
      icon: PiggyBank,
      title: "Savings Rate",
      value: `${savingsRate}%`,
      subtext: savingsRate >= 20 ? "Great job!" : "Room for improvement",
      bgColor:
        savingsRate >= 20
          ? "bg-gradient-to-br from-coffee-400/10 to-coffee-500/5 dark:from-emerald-900/20 dark:to-teal-900/20"
          : "bg-gradient-to-br from-camel-300/20 to-camel-400/10 dark:from-amber-900/20 dark:to-yellow-900/20",
      iconBg:
        savingsRate >= 20
          ? "bg-coffee-400/20 dark:bg-emerald-900/50"
          : "bg-camel-400/30 dark:bg-amber-900/50",
      iconColor:
        savingsRate >= 20
          ? "text-coffee-700 dark:text-emerald-400"
          : "text-camel-600 dark:text-amber-400",
    },
    {
      icon: monthlyChange.isIncrease ? TrendingUp : TrendingDown,
      title: "Monthly Change",
      value: `${monthlyChange.isIncrease ? "+" : "-"}${monthlyChange.change}%`,
      subtext: "vs previous month",
      bgColor: monthlyChange.isIncrease
        ? "bg-gradient-to-br from-cocoa-600/10 to-cocoa-700/5 dark:from-rose-900/20 dark:to-red-900/20"
        : "bg-gradient-to-br from-coffee-400/10 to-coffee-500/5 dark:from-emerald-900/20 dark:to-green-900/20",
      iconBg: monthlyChange.isIncrease
        ? "bg-cocoa-600/20 dark:bg-rose-900/50"
        : "bg-coffee-400/20 dark:bg-emerald-900/50",
      iconColor: monthlyChange.isIncrease
        ? "text-cocoa-700 dark:text-rose-400"
        : "text-coffee-600 dark:text-emerald-400",
    },
    {
      icon: Sparkles,
      title: "Avg Monthly Expense",
      value: `₹${Math.round(avgMonthlyExpense).toLocaleString("en-IN")}`,
      subtext: "Based on your history",
      bgColor:
        "bg-gradient-to-br from-coffee-400/10 to-cocoa-600/5 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconBg: "bg-coffee-400/20 dark:bg-blue-900/50",
      iconColor: "text-coffee-600 dark:text-blue-400",
    },
  ];

  const recommendations = [];

  if (savingsRate < 20) {
    recommendations.push({
      type: "warning",
      title: "Increase Your Savings",
      description: `Your savings rate is ${savingsRate}%. Aim for at least 20% to build a healthy emergency fund.`,
    });
  }

  if (highestSpendingCategory.amount > totalExpenses * 0.4) {
    recommendations.push({
      type: "alert",
      title: `High ${highestSpendingCategory.category} Spending`,
      description: `${highestSpendingCategory.category} accounts for over 40% of your expenses. Consider reviewing these costs.`,
    });
  }

  if (monthlyChange.isIncrease && monthlyChange.change > 15) {
    recommendations.push({
      type: "warning",
      title: "Spending Increased",
      description: `Your expenses increased by ${monthlyChange.change}% this month. Check for any unusual transactions.`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "success",
      title: "You're Doing Great!",
      description:
        "Your finances look healthy. Keep up the good work maintaining your budget.",
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`${insight.bgColor} rounded-2xl p-4 sm:p-5 border-4 border-cocoa-900 dark:border-cocoa-800 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group animate-slideUp`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${insight.iconBg} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <Icon
                  size={18}
                  className={`${insight.iconColor} sm:w-[22px] sm:h-[22px]`}
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-coffee-500 dark:text-slate-400 mb-1">
                {insight.title}
              </p>
              <p className="text-lg sm:text-2xl font-bold text-cocoa-800 dark:text-white truncate">
                {insight.value}
              </p>
              <p className="text-[10px] sm:text-xs text-coffee-400 dark:text-slate-400 mt-2 truncate">
                {insight.subtext}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800">
        <h3 className="text-base sm:text-lg font-bold text-cocoa-800 dark:text-white mb-4 sm:mb-5 flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-camel-400/20 dark:bg-primary-900/50 rounded-lg">
            <Sparkles
              size={16}
              className="text-coffee-600 dark:text-primary-400 sm:w-[18px] sm:h-[18px]"
            />
          </div>
          Smart Recommendations
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-3 sm:p-5 rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg ${rec.type === "warning" ? "bg-camel-300/20 dark:bg-amber-900/20 border-camel-500 dark:border-amber-400" : ""} ${rec.type === "alert" ? "bg-cocoa-600/10 dark:bg-rose-900/20 border-cocoa-600 dark:border-rose-400" : ""} ${rec.type === "success" ? "bg-coffee-400/10 dark:bg-emerald-900/20 border-coffee-500 dark:border-emerald-400" : ""}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {rec.type === "success" ? (
                  <CheckCircle2
                    size={18}
                    className="text-coffee-600 dark:text-emerald-500 mt-0.5 shrink-0 sm:w-[22px] sm:h-[22px]"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className={`mt-0.5 shrink-0 sm:w-[22px] sm:h-[22px] ${rec.type === "warning" ? "text-camel-600 dark:text-amber-500" : ""} ${rec.type === "alert" ? "text-cocoa-600 dark:text-rose-500" : ""}`}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-cocoa-800 dark:text-white text-sm sm:text-base">
                    {rec.title}
                  </p>
                  <p className="text-xs sm:text-sm text-coffee-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800">
        <h3 className="text-base sm:text-lg font-bold text-cocoa-800 dark:text-white mb-4 sm:mb-5 flex items-center gap-2">
          <div className="p-1.5 sm:p-2 bg-camel-400/20 dark:bg-primary-900/50 rounded-lg">
            <BarChart3
              size={16}
              className="text-coffee-600 dark:text-primary-400 sm:w-[18px] sm:h-[18px]"
            />
          </div>
          Monthly Income vs Expenses
        </h3>

        {chartData.length === 0 ? (
          <div className="h-48 sm:h-64 flex items-center justify-center text-coffee-400 dark:text-slate-500">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-camel-300/20 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BarChart3
                  size={20}
                  className="text-coffee-400 sm:w-6 sm:h-6"
                />
              </div>
              <p className="font-medium text-sm sm:text-base">
                No data available
              </p>
            </div>
          </div>
        ) : (
          <div className="h-48 sm:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#334155" : "#E0B87A50"}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: darkMode ? "#94A3B8" : "#7B5234",
                    fontSize: 10,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: darkMode ? "#94A3B8" : "#7B5234",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  width={45}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "10px" }}
                  iconType="rect"
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-cocoa-700 dark:text-slate-300 text-xs sm:text-sm">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={darkMode ? "#14B8A6" : "#7B5234"}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill={darkMode ? "#F59E0B" : "#CC9A5A"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800">
        <h3 className="text-base sm:text-lg font-bold text-cocoa-800 dark:text-white mb-4 sm:mb-5">
          Expense Breakdown
        </h3>

        {categoryData.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-coffee-400 dark:text-slate-500">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-camel-300/20 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target size={20} className="text-coffee-400 sm:w-6 sm:h-6" />
              </div>
              <p className="font-medium text-sm sm:text-base">
                No expenses recorded yet
              </p>
              <p className="text-xs text-coffee-300 dark:text-slate-600 mt-1">
                Add some transactions to see breakdown
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {categoryData.slice(0, 5).map((cat) => {
              const percentage =
                totalExpenses > 0
                  ? ((cat.amount / totalExpenses) * 100).toFixed(1)
                  : 0;
              return (
                <div key={cat.category} className="group">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-cocoa-700 dark:text-slate-200 truncate flex-1 pr-2">
                      {cat.category}
                    </span>
                    <span className="text-xs sm:text-sm text-coffee-500 dark:text-slate-400 font-medium flex-shrink-0">
                      ₹{cat.amount.toLocaleString("en-IN")} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 sm:h-3 bg-camel-300/20 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-camel-500 to-coffee-600 dark:from-primary-500 dark:to-primary-600 rounded-full transition-all duration-700 group-hover:from-camel-400 group-hover:to-coffee-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
