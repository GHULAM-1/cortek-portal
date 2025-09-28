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
import { ROLES } from "@/lib/constants/roles";
import { ThemeToggle } from "../theme/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
export function ClientDashboard() {
  const { user: currentUser } = useAuthStore();
  const { signOutUser } = useAuth();

  const router = useRouter();
  const handleSignOut = async () => {
    await signOutUser();
    router.push("/auth/login");
  };
  return (
    <div className="space-y-6 min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Client Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, {currentUser?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSignOut}
                className="hover:cursor-pointer hover:bg-primary dark:hover:bg-primary"
                variant="outline"
              >
                Sign Out
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <div className=" py-6 px-6 ">
        {/* Client Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Client Activity</CardTitle>
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
    </div>
  );
}
