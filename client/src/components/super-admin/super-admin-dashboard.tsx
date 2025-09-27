"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { ThemeToggle } from "../theme/theme-toggle";
import { Dashboard } from "./home";
import { ManageUsersContent } from "./manage-users";

export default function SuperAdminDashboard() {
  const { user, isAuthenticated, loading, signOutUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "manage-users":
        return <ManageUsersContent />;
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    if (!loading) {
      if (user?.role !== "superadmin") {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "superadmin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset className="w-full flex-1 min-w-0">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Super Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Welcome back, {user.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={handleSignOut} className="hover:cursor-pointer" variant="outline">
                    Sign Out
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full py-6 px-6 flex-1 overflow-hidden">
            <div className="w-full max-w-none">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
