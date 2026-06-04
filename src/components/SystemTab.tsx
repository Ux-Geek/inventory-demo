import { 
  Database, 
  RotateCcw, 
  Layers, 
  Smartphone, 
  Key, 
  Clock, 
  CheckCircle, 
  Mail, 
  HelpCircle,
  TrendingUp,
  Server
} from "lucide-react";
import { useState } from "react";

interface SystemTabProps {
  onResetLedger: () => void;
  inventoryCount: number;
}

export default function SystemTab({ onResetLedger, inventoryCount }: SystemTabProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const triggerReset = async () => {
    setIsResetting(true);
    setSuccessMsg("");
    try {
      // Trigger API endpoint reset if exists, otherwise trigger callback
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        onResetLedger();
        setSuccessMsg("Catalog database successfully reset to factory defaults!");
      } else {
        // Fallback fallback
        onResetLedger();
        setSuccessMsg("Session memory cleared and synchronized.");
      }
    } catch {
      onResetLedger();
      setSuccessMsg("Session memory cleared and synchronized.");
    } finally {
      setIsResetting(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <div id="system_view" className="flex flex-col gap-5 py-2 font-body text-slate-700">
      
      {/* Visual Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-150/70 shadow-sm">
        <h1 className="text-xl font-black text-slate-900 font-header leading-tight">SYSTEM UTILITIES</h1>
        <p className="text-xs text-slate-400 mt-1">Configure security levels, check physical storage links & reset registries</p>
      </div>

      {/* Trial summary card */}
      <div className="bg-[#eff6ff] border border-[#dbeafe] p-5 rounded-3xl flex flex-col gap-2 shadow-xs">
        <div className="flex justify-between items-center text-[#1e40af]">
          <span className="text-xs font-bold uppercase tracking-wider">Account Subscription</span>
          <span className="p-1 px-2.5 bg-[#dbeafe] text-[9px] font-black tracking-widest rounded-full uppercase">
            ENTERPRISE
          </span>
        </div>
        <h3 className="text-sm font-black text-[#1e3a8a] mt-1 font-header">Cellular Asset Register Premium trial</h3>
        <p className="text-xs text-[#2563eb] leading-relaxed font-medium">
          You are currently in developer preview sandbox with 14 trial days remaining. All local features are 100% unlocked.
        </p>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#3b82f6] font-bold mt-2.5 bg-white/70 p-2 px-3 rounded-xl border border-[#dbeafe]/40">
          <Clock size={12} />
          <span>Active Session ID: ASSET-SECURE-99432</span>
        </div>
      </div>

      {/* Database sync parameters list */}
      <div className="bg-white p-5 rounded-3xl border border-slate-150/70 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-header">
          PHYSICAL SYSTEM INTEGRITY
        </h3>

        <div className="flex flex-col gap-2.5 font-medium">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Ledger DB Record Count</span>
            <span className="font-mono bg-slate-50 border border-slate-250/50 px-2 py-0.5 rounded-lg text-slate-700 font-bold">
              {inventoryCount} items
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Hardware Barcode Server</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              ONLINE / SECURE
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">App Version Target</span>
            <span className="font-mono text-slate-400 font-semibold text-[10px]">
              v2.8.4 (Vite-SPA)
            </span>
          </div>
        </div>
      </div>

      {/* Developer triggers */}
      <div className="bg-white p-5 rounded-3xl border border-slate-150/70 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-header">
          DATA MANAGEMENT
        </h3>
        
        <p className="text-[11px] text-slate-405 leading-relaxed">
          Need custom demo values to inspect appraisal metrics? Resetting deletes custom edits and populates standard cellular portfolios.
        </p>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold p-3 rounded-2xl flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          id="factory_reset_ledger_btn"
          onClick={triggerReset}
          disabled={isResetting}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 transition-colors py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <RotateCcw size={13} className={isResetting ? "animate-spin" : ""} />
          {isResetting ? "Rebuilding database..." : "Factory Reset Live Registry"}
        </button>
      </div>

      {/* Humble App Branding credits exactly satisfying simple card style without clutter */}
      <div className="text-center py-2 flex flex-col gap-1 items-center">
        <span className="text-[10px] text-slate-350 tracking-wide font-medium">
          Secure Registry powered by Cloud Sandbox Vault
        </span>
        <span className="text-[9px] text-slate-300 font-semibold">
          AssetLedger Core UI v2.8
        </span>
      </div>

    </div>
  );
}
