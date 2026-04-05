import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";
import { TrendingUp } from "lucide-react";

const IncomeExpenseChart = () => {
  const { transactions, darkMode } = useFinance();
  const { chartData } = useTransactionStats(transactions);

  const CustomTooltip = ({ active, payload, label }) => {
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

  return (
    <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800 hover:shadow-2xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="min-w-0 flex-1 pr-3">
          <h3 className="text-base sm:text-lg font-bold text-cocoa-800 dark:text-white truncate">
            Income vs Expenses
          </h3>
          <p className="text-xs sm:text-sm text-coffee-500 dark:text-slate-400 mt-1 truncate">
            Monthly comparison overview
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-camel-400/20 dark:bg-primary-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <TrendingUp
            size={18}
            className="text-coffee-600 dark:text-primary-400 sm:w-5 sm:h-5"
          />
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-48 sm:h-64 flex items-center justify-center text-coffee-400 dark:text-slate-500">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-camel-300/20 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={20} className="text-coffee-400 sm:w-6 sm:h-6" />
            </div>
            <p className="font-medium text-sm sm:text-base">
              No data available
            </p>
          </div>
        </div>
      ) : (
        <div className="h-48 sm:h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={darkMode ? "#14B8A6" : "#7B5234"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={darkMode ? "#14B8A6" : "#7B5234"}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={darkMode ? "#F59E0B" : "#CC9A5A"}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={darkMode ? "#F59E0B" : "#CC9A5A"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#334155" : "#E0B87A50"}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: darkMode ? "#94A3B8" : "#7B5234", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: darkMode ? "#94A3B8" : "#7B5234", fontSize: 10 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px" }}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-cocoa-700 dark:text-slate-300 text-xs sm:text-sm">
                    {value}
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={darkMode ? "#14B8A6" : "#7B5234"}
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke={darkMode ? "#F59E0B" : "#CC9A5A"}
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseChart;
