import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  TrendingDown,
  Utensils,
  Home,
  Car,
  Zap,
  Film,
  Heart,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  Wallet,
  CircleDot,
  Calendar,
} from "lucide-react";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.abs(value),
  );

const categoryIcons = {
  "Food & Dining": Utensils,
  Housing: Home,
  Transportation: Car,
  Utilities: Zap,
  Entertainment: Film,
  Health: Heart,
  Education: GraduationCap,
  Shopping: ShoppingBag,
  Salary: Briefcase,
  Freelance: Wallet,
  Investment: TrendingUp,
};

const getCategoryIcon = (category) => categoryIcons[category] || CircleDot;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TransactionCalendar = ({ transactions }) => {
  // Initialize calendar to show the most recent month with transactions
  const getInitialMonth = () => {
    if (transactions.length === 0) return new Date();
    
    // Get the most recent transaction date
    const sortedDates = transactions
      .map(t => new Date(t.date))
      .sort((a, b) => b - a);
    
    return sortedDates[0] || new Date();
  };

  const [currentDate, setCurrentDate] = useState(getInitialMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("none");
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // Get transactions grouped by date
  const transactionsByDate = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const dateKey = t.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = { income: 0, expense: 0, transactions: [] };
      }
      if (t.type === "income") {
        grouped[dateKey].income += t.amount;
      } else {
        grouped[dateKey].expense += Math.abs(t.amount);
      }
      grouped[dateKey].transactions.push(t);
    });
    return grouped;
  }, [transactions]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Helper function to format date as YYYY-MM-DD in local timezone
    const formatDateKey = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = formatDateKey(date);
      const dayData = transactionsByDate[dateKey] || null;
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        dateKey,
        data: dayData,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [currentDate, transactionsByDate]);

  // Monthly totals
  const monthlyTotals = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let income = 0,
      expense = 0;

    transactions.forEach((t) => {
      const txDate = new Date(t.date);
      if (txDate.getFullYear() === year && txDate.getMonth() === month) {
        if (t.type === "income") income += t.amount;
        else expense += Math.abs(t.amount);
      }
    });

    return { income, expense, net: income - expense };
  }, [transactions, currentDate]);

  const navigateMonth = (direction) => {
    setSlideDirection(direction > 0 ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1),
      );
      setIsAnimating(false);
    }, 150);
  };

  const handleDateClick = (dayInfo, event) => {
    if (!dayInfo.isCurrentMonth || !dayInfo.data) {
      console.log('No data for this date or not current month', dayInfo);
      return;
    }
    console.log('Date clicked:', dayInfo.dateKey, 'Data:', dayInfo.data);
    
    // Get the clicked element's position
    const rect = event.currentTarget.getBoundingClientRect();
    const calendarRect = event.currentTarget.closest('.calendar-container').getBoundingClientRect();
    
    // Calculate position relative to calendar container
    const top = rect.top - calendarRect.top + rect.height + 8;
    const left = rect.left - calendarRect.left;
    
    setModalPosition({ top, left });
    setSelectedDate(selectedDate?.dateKey === dayInfo.dateKey ? null : dayInfo);
  };

  const selectedTransactions = selectedDate?.data?.transactions || [];

  return (
    <div className="bg-amber-50 dark:bg-zinc-900 rounded-2xl border-2 border-amber-800 dark:border-zinc-700 overflow-visible relative calendar-container">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b-2 border-amber-800 dark:border-zinc-700 bg-amber-100/50 dark:bg-zinc-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 dark:bg-amber-700 flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-white">
              Calendar View
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg bg-amber-200 dark:bg-zinc-700 text-amber-800 dark:text-zinc-300 hover:bg-amber-300 dark:hover:bg-zinc-600 transition-colors border-2 border-amber-600 dark:border-zinc-600"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-[160px] text-center">
              <span className="text-lg font-semibold text-amber-900 dark:text-white">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg bg-amber-200 dark:bg-zinc-700 text-amber-800 dark:text-zinc-300 hover:bg-amber-300 dark:hover:bg-zinc-600 transition-colors border-2 border-amber-600 dark:border-zinc-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3 border-2 border-green-700 dark:border-green-600">
            <p className="text-xs text-green-700 dark:text-green-400 mb-1">
              Income
            </p>
            <p className="text-lg font-bold text-green-800 dark:text-green-300">
              +₹{formatINR(monthlyTotals.income)}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-3 border-2 border-red-700 dark:border-red-600">
            <p className="text-xs text-red-700 dark:text-red-400 mb-1">
              Expense
            </p>
            <p className="text-lg font-bold text-red-800 dark:text-red-300">
              -₹{formatINR(monthlyTotals.expense)}
            </p>
          </div>
          <div
            className={`rounded-xl p-3 border-2 ${
              monthlyTotals.net >= 0
                ? "bg-amber-100 dark:bg-amber-900/30 border-amber-700 dark:border-amber-600"
                : "bg-orange-100 dark:bg-orange-900/30 border-orange-700 dark:border-orange-600"
            }`}
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">
              Net
            </p>
            <p
              className={`text-lg font-bold ${monthlyTotals.net >= 0 ? "text-amber-800 dark:text-amber-300" : "text-orange-800 dark:text-orange-300"}`}
            >
              {monthlyTotals.net >= 0 ? "+" : ""}₹{formatINR(monthlyTotals.net)}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-amber-700 dark:text-zinc-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          className={`grid grid-cols-7 gap-1 transition-all duration-150 ${
            isAnimating
              ? slideDirection === "left"
                ? "opacity-0 translate-x-4"
                : "opacity-0 -translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          {calendarDays.map((dayInfo, index) => {
            const hasData = dayInfo.data;
            const hasIncome = hasData && dayInfo.data.income > 0;
            const hasExpense = hasData && dayInfo.data.expense > 0;
            const isSelected = selectedDate?.dateKey === dayInfo.dateKey;
            const isToday =
              dayInfo.date.toDateString() === new Date().toDateString();

            return (
              <button
                key={index}
                onClick={(e) => handleDateClick(dayInfo, e)}
                disabled={!dayInfo.isCurrentMonth || !hasData}
                className={`
                  relative aspect-square rounded-xl p-1 sm:p-2 transition-all duration-200 border-2
                  ${
                    !dayInfo.isCurrentMonth
                      ? "text-amber-400 dark:text-zinc-600 border-transparent cursor-default"
                      : hasData
                        ? isSelected
                          ? "bg-amber-800 dark:bg-amber-700 text-white border-amber-900 dark:border-amber-500 scale-105 shadow-lg"
                          : "bg-amber-100 dark:bg-zinc-800 text-amber-900 dark:text-white border-amber-600 dark:border-zinc-600 hover:scale-105 hover:shadow-md cursor-pointer"
                        : "text-amber-700 dark:text-zinc-400 border-transparent hover:bg-amber-100/50 dark:hover:bg-zinc-800/50"
                  }
                  ${isToday && dayInfo.isCurrentMonth ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-50 dark:ring-offset-zinc-900" : ""}
                `}
              >
                <span
                  className={`text-sm font-medium ${isSelected ? "text-white" : ""}`}
                >
                  {dayInfo.day}
                </span>

                {/* Income/Expense Indicators */}
                {hasData && dayInfo.isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {hasIncome && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-green-300" : "bg-green-500"} animate-pulse`}
                      />
                    )}
                    {hasExpense && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-red-300" : "bg-red-500"} animate-pulse`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t-2 border-amber-300 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs text-amber-700 dark:text-zinc-400">
              Income
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-amber-700 dark:text-zinc-400">
              Expense
            </span>
          </div>
        </div>
      </div>

      {/* Floating Transaction Details Popup */}
      {selectedDate && selectedDate.data && (
        <>
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 animate-fadeIn"
            onClick={() => setSelectedDate(null)}
          />
          
          {/* Popup Card */}
          <div 
            className="absolute z-50 animate-popIn"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
              maxWidth: '380px',
              minWidth: '320px'
            }}
          >
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border-2 border-amber-800 dark:border-amber-600 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-zinc-700 dark:to-zinc-800 p-4 border-b-2 border-amber-300 dark:border-zinc-600">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-amber-900 dark:text-white mb-1">
                      {selectedDate.date.toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      {selectedDate.data.income > 0 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                          <TrendingUp size={12} /> ₹{formatINR(selectedDate.data.income)}
                        </span>
                      )}
                      {selectedDate.data.expense > 0 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-md">
                          <TrendingDown size={12} /> ₹{formatINR(selectedDate.data.expense)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-1.5 rounded-lg bg-amber-200 dark:bg-zinc-600 text-amber-800 dark:text-zinc-300 hover:bg-amber-300 dark:hover:bg-zinc-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Transaction List */}
              <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                {selectedTransactions.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {selectedTransactions.map((tx, index) => {
                      const Icon = getCategoryIcon(tx.category);
                      const isIncome = tx.type === "income";

                      return (
                        <div
                          key={tx.id}
                          className="bg-amber-50 dark:bg-zinc-700 rounded-lg p-3 border border-amber-300 dark:border-zinc-600 
                            hover:shadow-md transition-all animate-fadeSlideIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2
                              ${
                                isIncome
                                  ? "bg-green-100 dark:bg-green-900/30 border-green-600"
                                  : "bg-red-100 dark:bg-red-900/30 border-red-600"
                              }`}
                            >
                              <Icon
                                size={16}
                                className={
                                  isIncome
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-amber-900 dark:text-white truncate">
                                {tx.description}
                              </p>
                              <p className="text-xs text-amber-600 dark:text-zinc-400">
                                {tx.category}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-bold whitespace-nowrap ${
                                isIncome 
                                  ? "text-green-700 dark:text-green-400" 
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {isIncome ? "+" : "-"}₹{formatINR(tx.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-amber-700 dark:text-zinc-400">
                    <p className="text-sm">No transactions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pointer Arrow */}
            <div className="absolute -top-2 left-4 w-4 h-4 bg-amber-800 dark:bg-amber-600 rotate-45 border-l-2 border-t-2 border-amber-800 dark:border-amber-600"></div>
          </div>
        </>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-popIn {
          animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-fadeSlideIn {
          opacity: 0;
          animation: fadeSlideIn 0.3s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b45309;
        }
      `}</style>
    </div>
  );
};

export default TransactionCalendar;
