import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const SummaryCards = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  const cards = [
    {
      title: "Total Balance",
      value: balance,
      icon: Wallet,
      change: "+12.5%",
      changeType: "positive",
      bgGradient: "from-camel-500 via-camel-600 to-coffee-500",
      iconBg: "bg-camel-300/30 dark:bg-primary-900/50",
      iconColor: "text-coffee-600 dark:text-primary-400",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      change: "+8.2%",
      changeType: "positive",
      bgGradient: "from-coffee-500 via-coffee-600 to-cocoa-700",
      iconBg: "bg-coffee-400/20 dark:bg-primary-900/50",
      iconColor: "text-coffee-700 dark:text-primary-400",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      change: "-3.1%",
      changeType: "negative",
      bgGradient: "from-cocoa-600 via-cocoa-700 to-cocoa-800",
      iconBg: "bg-cocoa-600/20 dark:bg-rose-900/50",
      iconColor: "text-cocoa-800 dark:text-rose-400",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-cream-50 dark:bg-slate-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-500 border-4 border-cocoa-900 dark:border-cocoa-800 hover:border-cocoa-800 dark:hover:border-cocoa-700 group hover:-translate-y-1 animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1 min-w-0 flex-1 pr-3">
                <p className="text-xs sm:text-sm font-medium text-coffee-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-cocoa-800 dark:text-white tracking-tight truncate">
                  {formatCurrency(card.value)}
                </p>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${card.changeType === "positive" ? "text-coffee-600 dark:text-primary-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {card.changeType === "positive" ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  <span className="truncate">
                    {card.change} from last month
                  </span>
                </div>
              </div>
              <div
                className={`p-2.5 sm:p-3 lg:p-3.5 rounded-xl lg:rounded-2xl ${card.iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner flex-shrink-0`}
              >
                <Icon
                  size={20}
                  className={`${card.iconColor} sm:w-5 sm:h-5 lg:w-6 lg:h-6`}
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 h-1 sm:h-1.5 w-full rounded-full bg-camel-300/20 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${card.bgGradient} transition-all duration-1000 group-hover:w-full`}
                style={{ width: "70%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
