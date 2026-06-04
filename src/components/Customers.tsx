import React, { useState } from "react";
import PageContainer from "./layout/PageContainer";
import { Search, User, Phone, ShoppingBag, ShieldCheck } from "lucide-react";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockCustomers = [
    { id: "1", name: "David O.", phone: "08012345678", purchases: 3, lastActive: "2 days ago", warranty: "Active" },
    { id: "2", name: "Sarah L.", phone: "08123456789", purchases: 1, lastActive: "1 week ago", warranty: "Expired" },
    { id: "3", name: "Michael B.", phone: "09087654321", purchases: 5, lastActive: "Today", warranty: "Active" }
  ];

  return (
    <PageContainer title="Customers" subtitle="Client Directory">
      <div className="mb-12 glass-card p-2 pl-6 pr-2 flex items-center justify-between max-w-2xl">
        <div className="flex items-center gap-3 w-full">
          <Search size={18} className="text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium outline-none py-4 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCustomers.map(customer => (
          <div key={customer.id} className="glass-card p-6 flex flex-col hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{customer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted mt-1">
                    <Phone size={12} /> {customer.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
              <div>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-1">Purchases</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                  <ShoppingBag size={14} className="text-muted" /> {customer.purchases} devices
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  customer.warranty === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                }`}>
                  Warranty {customer.warranty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
