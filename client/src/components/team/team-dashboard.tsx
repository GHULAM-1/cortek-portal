"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/types/users/users-types";
import { ThemeToggle } from "../theme/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
export function TeamDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { signOutUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);
  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };
  const isHierarchyViewing = currentUser?.role !== "team";

  // Personal stats for team member
  const personalStats = {
    myTasks: 8,
    completedTasks: 45,
    myProjects: 3,
    efficiency: 92,
  };

  // Static stats for hierarchy viewing
  const staticStats = {
    activeProjects: 12,
    teamMembers: 8,
    tasksCompleted: 45,
    efficiency: 87,
  };

  const isOwnDashboard = currentUser?.role === "team";
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
            {isHierarchyViewing && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Hierarchy View
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {isOwnDashboard
              ? `${currentUser?.name} (${currentUser?.email})`
              : isHierarchyViewing
              ? "Team Dashboard Overview"
              : "Manage your team projects and tasks"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button disabled={!isOwnDashboard} className="hover:cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            {isOwnDashboard ? "New Project" : "View Only"}
          </Button>
          <Button onClick={handleSignOut } className="hover:cursor-pointer" variant="outline">
            Sign Out
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Team Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "John Doe",
                action: "completed task",
                target: "User Authentication",
                time: "2 hours ago",
              },
              {
                user: "Jane Smith",
                action: "created project",
                target: "Mobile App v2.0",
                time: "4 hours ago",
              },
              {
                user: "Mike Johnson",
                action: "updated status",
                target: "Database Migration",
                time: "6 hours ago",
              },
              {
                user: "Sarah Wilson",
                action: "added comment",
                target: "Website Redesign",
                time: "1 day ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
