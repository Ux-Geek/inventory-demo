import React from "react";
import { PhoneRecord } from "../types";
import PageContainer from "./layout/PageContainer";
import BusinessOverview from "./dashboard/BusinessOverview";
import AlertsSection from "./dashboard/AlertsSection";

interface DashboardProps {
  inventory: PhoneRecord[];
  onNavigate: (tab: any) => void;
}

export default function Dashboard({ inventory, onNavigate }: DashboardProps) {
  return (
    <PageContainer title={
      <span className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-5 py-2.5 rounded-full inline-block text-3xl md:text-4xl font-bold tracking-tight">
        Hi Qwertech
      </span>
    }>
      <BusinessOverview inventory={inventory} />
      <div className="mt-8">
        <AlertsSection inventory={inventory} onNavigate={onNavigate} />
      </div>
    </PageContainer>
  );
}
