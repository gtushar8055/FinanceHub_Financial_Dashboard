import { createContext, useContext, useState, useEffect } from "react";
import { transactions as initialTransactions } from "../data/mockData";

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem("financeHub_userRole");
    return saved || "admin";
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("financeHub_darkMode");
    return saved === "true";
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("financeHub_transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("financeHub_userRole", userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem("financeHub_darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "financeHub_transactions",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  const toggleRole = () => {
    setUserRole((prev) => (prev === "admin" ? "viewer" : "admin"));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const addTransaction = (transaction) => {
    if (userRole !== "admin") return;
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    if (userRole !== "admin") return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const editTransaction = (id, updatedTransaction) => {
    if (userRole !== "admin") return;
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
    );
  };

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Description", "Amount", "Type", "Category"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [t.id, t.date, `"${t.description}"`, t.amount, t.type, t.category].join(
          ",",
        ),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `financehub_transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `financehub_transactions_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const value = {
    userRole,
    setUserRole,
    toggleRole,
    darkMode,
    toggleDarkMode,
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    exportToCSV,
    exportToJSON,
    totalIncome,
    totalExpenses,
    balance,
    sidebarOpen,
    setSidebarOpen,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
