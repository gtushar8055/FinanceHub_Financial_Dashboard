import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Utensils,
  Home,
  Car,
  Zap,
  Film,
  Heart,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Wallet,
  CircleDot,
  CalendarDays,
  List,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { useDebounce } from "../hooks/useDebounce";
import TransactionCalendar from "./TransactionCalendar";

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const FilterChips = ({ categories, activeFilters, onToggle }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      onClick={() => onToggle("all")}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border-2
        ${activeFilters.length === 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-800 dark:border-amber-600" : "bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-zinc-400 border-amber-300 dark:border-zinc-700 hover:border-amber-600"}`}
    >
      All
    </button>
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onToggle(cat)}
        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border-2
          ${activeFilters.includes(cat) ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-800 dark:border-amber-600" : "bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-zinc-400 border-amber-300 dark:border-zinc-700 hover:border-amber-600"}`}
      >
        {cat}
      </button>
    ))}
  </div>
);

const TransactionItem = ({ transaction, isAdmin, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === "income";

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(transaction.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className="bg-amber-50 dark:bg-zinc-900 rounded-xl p-4 border-2 border-amber-800 dark:border-zinc-700 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => isAdmin && setShowActions(!showActions)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2
          ${isIncome ? "bg-green-100 dark:bg-green-900/30 border-green-700 dark:border-green-600" : "bg-red-100 dark:bg-red-900/30 border-red-700 dark:border-red-600"}`}
        >
          <Icon
            size={18}
            className={
              isIncome
                ? "text-green-700 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-amber-900 dark:text-white truncate">
            {transaction.description}
          </p>
          <p className="text-sm text-amber-700 dark:text-zinc-400">
            {transaction.category} • {formatDate(transaction.date)}
          </p>
        </div>
        <p
          className={`text-lg font-bold whitespace-nowrap ${isIncome ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {isIncome ? "+" : "-"}₹{formatINR(transaction.amount)}
        </p>
      </div>
      {showActions && isAdmin && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-amber-300 dark:border-zinc-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(transaction);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-sm font-medium border-2 border-amber-600 dark:border-amber-600 hover:bg-amber-200"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2
              ${confirmDelete ? "bg-red-600 text-white border-red-800" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-600 hover:bg-red-200"}`}
          >
            {confirmDelete ? <Check size={14} /> : <Trash2 size={14} />}
            {confirmDelete ? "Confirm" : "Delete"}
          </button>
          {confirmDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
              className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-zinc-800"
            >
              <X size={14} className="text-amber-700 dark:text-zinc-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ActivityFeed = ({ onAddTransaction, onEditTransaction }) => {
  const { transactions, userRole, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const debouncedSearch = useDebounce(searchTerm, 300);

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).sort(),
    [transactions],
  );

  const toggleFilter = (category) => {
    if (category === "all") setActiveFilters([]);
    else
      setActiveFilters((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category],
      );
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          !debouncedSearch ||
          t.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.category.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesFilter =
          activeFilters.length === 0 || activeFilters.includes(t.category);
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, debouncedSearch, activeFilters]);

  const isAdmin = userRole === "admin";

  return (
    <section
      id="activity"
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-16 bg-amber-100/50 dark:bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-white">
              Transactions
            </h2>
            <p className="text-amber-700 dark:text-zinc-400">
              {filteredTransactions.length} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-amber-200 dark:bg-zinc-800 rounded-lg p-1 border-2 border-amber-600 dark:border-zinc-600">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-amber-800 dark:bg-amber-700 text-white"
                    : "text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white"
                }`}
              >
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "calendar"
                    ? "bg-amber-800 dark:bg-amber-700 text-white"
                    : "text-amber-700 dark:text-zinc-400 hover:text-amber-900 dark:hover:text-white"
                }`}
              >
                <CalendarDays size={16} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
            {isAdmin && (
              <button
                onClick={onAddTransaction}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-800 dark:bg-amber-700 text-white font-medium hover:bg-amber-900 dark:hover:bg-amber-600 transition-colors border-2 border-amber-900 dark:border-amber-600"
              >
                <Plus size={18} /> Add Transaction
              </button>
            )}
          </div>
        </div>

        {viewMode === "list" && (
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-zinc-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-amber-50 dark:bg-zinc-900 border-2 border-amber-800 dark:border-zinc-700 text-amber-900 dark:text-white placeholder:text-amber-600 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
        )}

        {viewMode === "list" && (
          <div className="mb-6">
            <FilterChips
              categories={categories}
              activeFilters={activeFilters}
              onToggle={toggleFilter}
            />
          </div>
        )}

        {viewMode === "calendar" && (
          <div className="mb-6">
            <TransactionCalendar transactions={transactions} />
          </div>
        )}

        {viewMode === "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  isAdmin={isAdmin}
                  onEdit={onEditTransaction}
                  onDelete={deleteTransaction}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-200 dark:bg-zinc-800 flex items-center justify-center border-2 border-amber-800 dark:border-zinc-600">
                  <Search
                    size={24}
                    className="text-amber-700 dark:text-zinc-400"
                  />
                </div>
                <p className="text-amber-700 dark:text-zinc-400 mb-2">
                  {searchTerm || activeFilters.length > 0
                    ? "No transactions found"
                    : "No transactions yet"}
                </p>
                {isAdmin && !searchTerm && activeFilters.length === 0 && (
                  <button
                    onClick={onAddTransaction}
                    className="text-amber-800 dark:text-amber-400 font-medium hover:underline"
                  >
                    Add your first transaction
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityFeed;
