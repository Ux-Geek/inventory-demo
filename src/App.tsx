import { useState, useEffect } from "react";
import { 
  Smartphone, 
  BarChart2, 
  ShieldAlert, 
  Archive, 
  Plus, 
  LayoutDashboard, 
  Home, 
  Settings, 
  Sliders, 
  Menu, 
  User,
  X
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Scanner from "./components/Scanner";
import Inventory from "./components/Inventory";
import Analytics from "./components/Analytics";
import SystemTab from "./components/SystemTab";
import { PhoneRecord } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "scanner" | "inventory" | "analytics" | "system">("dashboard");
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
    <div id="app_frame_container" className="min-h-screen bg-slate-100 flex items-center justify-center font-body tracking-normal selection:bg-slate-900 selection:text-white antialiased p-0 md:p-4">
      
      {/* Premium Desktop Handheld Mockup container with elegant presentation shadow */}
      <div 
        id="phone_outer_body" 
        className="w-full max-w-sm min-h-screen md:min-h-[812px] md:max-h-[850px] bg-[#f8f9fa] md:rounded-[36px] md:shadow-[0_24px_50px_-10px_rgba(30,41,59,0.15)] relative flex flex-col overflow-hidden border border-slate-200/80"
      >
        {/* Sleek, flat top simulated device status area */}
        <div className="hidden md:block h-6 bg-slate-50 border-b border-slate-100 shrink-0 select-none">
          <div className="flex justify-between items-center px-6 h-full text-[9px] font-bold text-slate-400 font-mono tracking-wider">
            <span>NETWORK SECURE</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Top App Header Controls */}
        <header className="bg-white border-b border-slate-150/70 px-4.5 py-4 flex justify-between items-center shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 text-white p-2 rounded-xl flex items-center justify-center">
              <Smartphone size={15} />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest text-slate-900 uppercase font-header">ASSETLEDGER</span>
              <span className="text-[8px] font-black text-indigo-700 bg-indigo-50 border border-indigo-150 pl-1 pr-1.5 py-0.2 rounded ml-1.5 uppercase tracking-wide">
                SYS-RF
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-[9px] text-[#059669] font-black uppercase bg-[#ecfdf5] border border-[#d1fae5] px-2.5 py-1 rounded-full flex items-center gap-1.5 tracking-wider font-extrabold">
              <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
              LIVE REGISTER
            </span>
          </div>
        </header>

        {/* FLOATING ACTION PLUS BUTTON AT BOTTOM RIGHT */}
        <button
          id="floating_add_unit_fab"
          onClick={() => {
            if (activeTab === "scanner") {
              setActiveTab("dashboard");
            } else {
              setActiveTab("scanner");
            }
          }}
          className={`fixed md:absolute bottom-20 right-5 z-50 w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === "scanner" 
              ? "bg-slate-900 hover:bg-black rotate-45" 
              : "bg-[#00875a] hover:bg-[#00704a] hover:shadow-2xl hover:-translate-y-0.5 animate-pulse"
          }`}
          title="Add New Asset Unit"
        >
          <Plus size={24} className="transition-transform duration-200" />
        </button>

        {/* Dynamic Inner Tab Content Layout */}
        <main className="flex-1 overflow-y-auto px-4.5 py-4 bg-slate-50/50 relative">
          
          {/* Diagnostic connection warnings */}
          {!connectionOk && (
            <div className="bg-rose-50 border border-rose-150 text-rose-800 text-[11px] p-3.5 rounded-2xl mb-4.5 flex items-start gap-2.5 z-10 relative">
              <ShieldAlert className="text-rose-600 shrink-0" size={14} />
              <div>
                <span className="font-extrabold block">OFFLINE SYSTEM LEDGER DATABASE LINK</span>
                Unable to query cloud ledger. Sync again or check variables config.
                <button 
                  onClick={fetchInventory} 
                  className="underline ml-1 font-bold inline-block cursor-pointer text-indigo-700"
                >
                  Sync again
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3.5 font-body">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Accessing secure ledgers...</span>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard 
                  inventory={inventory} 
                  onNavigate={setTab => setActiveTab(setTab)} 
                />
              )}
              {activeTab === "scanner" && (
                <Scanner 
                  onRecordSaved={fetchInventory} 
                  onNavigate={setTab => setActiveTab(setTab)}
                />
              )}
              {activeTab === "inventory" && (
                <Inventory 
                  inventory={inventory} 
                  onUpdateInventory={fetchInventory} 
                />
              )}
              {activeTab === "analytics" && (
                <Analytics 
                  inventory={inventory}   
                />
              )}
              {activeTab === "system" && (
                <SystemTab 
                  inventoryCount={inventory.length} 
                  onResetLedger={fetchInventory} 
                />
              )}
            </>
          )}
        </main>

        {/* BOTTOM RESPONSIVE NAVIGATION SHELL */}
        {/* Represents exactly standard layout matching user uploaded image */}
        <nav className="bg-white border-t border-slate-150/70 px-3.5 py-2.5 flex justify-between items-center gap-1 shrink-0 z-40 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] select-none">
          {/* Home / Console */}
          <button
            id="tab_nav_dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
              activeTab === "dashboard" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Home size={18} className={activeTab === "dashboard" ? "scale-105 text-[#00875a]" : ""} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
          </button>

          {/* Products / Catalog */}
          <button
            id="tab_nav_inventory"
            onClick={() => setActiveTab("inventory")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
              activeTab === "inventory" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Archive size={18} className={activeTab === "inventory" ? "scale-105 text-[#00875a]" : ""} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Products</span>
          </button>

          {/* Metrics / Analytics */}
          <button
            id="tab_nav_analytics"
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
              activeTab === "analytics" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <BarChart2 size={18} className={activeTab === "analytics" ? "scale-105 text-[#00875a]" : ""} />
            <span className="text-[9px] font-bold uppercase tracking-wider">Metrics</span>
          </button>

          {/* More / System config */}
          <button
            id="tab_nav_system"
            onClick={() => setActiveTab("system")}
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all select-none cursor-pointer ${
              activeTab === "system" ? "text-[#00875a] font-bold" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Sliders size={18} className={activeTab === "system" ? "scale-105 text-[#00875a]" : ""} />
            <span className="text-[9px] font-bold uppercase tracking-wider">More</span>
          </button>
        </nav>

        {/* Desktop simulated sleek footer indicator line */}
        <div className="hidden md:block h-3.5 bg-white shrink-0 relative">
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-slate-200 rounded-full" />
        </div>

      </div>
    </div>
  );
}
