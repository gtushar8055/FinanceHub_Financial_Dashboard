import { useState, useEffect, useCallback, useRef } from "react";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import useScrollPosition from "./hooks/useScrollPosition";

import CommandBar from "./components/CommandBar";
import CommandPalette from "./components/CommandPalette";
import HeroBalance from "./components/HeroBalance";
import StickyMiniBar from "./components/StickyMiniBar";
import ActivityFeed from "./components/ActivityFeed";
import CategoryBreakdown from "./components/CategoryBreakdown";
import InsightsDrawer from "./components/InsightsDrawer";
import TransactionModal from "./components/TransactionModal";

function AppContent() {
  const { addTransaction, editTransaction } = useFinance();
  const [activeSection, setActiveSection] = useState("overview");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { isScrolled } = useScrollPosition(200);

  const overviewRef = useRef(null);
  const activityRef = useRef(null);

  useKeyboardShortcuts([
    { keys: ["ctrl", "k"], callback: () => setPaletteOpen(true) },
    { keys: ["cmd", "k"], callback: () => setPaletteOpen(true) },
    { keys: ["ctrl", "i"], callback: () => setInsightsOpen((prev) => !prev) },
    { keys: ["cmd", "i"], callback: () => setInsightsOpen((prev) => !prev) },
    {
      keys: ["escape"],
      callback: () => {
        setPaletteOpen(false);
        setInsightsOpen(false);
        setModalOpen(false);
      },
    },
  ]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
    if (sectionId === "insights") {
      setInsightsOpen(true);
    }
  }, []);

  const handleScrollToActivity = () => {
    scrollToSection("activity");
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleSubmitTransaction = (transaction) => {
    if (editingTransaction) {
      editTransaction(transaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setModalOpen(false);
    setEditingTransaction(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY < windowHeight * 0.5) {
        setActiveSection("overview");
      } else {
        setActiveSection("activity");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-zinc-950 transition-colors duration-300">
      <CommandBar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenInsights={() => setInsightsOpen(true)}
      />

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={scrollToSection}
        onAddTransaction={handleAddTransaction}
      />

      <StickyMiniBar visible={isScrolled} />

      <main className="relative">
        <HeroBalance onScrollToActivity={handleScrollToActivity} />
        <ActivityFeed
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
        />
        <CategoryBreakdown />
      </main>

      <InsightsDrawer
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
      />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        editTransaction={editingTransaction}
      />
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
