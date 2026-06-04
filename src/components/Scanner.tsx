import React, { useState } from "react";
import PageContainer from "./layout/PageContainer";
import { Camera, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScannerProps {
  onRecordSaved: () => void;
  onNavigate: (tab: any) => void;
}

export default function Scanner({ onRecordSaved, onNavigate }: ScannerProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: "Apple",
    model: "",
    storage: "128GB",
    color: "",
    imei: "",
    purchasePrice: "",
    sellerPrice: "",
    supplier: "",
    quantity: "1",
    condition: "New"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        purchasePrice: Number(formData.purchasePrice),
        sellerPrice: Number(formData.sellerPrice),
        quantity: Number(formData.quantity)
      };

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");
      
      onRecordSaved();
      onNavigate("inventory");
    } catch (e) {
      console.error(e);
      alert("Failed to save record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer title="Add Device" subtitle="Stock Intake">
      <div className="max-w-2xl mx-auto">
        
        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= i ? "bg-black text-white dark:bg-white dark:text-black" : "bg-black/5 text-muted dark:bg-white/5"
              }`}>
                {step > i ? <Check size={14} /> : i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-px ${step > i ? "bg-black dark:bg-white" : "bg-slate-200 dark:bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-title-2 mb-2">Device Identification</h3>
                
                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Brand & Model</label>
                  <div className="flex gap-4">
                    <select 
                      className="w-1/3 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="e.g. iPhone 15 Pro"
                      className="w-2/3 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Storage</label>
                    <select 
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.storage}
                      onChange={e => setFormData({...formData, storage: e.target.value})}
                    >
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Natural Titanium"
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.color}
                      onChange={e => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">IMEI / Serial (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Scan or type 15 digits"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-mono tracking-widest"
                    value={formData.imei}
                    onChange={e => setFormData({...formData, imei: e.target.value})}
                  />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.model}
                  className="mt-4 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <h3 className="text-title-2 mb-2">Acquisition Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Purchase Cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 font-semibold text-muted">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-black/5 dark:bg-white/5 rounded-xl pl-8 pr-4 py-4 outline-none font-semibold"
                        value={formData.purchasePrice}
                        onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Selling Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 font-semibold text-muted">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-black/5 dark:bg-white/5 rounded-xl pl-8 pr-4 py-4 outline-none font-semibold"
                        value={formData.sellerPrice}
                        onChange={e => setFormData({...formData, sellerPrice: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Supplier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dubai Wholesale"
                    className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                    value={formData.supplier}
                    onChange={e => setFormData({...formData, supplier: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Condition</label>
                    <select 
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.condition}
                      onChange={e => setFormData({...formData, condition: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="UK Used">UK Used</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted block mb-2">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full bg-black/5 dark:bg-white/5 rounded-xl px-4 py-4 outline-none font-semibold"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-black/5 dark:bg-white/5 py-4 rounded-xl font-bold cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!formData.sellerPrice}
                    className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                  >
                    Review <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4 text-muted">
                    <Camera size={32} />
                  </div>
                  <h3 className="text-title-2 mb-2">Final Review</h3>
                  <p className="text-muted">Confirm details before adding to ledger.</p>
                </div>
                
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6">
                  <div className="flex justify-between border-b border-slate-200/50 dark:border-white/10 pb-4 mb-4">
                    <span className="text-muted font-medium">Model</span>
                    <span className="font-bold">{formData.brand} {formData.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 dark:border-white/10 pb-4 mb-4">
                    <span className="text-muted font-medium">Spec</span>
                    <span className="font-bold">{formData.storage} • {formData.color}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 dark:border-white/10 pb-4 mb-4">
                    <span className="text-muted font-medium">Profit Margin</span>
                    <span className="font-bold text-emerald-500">
                      ${Number(formData.sellerPrice) - Number(formData.purchasePrice)} / unit
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Intake Volume</span>
                    <span className="font-bold">{formData.quantity} Units</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-black/5 dark:bg-white/5 py-4 rounded-xl font-bold cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-2/3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                  >
                    {isSaving ? "Saving..." : "Add to Inventory"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
