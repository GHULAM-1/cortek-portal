import React from "react";
import SuperAdminDashboard from "@/components/super-admin/super-admin-dashboard";

export default function SuperAdminDashboardPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center w-full items-center">
        <SuperAdminDashboard />
      </div>
    </React.Suspense>
  );
}
