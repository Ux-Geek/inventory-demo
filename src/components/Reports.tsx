import React from "react";
import PageContainer from "./layout/PageContainer";
import { DollarSign, TrendingUp, ShoppingBag, PieChart, Shield, Flame } from "lucide-react";
import { PhoneRecord } from "../types";

interface ReportsProps {
  inventory: PhoneRecord[];
}

export default function Reports({ inventory }: ReportsProps) {
  // Calculations
  const totalCount = inventory.length;
  const inStock = inventory.filter(item => item.status === "In Stock");
  const sold = inventory.filter(item => item.status === "Sold Out");

  const estimatedCost = inventory.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const totalAskingPrice = inventory.reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);
  const potentialProfit = Math.max(0, totalAskingPrice - estimatedCost);
  const marginPercentage = estimatedCost > 0 ? Math.round((potentialProfit / estimatedCost) * 105) : 0;

  const realizedRevenue = sold.reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);
  const realizedValuation = sold.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const realizedProfit = Math.max(0, realizedRevenue - realizedValuation);

  const premiumPhones = [...inventory]
    .sort((a, b) => (b.sellerPrice || 0) - (a.sellerPrice || 0))
    .slice(0, 3);

  return (
    <PageContainer title="Reports" subtitle="Performance Analytics">
      
      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Projected Profit</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <TrendingUp size={20} />
            </span>
          </div>
          <div>
            <span className="text-sm text-muted block mb-2">Asking Spread Markup</span>
            <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight block">
              ${potentialProfit.toLocaleString()}
            </span>
            <span className="text-sm text-emerald-600 font-bold block mt-2">
              ▲ {marginPercentage}% Projected Margin
            </span>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Realized Liquid</span>
            <span className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <DollarSign size={20} />
            </span>
          </div>
          <div>
            <span className="text-sm text-muted block mb-2">Cleared Asset Revenue</span>
            <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight block">
              ${realizedRevenue.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 block mt-2">
              ${realizedProfit.toLocaleString()} profit cleared
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COMPANION GRAPH - CAPITAL WEIGHT */}
        <div className="glass-card p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <ShoppingBag size={16} /> Capital Allocation
            </h3>
            <p className="text-sm text-muted mt-2">Value vs. seller markup</p>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="w-full bg-slate-100 dark:bg-white/5 h-12 rounded-full overflow-hidden flex">
              {estimatedCost > 0 ? (
                <>
                  <div 
                    className="bg-slate-900 dark:bg-white h-full flex items-center justify-center text-xs font-bold text-white dark:text-black" 
                    style={{ width: `${Math.round((estimatedCost / totalAskingPrice) * 100)}%` }}
                  >
                    {Math.round((estimatedCost / totalAskingPrice) * 100)}%
                  </div>
                  {potentialProfit > 0 && (
                    <div 
                      className="bg-emerald-600 h-full flex items-center justify-center text-xs font-bold text-white" 
                      style={{ width: `${Math.round((potentialProfit / totalAskingPrice) * 100)}%` }}
                    >
                      {Math.round((potentialProfit / totalAskingPrice) * 100)}%
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted font-bold uppercase tracking-wider">
                  LEDGER EMPTY
                </div>
              )}
            </div>

            <div className="flex justify-between text-xs font-bold text-muted px-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-900 dark:bg-white rounded-sm" />
                <span>Assessed: ${estimatedCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded-sm" />
                <span>Markup: ${potentialProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PREMIUM CHIPS IN LEDGER */}
        <div className="glass-card p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <Flame size={16} className="text-amber-500" /> Premium Flagships
            </h3>
            <p className="text-sm text-muted mt-2">Highest appraised assets</p>
          </div>

          {premiumPhones.length === 0 ? (
            <p className="text-sm text-muted italic text-center py-8">No device items present.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {premiumPhones.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black shrink-0 flex items-center justify-center font-bold text-lg">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-slate-900 dark:text-white truncate">{item.brand} {item.model}</div>
                    <div className="text-xs text-muted mt-1">
                      {item.condition} · {item.storage}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">${item.sellerPrice || item.estimatedValue}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </PageContainer>
  );
}
