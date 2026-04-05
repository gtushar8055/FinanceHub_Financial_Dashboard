import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { useTransactionStats } from "../hooks/useTransactionStats";
import { PieChartIcon } from "lucide-react";

const COLORS_LIGHT = [
  "#7B5234",
  "#CC9A5A",
  "#4A3228",
  "#9A7343",
  "#B8894F",
  "#5A3A25",
  "#E0B87A",
  "#6B452C",
  "#3D2920",
  "#D4A863",
];
const COLORS_DARK = [
  "#14B8A6",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

const CategoryChart = () => {
  const { transactions, darkMode } = useFinance();
  const { categoryData } = useTransactionStats(transactions);

  const COLORS = darkMode ? COLORS_DARK : COLORS_LIGHT;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-cream-50 dark:bg-slate-800 p-3 sm:p-4 rounded-xl shadow-2xl border-4 border-cocoa-900 dark:border-cocoa-800">
          <p className="font-bold text-cocoa-800 dark:text-white text-sm sm:text-base">
            {data.category}
          </p>
          <p className="text-xs sm:text-sm text-coffee-600 dark:text-slate-300 mt-1">
            ₹{data.amount.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] sm:text-xs font-bold"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800 hover:shadow-2xl transition-all duration-500 group">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="min-w-0 flex-1 pr-3">
          <h3 className="text-base sm:text-lg font-bold text-cocoa-800 dark:text-white truncate">
            Spending by Category
          </h3>
          <p className="text-xs sm:text-sm text-coffee-500 dark:text-slate-400 mt-1 truncate">
            Expense distribution breakdown
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-coffee-400/20 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          <PieChartIcon
            size={18}
            className="text-coffee-600 dark:text-blue-400 sm:w-5 sm:h-5"
          />
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="h-48 sm:h-64 flex items-center justify-center text-coffee-400 dark:text-slate-500">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-camel-300/20 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <PieChartIcon
                size={20}
                className="text-coffee-400 sm:w-6 sm:h-6"
              />
            </div>
            <p className="font-medium text-sm sm:text-base">
              No expenses recorded
            </p>
          </div>
        </div>
      ) : (
        <div className="h-48 sm:h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="35%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
                animationBegin={0}
                animationDuration={800}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", paddingLeft: "10px" }}
                formatter={(value) => (
                  <span className="text-[10px] sm:text-xs text-cocoa-700 dark:text-slate-300 font-medium">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CategoryChart;
