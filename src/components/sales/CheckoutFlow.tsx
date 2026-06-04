import React, { useState } from "react";
import PageContainer from "../layout/PageContainer";
import { PhoneRecord } from "../../types";
import { Search, ShoppingBag, CreditCard, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutFlow() {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    paymentMethod: "Card"
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Mock search results (in reality, fetch from API)
  const mockResults = [
    { id: "1", brand: "Apple", model: "iPhone 15 Pro", color: "Natural Titanium", storage: "256GB", price: 1100, imei: "358921102948123" },
    { id: "2", brand: "Samsung", model: "Galaxy S24 Ultra", color: "Titanium Gray", storage: "512GB", price: 1200, imei: "351182281928341" }
  ];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4); // Success screen
    }, 1500);
  };

  return (
    <PageContainer title="Point of Sale" subtitle="Checkout">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 md:p-12 min-h-[500px] relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 flex-1"
              >
                <h3 className="text-title-2 mb-2">Find Device</h3>
                
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-4 text-muted" />
                  <input 
                    type="text" 
                    placeholder="Scan barcode or search IMEI..."
                    className="w-full bg-black/5 dark:bg-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none font-semibold text-lg"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {searchQuery.length > 2 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {mockResults.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedDevice(item);
                          setStep(2);
                        }}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="font-bold">{item.brand} {item.model}</p>
                          <p className="text-xs text-muted font-mono">{item.imei} • {item.storage}</p>
                        </div>
                        <div className="font-bold text-lg">
                          ${item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && selectedDevice && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 flex-1"
              >
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                  <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-muted">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="text-title-2">{selectedDevice.brand} {selectedDevice.model}</h3>
                    <p className="text-muted font-mono text-sm">{selectedDevice.imei}</p>
                  </div>
                  <div className="ml-auto text-2xl font-bold">
                    ${selectedDevice.price}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="font-semibold uppercase tracking-widest text-xs text-muted">Customer Details</h4>
                  <input 
                    type="text" 
                    placeholder="Customer Name"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                    value={customerData.name}
                    onChange={e => setCustomerData({...customerData, name: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                    value={customerData.phone}
                    onChange={e => setCustomerData({...customerData, phone: e.target.value})}
                  />
                </div>

                <div className="mt-auto pt-6 flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-black/5 dark:bg-white/5 py-4 rounded-xl font-bold cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!customerData.name}
                    className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && selectedDevice && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 flex-1"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4 text-muted">
                    <CreditCard size={32} />
                  </div>
                  <h3 className="text-title-2 mb-2">Total Due: ${selectedDevice.price}</h3>
                  <p className="text-muted">{customerData.name} • {customerData.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["Card", "Cash", "Transfer", "POS"].map(method => (
                    <button
                      key={method}
                      onClick={() => setCustomerData({...customerData, paymentMethod: method})}
                      className={`p-4 rounded-2xl font-bold transition-all border ${
                        customerData.paymentMethod === method 
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent" 
                          : "bg-transparent border-slate-200 dark:border-white/10 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-black/5 dark:bg-white/5 py-4 rounded-xl font-bold cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
                  >
                    {isProcessing ? "Processing..." : `Complete ${customerData.paymentMethod} Payment`}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center flex-1 text-center"
              >
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-hero mb-4">Payment Successful</h2>
                <p className="text-muted text-lg mb-8">
                  Receipt sent to {customerData.name}. Inventory has been updated.
                </p>
                
                <button 
                  onClick={() => {
                    setStep(1);
                    setSearchQuery("");
                    setSelectedDevice(null);
                    setCustomerData({ name: "", phone: "", paymentMethod: "Card" });
                  }}
                  className="bg-black/5 dark:bg-white/5 hover:bg-black/10 px-8 py-4 rounded-xl font-bold transition-colors"
                >
                  New Transaction
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
