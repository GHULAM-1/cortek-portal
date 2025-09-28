"use client";
import { Calendar, Home, Inbox, Search, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ROLES } from "@/lib/constants/roles";
import { useAuthStore } from "@/store/auth-store";

// Menu items for different roles
const getMenuItems = (userRole: string) => {
  switch (userRole) {
    case ROLES.SUPERADMIN:
      return [
        {
          title: "Dashboard",
          url: "/superAdmin/dashboard",
          icon: Home,
        },
        {
          title: "Manage Users",
          url: "/superAdmin/dashboard/manage-user",
          icon: Users,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ];

    case ROLES.ADMIN:
      return [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: Home,
        },
      ];

    case ROLES.TEAM:
      return [
        {
          title: "Dashboard",
          url: "/team/dashboard",
          icon: Home,
        },
      ];

    case ROLES.CLIENT:
      return [
        {
          title: "Dashboard",
          url: "/client/dashboard",
          icon: Home,
        },
      ];

    default:
      return [];
  }
};

export function AppSidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const menuItems = getMenuItems(user?.role || "");

  const isActive = (url: string) => {
    if (url === "#") return false;

    // Exact match only
    return pathname === url;
  };

  return (
    <Sidebar variant="inset" collapsible="none" className="border-r py-4">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold">
            Cortek Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} className="hover:bg-sidebar-primary ease-in-out duration-300 transition-all ">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>{user?.name}</div>
      </SidebarFooter>
    </Sidebar>
  );
}