"use client";

import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/lib/constants/roles";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme/theme-toggle";
import { Dashboard } from "./dashboard";

export default function SuperAdminDashboard() {
  const { user, isAuthenticated, loading, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== ROLES.SUPERADMIN) {
    return null;
  }

  return (
      <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
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
                  <Button onClick={handleSignOut} className="hover:cursor-pointer hover:bg-primary dark:hover:bg-primary" variant="outline">
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
              <Dashboard />
            </div>
          </main>
      </div>
  );
}
