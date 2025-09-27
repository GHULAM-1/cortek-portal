import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

// Menu items.
const items = [
  {
    title: "Dashboard",
    id: "dashboard",
    icon: Home,
  },
  {
    title: "Manage Users",
    id: "manage-users",
    icon: Users,
  },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Cortek Portal</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex hover:cursor-pointer items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                  isCollapsed && "justify-center",
                  activeTab === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-sidebar-accent-foreground">
              {user?.name.charAt(0)}
            </span>
          </div>
          {!isCollapsed && (
            <span className="text-sm text-sidebar-foreground/70">
              {user?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
