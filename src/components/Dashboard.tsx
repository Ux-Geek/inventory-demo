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
    <PageContainer title="Hi Qwertech">
      <BusinessOverview inventory={inventory} />
      <div className="mt-8">
        <AlertsSection inventory={inventory} onNavigate={onNavigate} />
      </div>
    </PageContainer>
  );
}
