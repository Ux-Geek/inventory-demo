import React, { useState, useEffect } from "react";
import { Search, Plus, ScanLine, Bell, Home, Boxes, Receipt, Users, Settings, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneRecord } from "./types";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Scanner from "./components/Scanner";
import CheckoutFlow from "./components/sales/CheckoutFlow";
import Customers from "./components/Customers";
import Reports from "./components/Reports";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "scanner" | "sales" | "customers" | "settings">("dashboard");
  const [inventory, setInventory] = useState<PhoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionOk, setConnectionOk] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failure loading database.");
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
    <div className="min-h-screen bg-[#f5f5f7] font-[Inter,sans-serif]">
      <div className="mx-auto flex max-w-[430px] flex-col pb-28 relative min-h-screen">
        
        {!connectionOk && (
          <div className="bg-red-500 text-white text-xs px-4 py-3 flex items-center justify-center gap-2">
            <ShieldAlert size={14} />
            <span className="font-medium">Offline Link</span>
            <button onClick={fetchInventory} className="underline font-bold ml-2">Retry</button>
          </div>
        )}

        {/* Global Header */}
        <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">Good morning</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Inventory</h1>
            </div>
            <button className="glass flex h-11 w-11 items-center justify-center rounded-full text-slate-700">
              <Bell size={20} />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm border border-neutral-100">
            <Search size={18} className="text-neutral-400" />
            <input
              placeholder="Search model, IMEI, customer..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </header>

        {/* Main Routing Area */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Dashboard inventory={inventory} onNavigate={setActiveTab} />
                </motion.div>
              )}
              {activeTab === "inventory" && (
                <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Inventory inventory={inventory} onUpdateInventory={fetchInventory} />
                </motion.div>
              )}
              {activeTab === "scanner" && (
                <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Scanner onRecordSaved={fetchInventory} onNavigate={setActiveTab} />
                </motion.div>
              )}
              {activeTab === "sales" && (
                <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CheckoutFlow />
                </motion.div>
              )}
              {activeTab === "customers" && (
                <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Customers />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-[400px] -translate-x-1/2">
          <div className="glass flex justify-between rounded-full px-4 py-3">
            {[
              { id: "dashboard", icon: Home, label: "Home" },
              { id: "inventory", icon: Boxes, label: "Stock" },
              { id: "scanner", icon: ScanLine, label: "Scan" },
              { id: "sales", icon: Receipt, label: "Sales" },
              { id: "customers", icon: Users, label: "Clients" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 text-xs transition-colors ${
                  activeTab === item.id ? "text-black" : "text-neutral-400 hover:text-black"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </div>
  );
}
