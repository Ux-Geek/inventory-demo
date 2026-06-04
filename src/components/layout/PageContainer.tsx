import React from "react";
import { motion } from "framer-motion";

export default function PageContainer({ children, title, subtitle }: { children: React.ReactNode, title?: React.ReactNode, subtitle?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className="min-h-screen pb-32"
    >
      {(title || subtitle) && (
        <header className="px-6 pt-16 pb-8 md:px-8 md:pt-10 md:pb-8 max-w-7xl mx-auto">
          {subtitle && (
            <span className="text-sm font-semibold tracking-widest text-muted uppercase mb-2 block">
              {subtitle}
            </span>
          )}
          {title && (
            <h1 className="text-hero text-slate-900 dark:text-white">
              {title}
            </h1>
          )}
        </header>
      )}
      
      <main className="px-6 md:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </motion.div>
  );
}
