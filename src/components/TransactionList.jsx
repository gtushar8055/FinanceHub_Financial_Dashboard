import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit3,
  Plus,
  X,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useDebounce } from "../hooks/useDebounce";
import { categories, transactionTypes } from "../data/mockData";

const TransactionList = () => {
  const {
    transactions,
    userRole,
    deleteTransaction,
    addTransaction,
    editTransaction,
  } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || t.category === selectedCategory;
        const matchesType =
          selectedType === "All" ||
          t.type.toLowerCase() === selectedType.toLowerCase();
        const amount = Math.abs(t.amount);
        const matchesMinAmount = !minAmount || amount >= parseFloat(minAmount);
        const matchesMaxAmount = !maxAmount || amount <= parseFloat(maxAmount);
        const matchesStartDate =
          !startDate || new Date(t.date) >= new Date(startDate);
        const matchesEndDate =
          !endDate || new Date(t.date) <= new Date(endDate);
        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesMinAmount &&
          matchesMaxAmount &&
          matchesStartDate &&
          matchesEndDate
        );
      })
      .sort((a, b) => {
        let compareValue = 0;
        if (sortBy === "date") {
          compareValue = new Date(a.date) - new Date(b.date);
        } else if (sortBy === "amount") {
          compareValue = Math.abs(a.amount) - Math.abs(b.amount);
        }
        return sortOrder === "asc" ? compareValue : -compareValue;
      });
  }, [
    transactions,
    debouncedSearchTerm,
    selectedCategory,
    selectedType,
    sortBy,
    sortOrder,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    selectedType !== "All" ||
    minAmount ||
    maxAmount ||
    startDate ||
    endDate;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(absAmount);
  };

  return (
    <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl shadow-xl border-4 border-cocoa-900 dark:border-cocoa-800 overflow-hidden">
      <div className="p-4 sm:p-6 border-b-4 border-cocoa-900 dark:border-cocoa-800 bg-gradient-to-r from-cream-100 to-cream-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-cocoa-800 dark:text-white">
              Transactions
            </h3>
            <p className="text-xs sm:text-sm text-coffee-500 dark:text-slate-400 mt-1">
              Manage and track all your financial activities
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {userRole === "admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-camel-500 to-coffee-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-camel-500/25 dark:hover:shadow-primary-500/25 transition-all duration-300 hover:scale-105"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-slate-400 sm:w-[18px] sm:h-[18px]"
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder:text-coffee-400 dark:placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 cursor-pointer transition-all duration-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-slate-400 pointer-events-none sm:w-4 sm:h-4"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 cursor-pointer transition-all duration-300"
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-slate-400 pointer-events-none sm:w-4 sm:h-4"
                />
              </div>

              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [by, order] = e.target.value.split("-");
                    setSortBy(by);
                    setSortOrder(order);
                  }}
                  className="w-full appearance-none pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 cursor-pointer transition-all duration-300"
                >
                  <option value="date-desc">Newest</option>
                  <option value="date-asc">Oldest</option>
                  <option value="amount-desc">High ₹</option>
                  <option value="amount-asc">Low ₹</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-slate-400 pointer-events-none sm:w-4 sm:h-4"
                />
              </div>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border-2 ${showAdvancedFilters ? "bg-camel-300/20 dark:bg-primary-900/30 text-coffee-700 dark:text-primary-400 border-camel-400/50 dark:border-primary-700" : "bg-cream-50 dark:bg-slate-700 text-cocoa-700 dark:text-slate-300 border-cocoa-700/20 dark:border-primary-500/30 hover:border-camel-400/50"}`}
              >
                <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Advanced</span>
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="p-3 sm:p-4 bg-camel-300/10 dark:bg-slate-700/50 rounded-xl border-2 border-cocoa-700/20 dark:border-primary-500/30 animate-slideDown">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-coffee-600 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-lg text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-coffee-600 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="₹10,000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-lg text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-coffee-600 dark:text-slate-300 mb-1.5 sm:mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-lg text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-coffee-600 dark:text-slate-300 mb-1.5 sm:mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-lg text-xs sm:text-sm bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm text-cocoa-600 dark:text-rose-400 hover:text-cocoa-700 font-medium flex items-center gap-1"
                >
                  <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-cocoa-700/10 dark:divide-primary-500/20 max-h-[350px] sm:max-h-[500px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 sm:p-16 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-camel-300/20 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce-slow">
              <Filter
                size={24}
                className="text-coffee-400 dark:text-slate-400 sm:w-8 sm:h-8"
              />
            </div>
            <p className="text-cocoa-700 dark:text-slate-300 font-semibold text-base sm:text-lg">
              No transactions found
            </p>
            <p className="text-coffee-400 dark:text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
              Try adjusting your filters or add a new transaction
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="p-3 sm:p-4 hover:bg-camel-300/10 dark:hover:bg-slate-700/50 transition-all duration-300 group animate-fadeIn"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg ${transaction.type === "income" ? "bg-gradient-to-br from-coffee-400 to-coffee-600 shadow-coffee-500/25 dark:from-primary-400 dark:to-primary-600 dark:shadow-primary-500/25" : "bg-gradient-to-br from-camel-500 to-cocoa-600 shadow-camel-500/25 dark:from-orange-400 dark:to-rose-500 dark:shadow-orange-500/25"}`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="text-white w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                  ) : (
                    <ArrowDownRight className="text-white w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-cocoa-800 dark:text-white truncate text-sm sm:text-base">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 flex-wrap">
                    <span className="text-[10px] sm:text-xs text-coffee-400 dark:text-slate-500 flex items-center gap-0.5 sm:gap-1">
                      <Calendar size={10} className="sm:w-3 sm:h-3" />
                      {formatDate(transaction.date)}
                    </span>
                    <span className="w-1 h-1 bg-camel-400/50 dark:bg-slate-600 rounded-full hidden sm:block" />
                    <span className="text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-camel-300/20 dark:bg-slate-700 text-coffee-600 dark:text-slate-300 rounded-full font-medium truncate max-w-[80px] sm:max-w-none">
                      {transaction.category}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm sm:text-lg font-bold ${transaction.type === "income" ? "text-coffee-600 dark:text-primary-400" : "text-cocoa-600 dark:text-rose-400"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                {userRole === "admin" && (
                  <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="p-1.5 sm:p-2.5 hover:bg-coffee-400/20 dark:hover:bg-blue-900/30 rounded-lg sm:rounded-xl transition-colors"
                    >
                      <Edit3
                        size={14}
                        className="text-coffee-500 dark:text-blue-500 sm:w-4 sm:h-4"
                      />
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-1.5 sm:p-2.5 hover:bg-cocoa-600/20 dark:hover:bg-rose-900/30 rounded-lg sm:rounded-xl transition-colors"
                    >
                      <Trash2
                        size={14}
                        className="text-cocoa-600 dark:text-rose-500 sm:w-4 sm:h-4"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 sm:p-4 border-t-2 border-cocoa-700/20 dark:border-primary-500/30 bg-camel-300/10 dark:bg-slate-800/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs sm:text-sm text-coffee-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-cocoa-700 dark:text-slate-200">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-cocoa-700 dark:text-slate-200">
              {transactions.length}
            </span>{" "}
            transactions
          </p>
          {hasActiveFilters && (
            <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-camel-400/20 dark:bg-primary-900/30 text-coffee-700 dark:text-primary-400 rounded-full font-medium">
              Filters Active
            </span>
          )}
        </div>
      </div>

      {(showAddModal || editingTransaction) && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
          onSave={(data) => {
            if (editingTransaction) {
              editTransaction(editingTransaction.id, data);
            } else {
              addTransaction(data);
            }
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

const TransactionModal = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: transaction?.description || "",
    amount: transaction ? Math.abs(transaction.amount) : "",
    type: transaction?.type || "expense",
    category: transaction?.category || "Food & Dining",
    date: transaction?.date || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount =
      formData.type === "expense"
        ? -Math.abs(parseFloat(formData.amount))
        : Math.abs(parseFloat(formData.amount));
    onSave({ ...formData, amount });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
      <div className="bg-cream-50 dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border-4 border-cocoa-900 dark:border-cocoa-800 animate-scaleIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-cocoa-700/20 dark:border-primary-500/30 sticky top-0 bg-cream-50 dark:bg-slate-800">
          <h3 className="text-lg sm:text-xl font-bold text-cocoa-800 dark:text-white">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-camel-300/20 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X
              size={18}
              className="text-coffee-500 dark:text-slate-400 sm:w-5 sm:h-5"
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-cocoa-700 dark:text-slate-200 mb-1.5 sm:mb-2">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 transition-all duration-300"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cocoa-700 dark:text-slate-200 mb-1.5 sm:mb-2">
                Amount
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 transition-all duration-300"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cocoa-700 dark:text-slate-200 mb-1.5 sm:mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 transition-all duration-300"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cocoa-700 dark:text-slate-200 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 transition-all duration-300"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-cocoa-700 dark:text-slate-200 mb-1.5 sm:mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl bg-cream-50 dark:bg-slate-700 text-cocoa-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-camel-500 dark:focus:ring-primary-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-cocoa-700/20 dark:border-primary-500/30 rounded-xl text-sm font-semibold text-cocoa-700 dark:text-slate-200 hover:bg-camel-300/20 dark:hover:bg-slate-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-camel-500 to-coffee-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-camel-500/25 dark:hover:shadow-primary-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              {transaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionList;
