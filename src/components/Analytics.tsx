import { DollarSign, Percent, TrendingUp, Smartphone, Shield, ShoppingBag, PieChart, BarChart2, Layers, Flame } from "lucide-react";
import { PhoneRecord } from "../types";

interface AnalyticsProps {
  inventory: PhoneRecord[];
}

export default function Analytics({ inventory }: AnalyticsProps) {
  // 1. Calculations
  const totalCount = inventory.length;
  const inStock = inventory.filter(item => item.status === "In Stock");
  const reserved = inventory.filter(item => item.status === "Reserved");
  const sold = inventory.filter(item => item.status === "Sold");

  // Sum valuations
  const estimatedCost = inventory.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const totalAskingPrice = inventory.reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);
  const potentialProfit = Math.max(0, totalAskingPrice - estimatedCost);
  const marginPercentage = estimatedCost > 0 ? Math.round((potentialProfit / estimatedCost) * 105) : 0;

  // Realized Earnings (Solds)
  const realizedRevenue = sold.reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);
  const realizedValuation = sold.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const realizedProfit = Math.max(0, realizedRevenue - realizedValuation);

  // Brand Shares
  const brands: Record<string, { count: number; value: number }> = {};
  inventory.forEach(item => {
    const b = item.brand || "Other";
    if (!brands[b]) brands[b] = { count: 0, value: 0 };
    brands[b].count += 1;
    brands[b].value += (item.sellerPrice || item.estimatedValue || 0);
  });

  const brandStats = Object.entries(brands).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
    percent: totalCount ? Math.round((data.count / totalCount) * 100) : 0
  })).sort((a, b) => b.value - a.value);

  // Conditions count
  const conditions = { Excellent: 0, Good: 0, Fair: 0, Poor: 0 };
  inventory.forEach(item => {
    if (item.condition in conditions) {
      conditions[item.condition as keyof typeof conditions] += 1;
    }
  });

  // Hot Items (Highest Prices)
  const premiumPhones = [...inventory]
    .sort((a, b) => (b.sellerPrice || 0) - (a.sellerPrice || 0))
    .slice(0, 3);

  return (
    <div id="analytics_view" className="flex flex-col gap-4 py-2">
      
      {/* Title Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs">
        <h1 className="text-xl font-black text-slate-900 font-header leading-tight">PERFORMANCE METRICS</h1>
        <p className="text-xs text-slate-400 font-body mt-0.5">Projected arbitrage, capital structures, and inventory distribution reviews</p>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">PROJECTED PROFIT</span>
            <span className="p-1 px-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md">
              <TrendingUp size={11} />
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-body">Asking Spread Markup</span>
            <span className="text-lg font-black text-slate-900 tracking-tight font-header leading-none block mt-1">
              ${potentialProfit.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#059669] font-extrabold block mt-1 tracking-tight">
              ▲ {marginPercentage}% Projected Margin
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">REALIZED LIQUID</span>
            <span className="p-1 px-1.5 bg-emerald-50 border border-emerald-100 text-[#059669] rounded-md">
              <DollarSign size={11} />
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-body">Cleared Asset Revenue</span>
            <span className="text-lg font-black text-[#059669] tracking-tight font-header leading-none block mt-1">
              ${realizedRevenue.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-405 block mt-1 tracking-tight font-body">
              ${realizedProfit.toLocaleString()} profit cleared
            </span>
          </div>
        </div>
      </div>

      {/* COMPANION GRAPH - CAPITAL WEIGHT */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-header flex items-center gap-1.5">
            <ShoppingBag size={12} className="text-indigo-600" /> Capital Allocation Split
          </h3>
          <p className="text-[10px] text-slate-400 font-body mt-0.5">Visual representation of equipment value vs. seller listing markup</p>
        </div>

        <div className="flex flex-col gap-2">
          {/* Stacked Ledger bar */}
          <div className="w-full bg-slate-50 h-6 rounded-xl overflow-hidden flex border border-slate-200/60">
            {estimatedCost > 0 ? (
              <>
                <div 
                  className="bg-slate-900 h-full flex items-center justify-center text-[9px] font-extrabold text-white font-mono" 
                  style={{ width: `${Math.round((estimatedCost / totalAskingPrice) * 100)}%` }}
                >
                  {Math.round((estimatedCost / totalAskingPrice) * 100)}%
                </div>
                {potentialProfit > 0 && (
                  <div 
                    className="bg-indigo-600 h-full flex items-center justify-center text-[9px] font-extrabold text-white font-mono" 
                    style={{ width: `${Math.round((potentialProfit / totalAskingPrice) * 100)}%` }}
                  >
                    {Math.round((potentialProfit / totalAskingPrice) * 100)}%
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                LEDGER ARCHIVE EMPTY
              </div>
            )}
          </div>

          <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1 mt-1 flex-wrap gap-2 font-body">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-950 rounded-sm" />
              <span>Assessed Capital: ${estimatedCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-600 rounded-sm" />
              <span>Markups Potential: ${potentialProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BRAND DISTRIBUTION WEIGHTS */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-header flex items-center gap-1.5">
            <PieChart size={12} className="text-[#4f46e5]" /> FINANCIAL WEIGHT BY BRAND
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-body">Proportional summation of proposed retail prices</p>
        </div>

        {brandStats.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1 font-body">No brand stats recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {brandStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex-1 font-body">
                  <div className="flex justify-between font-bold text-slate-850 mb-1">
                    <span>{item.name} ({item.count} units)</span>
                    <span className="font-mono text-[10px] bg-slate-50 px-1 py-0.5 rounded border border-slate-100">${item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-50 border border-slate-150 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all"
                      style={{ width: `${totalAskingPrice > 0 ? (item.value / totalAskingPrice) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WEAR GRADING SPLIT PROFILE */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-header flex items-center gap-1.5">
            <Shield size={12} className="text-indigo-600" /> Catalog Quality Layout
          </h3>
          <p className="text-[10px] text-slate-400 font-body mt-0.5">Sum of items graded by visual wear level</p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold">
          <div className="bg-slate-50 py-3 rounded-2xl border border-slate-200/50">
            <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">EXCELLENT</span>
            <span className="text-sm font-black text-slate-800 font-header">{conditions.Excellent}</span>
          </div>
          <div className="bg-slate-50 py-3 rounded-2xl border border-slate-200/50">
            <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">GOOD</span>
            <span className="text-sm font-black text-slate-800 font-header">{conditions.Good}</span>
          </div>
          <div className="bg-slate-50 py-3 rounded-2xl border border-slate-200/50">
            <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">FAIR</span>
            <span className="text-sm font-black text-slate-800 font-header">{conditions.Fair}</span>
          </div>
          <div className="bg-slate-50 py-3 rounded-2xl border border-slate-200/50">
            <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">POOR</span>
            <span className="text-sm font-black text-slate-800 font-header">{conditions.Poor}</span>
          </div>
        </div>
      </div>

      {/* PREMIUM CHIPS IN LEDGER */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col gap-3">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-header flex items-center gap-1.5">
            <Flame size={12} className="text-amber-500" /> PRIME CATALOG FLAGSHIPS
          </h3>
          <p className="text-[10px] text-slate-400 font-body">Highest appraised listing positions in the system</p>
        </div>

        {premiumPhones.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2 font-body">No device items present.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {premiumPhones.map((item, idx) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 bg-slate-50 p-2.5 border border-slate-100/80 rounded-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 overflow-hidden shrink-0 relative flex items-center justify-center font-bold text-[10px] text-white">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0 font-body">
                  <div className="text-xs font-black text-slate-800 truncate font-header">{item.brand} {item.model}</div>
                  <div className="text-[10px] text-slate-400">
                    Grade: {item.condition} · Storage: {item.storage}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-slate-900 font-header">${item.sellerPrice || item.estimatedValue}</div>
                  <span className="text-[8px] uppercase font-black bg-white border border-slate-205 text-slate-700 px-1.5 py-0.5 rounded-sm inline-block tracking-wider">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
