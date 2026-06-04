import React from "react";
import { Plus, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneRecord } from "../types";

interface DashboardProps {
  inventory: PhoneRecord[];
  onNavigate: (tab: any) => void;
}

export default function Dashboard({ inventory, onNavigate }: DashboardProps) {
  
  // Calculations for Hero
  const totalValue = inventory.reduce((sum, item) => sum + (item.sellerPrice || item.estimatedValue || 0), 0);
  const totalCount = inventory.length;

  // Stats
  const soldToday = inventory.filter(item => item.status === "Sold Out").length; // Mock logic
  const lowStock = inventory.filter(item => item.status === "Low Stock").length;
  const totalCost = inventory.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);
  const profit = totalValue - totalCost;

  // Featured
  const premiumPhones = [...inventory]
    .sort((a, b) => (b.sellerPrice || 0) - (a.sellerPrice || 0))
    .slice(0, 3);

  const stats = [
    ["Devices", totalCount.toString()],
    ["Sold Today", soldToday.toString()],
    ["Low Stock", lowStock.toString()],
    ["Profit", `₦${(profit/1000000).toFixed(1)}M`],
  ];

  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="px-5 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass overflow-hidden rounded-[32px] p-6"
        >
          <p className="text-sm font-medium text-neutral-500">Total stock value</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            ₦{(totalValue / 1000000).toFixed(1)}M
          </h2>
          <p className="mt-3 max-w-[260px] text-sm leading-6 text-neutral-500">
            {totalCount} devices currently tracked across your catalog.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-95">
              <Plus size={17} />
              Add Stock
            </button>
            <button 
              onClick={() => onNavigate("scanner")}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black border border-neutral-200 transition-transform hover:scale-95"
            >
              <ScanLine size={17} />
              Scan
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 px-5 pt-5">
        {stats.map(([label, value]) => (
          <div key={label} className="soft-card rounded-[26px] p-5">
            <p className="text-sm text-neutral-500">{label}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</h3>
          </div>
        ))}
      </section>

      {/* Inventory Section */}
      <section className="px-5 pt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Featured Devices</h2>
            <p className="mt-1 text-sm text-neutral-500">Premium stock overview</p>
          </div>
          <button onClick={() => onNavigate("inventory")} className="text-sm font-medium text-blue-600">View all</button>
        </div>
        
        <div className="space-y-4">
          {premiumPhones.map((phone) => (
            <motion.div
              key={phone.id}
              whileTap={{ scale: 0.98 }}
              className="soft-card overflow-hidden rounded-[34px]"
            >
              <div className="relative h-56 bg-gradient-to-br from-white to-neutral-100 flex items-center justify-center">
                {/* Fallback image if none exists */}
                <img
                  src={phone.image || "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600"}
                  alt={phone.model}
                  className="h-full w-full object-cover"
                />
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md bg-white/80 border border-white/20 shadow-sm ${
                    phone.status === "Low Stock"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {phone.status || "In Stock"}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900">{phone.brand} {phone.model}</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {phone.storage} • {phone.color || "Standard"}
                    </p>
                  </div>
                  <p className="text-right text-lg font-semibold text-slate-900">₦{(phone.sellerPrice || phone.estimatedValue)?.toLocaleString()}</p>
                </div>
                <div className="mt-5 flex items-center justify-between rounded-2xl bg-neutral-100/50 px-4 py-3">
                  <p className="text-sm text-neutral-500">Available stock</p>
                  <p className="font-semibold text-slate-900">{phone.quantity || 1} units</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stock Take Card */}
      <section className="px-5 pt-8 pb-12">
        <div className="rounded-[34px] bg-black p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ScanLine className="text-white" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">
            Stocktaking Mode
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Scan IMEI numbers, confirm physical devices, and instantly detect
            missing, extra or damaged stock.
          </p>
          <button 
            onClick={() => onNavigate("scanner")}
            className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
          >
            Start Stock Count
          </button>
        </div>
      </section>

    </div>
  );
}
