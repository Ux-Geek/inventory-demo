import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { PhoneRecord } from "./types";
import FloatingDock from "./components/layout/FloatingDock";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Scanner from "./components/Scanner";
import CheckoutFlow from "./components/sales/CheckoutFlow";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import DesktopHeader from "./components/layout/DesktopHeader";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "scanner" | "sales" | "customers" | "settings">("dashboard");
  const [inventory, setInventory] = useState<PhoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionOk, setConnectionOk] = useState(true);

  // Fetch from in-memory API
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory");
      if (!res.ok) {
        throw new Error("Failure loading database.");
      }
      const data = await res.json();
      setInventory(data);
      setConnectionOk(true);
    } catch (err) {
      console.error("API link failed:", err);
      setConnectionOk(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-[var(--text-color)] font-body antialiased overflow-hidden">
      
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        className="hidden md:flex" 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* Desktop Header */}
        <DesktopHeader className="hidden md:flex" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          {!connectionOk && (
            <div className="bg-rose-500 text-white text-xs px-4 py-3 flex items-center justify-center gap-2 w-full">
              <ShieldAlert size={14} />
              <span className="font-medium">Offline System Ledger Database Link.</span>
              <button onClick={fetchInventory} className="underline font-bold ml-2">Retry Sync</button>
            </div>
          )}

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-black dark:border-slate-700 dark:border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard 
                inventory={inventory} 
                onNavigate={setActiveTab} 
              />
            </motion.div>
          )}
          {activeTab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Inventory 
                inventory={inventory} 
                onUpdateInventory={fetchInventory} 
              />
            </motion.div>
          )}
          {activeTab === "scanner" && (
            <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Scanner 
                onRecordSaved={fetchInventory} 
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}
          {/* We will build these placeholders next */}
          {activeTab === "sales" && (
            <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckoutFlow />
            </motion.div>
          )}
          {activeTab === "customers" && (
            <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-screen">
              <p className="text-muted text-body-large">Customers Module (Coming Soon)</p>
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-screen">
              <p className="text-muted text-body-large">Settings Module (Coming Soon)</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
        </main>
      </div>

      <div className="md:hidden">
        <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
