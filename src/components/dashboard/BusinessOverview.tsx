import React from "react";
import { PhoneRecord } from "../../types";
import { ShoppingBag, Tag, Users, Globe, TrendingUp, CreditCard, Wallet, Store } from "lucide-react";

interface BusinessOverviewProps {
  inventory: PhoneRecord[];
}

export default function BusinessOverview({ inventory }: BusinessOverviewProps) {
  // Use inventory for some real values if possible, otherwise mock closely to the image
  const orders = 1240;
  const productsSold = 289;
  const newCustomers = 136;
  const websiteVisits = 2532;

  const totalSales = "₦12,420,000";
  const totalSettled = "₦10,020,000";
  const totalOwed = "₦0.0";
  const offlineSales = "₦12,420,000";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Business Overview</h2>
          <p className="text-slate-500 text-sm">Here's how your business is doing today</p>
        </div>
        <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-emerald-50 rounded-xl p-4 flex justify-between items-start border border-emerald-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{orders.toLocaleString()}</h3>
            <p className="text-sm font-medium text-emerald-800 mt-1">Orders</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
            <ShoppingBag size={18} />
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-start border border-blue-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{productsSold.toLocaleString()}</h3>
            <p className="text-sm font-medium text-blue-800 mt-1">Products sold</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
            <Tag size={18} />
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 flex justify-between items-start border border-amber-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{newCustomers.toLocaleString()}</h3>
            <p className="text-sm font-medium text-amber-800 mt-1">New Customers</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl p-4 flex justify-between items-start border border-rose-100">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{websiteVisits.toLocaleString()}</h3>
            <p className="text-sm font-medium text-rose-800 mt-1">Website Visits</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-600">
            <Globe size={18} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-slate-100 flex-1"></div>
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Yearly overview of your business</span>
        <div className="h-px bg-slate-100 flex-1"></div>
      </div>

      {/* Secondary Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
        <div>
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-2">
            <span className="font-bold">₦</span>
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">Total Sales</p>
          <p className="text-xl font-bold text-slate-900">{totalSales}</p>
        </div>

        <div>
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-2">
            <TrendingUp size={16} />
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">Total Settled</p>
          <p className="text-xl font-bold text-slate-900">{totalSettled}</p>
        </div>

        <div>
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-2">
            <CreditCard size={16} />
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">Total Owed</p>
          <p className="text-xl font-bold text-slate-900">{totalOwed}</p>
        </div>

        <div>
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-2">
            <Store size={16} />
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">Offline Sales</p>
          <p className="text-xl font-bold text-slate-900">{offlineSales}</p>
        </div>

        <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none self-start mt-2">
          <option>2023</option>
          <option>2024</option>
        </select>
      </div>

      {/* Mock Chart Area */}
      <div className="h-64 border-b border-slate-100 flex items-end justify-between px-4 pb-2 relative">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-medium py-2">
          <span>1M</span>
          <span>800K</span>
          <span>600K</span>
          <span>400K</span>
          <span>200K</span>
          <span>0</span>
        </div>
        
        {/* Mock Bars */}
        <div className="ml-10 flex w-full justify-between items-end h-full pt-4">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
            const height1 = Math.max(20, Math.random() * 90);
            const height2 = Math.max(10, height1 - (Math.random() * 30));
            const isGray = i >= 9; // Oct, Nov, Dec are grayed in mockup
            
            return (
              <div key={month} className="flex flex-col items-center gap-2 group w-1/12">
                <div className="flex gap-1 items-end h-48 w-full justify-center">
                  <div className={`w-3 md:w-5 rounded-t-sm transition-all ${isGray ? 'bg-slate-200' : 'bg-emerald-700'}`} style={{ height: `${height1}%` }}></div>
                  <div className={`w-3 md:w-5 rounded-t-sm transition-all ${isGray ? 'bg-slate-100' : 'bg-emerald-400'}`} style={{ height: `${height2}%` }}></div>
                </div>
                <span className="text-xs font-medium text-slate-500">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
          <span className="text-xs font-medium text-slate-500">Total Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
          <span className="text-xs font-medium text-slate-500">Online sales</span>
        </div>
      </div>
      
    </div>
  );
}
