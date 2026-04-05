import { useState, useEffect } from "react";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const incomeCategories = ["Salary", "Freelance", "Investment"];
const expenseCategories = ["Food & Dining", "Utilities", "Housing", "Transportation", "Entertainment", "Health", "Education", "Shopping"];

const TransactionModal = ({ isOpen, onClose, onSubmit, editTransaction }) => {
  const [formData, setFormData] = useState({ description: "", amount: "", type: "expense", category: "", date: new Date().toISOString().split("T")[0] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTransaction) {
      setFormData({ description: editTransaction.description, amount: Math.abs(editTransaction.amount).toString(), type: editTransaction.type, category: editTransaction.category, date: editTransaction.date });
    } else {
      setFormData({ description: "", amount: "", type: "expense", category: "", date: new Date().toISOString().split("T")[0] });
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Enter valid amount";
    if (!formData.category) newErrors.category = "Select category";
    if (!formData.date) newErrors.date = "Select date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const amount = parseFloat(formData.amount);
    onSubmit({ id: editTransaction?.id || Date.now(), description: formData.description.trim(), amount: formData.type === "income" ? amount : -amount, type: formData.type, category: formData.category, date: formData.date });
    onClose();
  };

  const categories = formData.type === "income" ? incomeCategories : expenseCategories;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-amber-50 dark:bg-zinc-900 rounded-2xl shadow-xl border-2 border-amber-800 dark:border-zinc-700">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-800 dark:border-zinc-700 bg-amber-100 dark:bg-zinc-900 rounded-t-2xl">
          <h2 className="text-xl font-bold text-amber-900 dark:text-white">{editTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-amber-200 dark:hover:bg-zinc-800 border-2 border-transparent hover:border-amber-600">
            <X size={20} className="text-amber-700 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-amber-100 dark:bg-zinc-800 rounded-lg border-2 border-amber-600 dark:border-zinc-700">
            <button type="button" onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold transition-colors
                ${formData.type === "expense" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-600" : "text-amber-700 dark:text-zinc-400 border-2 border-transparent"}`}>
              <ArrowDownCircle size={18} /> Expense
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, type: "income", category: "" })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold transition-colors
                ${formData.type === "income" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-600" : "text-amber-700 dark:text-zinc-400 border-2 border-transparent"}`}>
              <ArrowUpCircle size={18} /> Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-1">Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g., Grocery shopping"
              className={`w-full px-4 py-3 rounded-lg bg-amber-100 dark:bg-zinc-800 border-2 ${errors.description ? "border-red-500" : "border-amber-600 dark:border-zinc-700"} text-amber-900 dark:text-white placeholder:text-amber-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30`} />
            {errors.description && <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 dark:text-zinc-400 font-semibold">₹</span>
              <input type="number" step="1" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0"
                className={`w-full pl-8 pr-4 py-3 rounded-lg bg-amber-100 dark:bg-zinc-800 border-2 ${errors.amount ? "border-red-500" : "border-amber-600 dark:border-zinc-700"} text-amber-900 dark:text-white placeholder:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30`} />
            </div>
            {errors.amount && <p className="text-xs text-red-600 mt-1 font-medium">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-amber-100 dark:bg-zinc-800 border-2 ${errors.category ? "border-red-500" : "border-amber-600 dark:border-zinc-700"} text-amber-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer`}>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-600 mt-1 font-medium">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-800 dark:text-zinc-300 mb-1">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-amber-100 dark:bg-zinc-800 border-2 ${errors.date ? "border-red-500" : "border-amber-600 dark:border-zinc-700"} text-amber-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30`} />
            {errors.date && <p className="text-xs text-red-600 mt-1 font-medium">{errors.date}</p>}
          </div>

          <button type="submit"
            className={`w-full py-3 rounded-lg font-bold transition-colors border-2 ${formData.type === "income" ? "bg-green-700 hover:bg-green-800 border-green-900 text-white" : "bg-amber-800 hover:bg-amber-900 border-amber-900 text-white"}`}>
            {editTransaction ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
