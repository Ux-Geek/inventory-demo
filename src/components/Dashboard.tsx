import { 
  Smartphone, 
  DollarSign, 
  Archive, 
  ArrowRight, 
  ShieldAlert, 
  BadgeCheck, 
  BarChart2, 
  Plus, 
  Zap, 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  Share2, 
  ExternalLink, 
  ChevronRight, 
  ShoppingBag, 
  User, 
  CheckCircle,
  QrCode,
  Sparkles,
  Percent
} from "lucide-react";
import { motion } from "motion/react";
import { PhoneRecord } from "../types";

interface DashboardProps {
  inventory: PhoneRecord[];
  onNavigate: (tab: "dashboard" | "scanner" | "inventory" | "analytics") => void;
}

export default function Dashboard({ inventory, onNavigate }: DashboardProps) {
  // Compute real key stats
  const totalItems = inventory.length;
  const inStockItems = inventory.filter(item => item.status === "In Stock").length;
  const reservedItems = inventory.filter(item => item.status === "Reserved").length;
  const soldItems = inventory.filter(item => item.status === "Sold").length;
  
  const totalValue = inventory
    .filter(item => item.status === "In Stock")
    .reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);

  // Compute brand shares
  const brandMap: Record<string, number> = {};
  inventory.forEach(item => {
    const brand = item.brand || "Other";
    brandMap[brand] = (brandMap[brand] || 0) + 1;
  });

  const sortedBrands = Object.entries(brandMap)
    .map(([brand, count]) => ({ brand, count, percent: totalItems ? Math.round((count / totalItems) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Filter items in fair/poor condition
  const poorGradedCount = inventory.filter(item => item.condition === "Fair" || item.condition === "Poor").length;

  return (
    <div id="dashboard_view" className="flex flex-col gap-6 py-1 select-none font-body">
      
      {/* 1. MOCK PREMIUM USER HEADING AND BRANDED TOP-BAR */}
      <div className="flex flex-col gap-3.5 bg-white p-4.5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Round Avatar Picture matching user feedback visually */}
            <div className="relative w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden bg-indigo-50 flex items-center justify-center shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Store Manager Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">cell.bumpa.shop</h2>
              <p className="text-[10px] text-slate-400 font-medium">Session Register Active</p>
            </div>
          </div>
          
          {/* Trial / Active Badge */}
          <div className="text-right">
            <span className="text-[10px] pb-1 font-bold text-emerald-600 bg-emerald-55/70 border border-emerald-100/55 rounded-full px-2.5 py-0.5 inline-block">
              Trial: 14 days left
            </span>
          </div>
        </div>

        {/* Dynamic Action Buttons & Header Utilities */}
        <div className="flex items-center justify-between gap-1 mt-1 border-t border-slate-50 pt-3">
          <div className="flex items-center gap-2">
            <button 
              id="visit_store_mock_btn"
              onClick={() => onNavigate("inventory")}
              className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ExternalLink size={11} className="text-slate-400" />
              Visit store
            </button>
            <button 
              id="share_link_mock_btn"
              onClick={() => {
                alert("Branded catalog registry link copied to clipboard!");
              }}
              className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Share2 size={11} className="text-slate-400" />
              Share link
            </button>
          </div>

          {/* Quick Stats/Alert Icons with custom red indicators */}
          <div className="flex items-center gap-2.5 text-slate-500 pr-1">
            <button 
              onClick={() => onNavigate("analytics")} 
              className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
              title="View Metrics"
            >
              <BarChart2 size={16} />
            </button>
            <button 
              onClick={() => alert("No new notifications received in this session.")} 
              className="relative p-1 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <button 
              onClick={() => alert("AssetLedger allows you to track, grade and price hand-held electronic devices with quick appraisal tools.")} 
              className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Help Center"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN VALUATION DISPLAY (Total Orders replica) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight font-medium">Total Inventory Capital</span>
          <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-500 cursor-pointer transition-colors">
            <span>This Week</span>
            <ChevronRight size={10} className="rotate-90 text-slate-400" />
          </div>
        </div>
        
        {/* Huge dynamic appraisal valuation amount */}
        <div className="text-3xl font-black text-slate-900 tracking-tight font-header mt-1">
          <span className="text-xl font-bold align-baseline mr-1 text-slate-800">$</span>
          {totalValue.toLocaleString()}
        </div>
      </div>

      {/* 3. FOUR DISTINCT SOFT COLOR PALETTE STAT CARDS */}
      <div className="grid grid-cols-4 gap-2">
        {/* Soft Green Card (In Stock) */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] p-2.5 rounded-2xl flex flex-col justify-between items-center text-center shadow-xs">
          <span className="text-[15px] font-black text-[#15803d] font-header">
            {inStockItems}
          </span>
          <span className="text-[9px] text-[#166534] font-bold tracking-tight mt-1 truncate w-full">
            In Stock
          </span>
        </div>

        {/* Soft Blue Card (Reserved) */}
        <div className="bg-[#eff6ff] border border-[#dbeafe] p-2.5 rounded-2xl flex flex-col justify-between items-center text-center shadow-xs">
          <span className="text-[15px] font-black text-[#1d4ed8] font-header">
            {reservedItems}
          </span>
          <span className="text-[9px] text-[#1e40af] font-bold tracking-tight mt-1 truncate w-full">
            Reserves
          </span>
        </div>

        {/* Soft Peach Card (Low stock / degraded grades) */}
        <div className="bg-[#fffbeb] border border-[#fef3c7] p-2.5 rounded-2xl flex flex-col justify-between items-center text-center shadow-xs">
          <span className="text-[15px] font-black text-[#b45309] font-header">
            {poorGradedCount}
          </span>
          <span className="text-[9px] text-[#854d0e] font-bold tracking-tight mt-1 truncate w-full">
            Inspections
          </span>
        </div>

        {/* Soft Pink Card (Cleared out/Sold counts) */}
        <div className="bg-[#fff1f2] border border-[#ffe4e6] p-2.5 rounded-2xl flex flex-col justify-between items-center text-center shadow-xs">
          <span className="text-[15px] font-black text-[#be123c] font-header">
            {soldItems}
          </span>
          <span className="text-[9px] text-[#9f1239] font-bold tracking-tight mt-1 truncate w-full">
            Cleared
          </span>
        </div>
      </div>

      {/* 4. SOLID EMERALD GREEN ACTIVE CTA BANNER */}
      <div className="bg-[#00875a] rounded-3xl p-5 text-white flex flex-col gap-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative circles to capture the image vibe */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-8 pointer-events-none" />
        
        <div className="flex flex-col gap-1.5 z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Activate Analytics Wallet
          </h3>
          <p className="text-xs font-medium text-white/95 leading-relaxed">
            Review detailed equipment price margins, realized valuation reports and tracking filters.
          </p>
        </div>

        <div className="z-10 mt-1">
          <button
            id="activate_analytics_pill_btn"
            onClick={() => onNavigate("analytics")}
            className="bg-white text-[#00875a] hover:bg-slate-50 transition-colors font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-full shadow-xs cursor-pointer inline-block"
          >
            Open Performance Dashboard
          </button>
        </div>
      </div>

      {/* 5. TODO GROUP SECTION */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3.5">
        <div className="flex justify-between items-center font-body">
          <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">Todo</h3>
          <button 
            id="view_all_inventory_link"
            onClick={() => onNavigate("inventory")}
            className="text-[11px] font-bold text-emerald-600 hover:text-slate-800 cursor-pointer"
          >
            View all
          </button>
        </div>

        {/* Dynamic Warning Alert Rows mirroring the mock design exactly */}
        <div className="flex flex-col gap-2.5">
          {/* Row 1 */}
          <div 
            onClick={() => onNavigate("inventory")}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-105 rounded-2xl cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-55/70 rounded-xl border border-emerald-100 text-emerald-600 shrink-0">
                <ShoppingBag size={14} />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700 leading-tight">
                {poorGradedCount > 0 
                  ? `You have ${poorGradedCount} devices with low physical wear grading` 
                  : "All system hardware meets baseline wear grades"}
              </span>
            </div>
            <ChevronRight size={14} className="text-slate-350 select-none group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 2 */}
          <div 
            onClick={() => onNavigate("inventory")}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-105 rounded-2xl cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-55/70 rounded-xl border border-emerald-100 text-emerald-600 shrink-0">
                <ShoppingBag size={14} />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700 leading-tight">
                Verify target listings and update appraisal margins
              </span>
            </div>
            <ChevronRight size={14} className="text-slate-350 select-none group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Row 3 */}
          <div 
            onClick={() => onNavigate("inventory")}
            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-105 rounded-2xl cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-55/70 rounded-xl border border-emerald-100 text-emerald-600 shrink-0">
                <ShoppingBag size={14} />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700 leading-tight">
                {inStockItems === 0 
                  ? "Record your first intake to generate full barcode logs" 
                  : `${inStockItems} devices marked available inside immediate stock`}
              </span>
            </div>
            <ChevronRight size={14} className="text-slate-350 select-none group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 6. QUICK ACTIONS - ROTATING SCREEN ACTION ROWS */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3.5">
        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-5 gap-1.5 pt-1.5">
          {/* Action 1 */}
          <button 
            id="qa_action_scanner"
            onClick={() => onNavigate("scanner")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#ecfdf5] border border-emerald-100 text-[#00875a] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Plus size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center w-full truncate leading-tight">
              Intake
            </span>
          </button>

          {/* Action 2 */}
          <button 
            id="qa_action_catalog"
            onClick={() => onNavigate("inventory")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#eff6ff] border border-blue-105 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Archive size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center w-full truncate leading-tight">
              Registry
            </span>
          </button>

          {/* Action 3 */}
          <button 
            id="qa_action_imei"
            onClick={() => {
              onNavigate("scanner");
              setTimeout(() => {
                const step1Btn = document.getElementById("qa_step_imei_trigger");
                if (step1Btn) step1Btn.click();
              }, 150);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#fdf2f8] border border-pink-100 text-pink-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <QrCode size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center w-full truncate leading-tight">
              Verify IMEI
            </span>
          </button>

          {/* Action 4 */}
          <button 
            id="qa_action_stats"
            onClick={() => onNavigate("analytics")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#fffbeb] border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center w-full truncate leading-tight">
              Appraise
            </span>
          </button>

          {/* Action 5 */}
          <button 
            id="qa_action_margins"
            onClick={() => onNavigate("analytics")}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Percent size={16} />
            </div>
            <span className="text-[9px] font-bold text-slate-600 text-center w-full truncate leading-tight">
              Spread
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
