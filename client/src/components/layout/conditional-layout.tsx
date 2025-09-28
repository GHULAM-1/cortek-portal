"use client";

import { usePathname } from 'next/navigation';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Show sidebar if route contains "dashboard"
  const showSidebar = pathname.includes('dashboard');

  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 max-w-[1400px] mx-auto">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // No sidebar for login, signup, etc.
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}