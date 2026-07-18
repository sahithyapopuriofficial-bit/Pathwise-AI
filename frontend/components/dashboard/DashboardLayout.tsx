import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  fullName: string;
}

export default function DashboardLayout({
  children,
  fullName,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Header */}
          <DashboardHeader fullName={fullName} />

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

