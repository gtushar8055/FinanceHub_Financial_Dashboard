import { useMemo } from "react";

export const useTransactionStats = (transactions) => {
  return useMemo(() => {
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        acc[month].income += t.amount;
      } else {
        acc[month].expenses += Math.abs(t.amount);
      }
      return acc;
    }, {});

    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = Object.values(monthlyData).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
    );

    const categoryData = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const existing = acc.find((c) => c.category === t.category);
        if (existing) {
          existing.amount += Math.abs(t.amount);
        } else {
          acc.push({ category: t.category, amount: Math.abs(t.amount) });
        }
        return acc;
      }, [])
      .sort((a, b) => b.amount - a.amount);

    const highestSpendingCategory = categoryData[0] || {
      category: "None",
      amount: 0,
    };

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const avgMonthlyExpense =
      chartData.length > 0 ? totalExpenses / chartData.length : 0;

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0;

    return {
      chartData,
      categoryData,
      highestSpendingCategory,
      avgMonthlyExpense,
      savingsRate,
      totalExpenses,
      totalIncome,
    };
  }, [transactions]);
};
