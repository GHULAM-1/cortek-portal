"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/types/users/users-types";
import { getAllUsers } from "@/api/users/users-api";
import { ROLES, ROLE_LABELS } from "@/lib/constants/roles";
import { Skeleton } from "@/components/ui/skeleton";
import CreateUser from "./create-user";
import EditUser from "./edit-user";
import DeleteUser from "./delete-user";
import { useQuery } from "@tanstack/react-query";
const getUserTabs = (userCounts: any) => [
  { id: "all", label: "All Users", count: userCounts.all },
  { id: ROLES.ADMIN, label: ROLE_LABELS.ADMIN, count: userCounts.admin },
  { id: ROLES.TEAM, label: ROLE_LABELS.TEAM, count: userCounts.team },
  { id: ROLES.CLIENT, label: ROLE_LABELS.CLIENT, count: userCounts.client },
];

export function ManageUsersContent() {
  const [activeTab, setActiveTab] = useState("all");

  // React Query to fetch users
  const { data: users = [], isLoading: isLoadingUsers, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  // Filter users based on active tab
  const filteredUsers = users.filter(user => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  // Calculate user counts for each role
  const userCounts = {
    all: users.length,
    admin: users.filter(u => u.role === ROLES.ADMIN).length,
    team: users.filter(u => u.role === ROLES.TEAM).length,
    client: users.filter(u => u.role === ROLES.CLIENT).length,
    superAdmin: users.filter(u => u.role === ROLES.SUPERADMIN).length,
  };


  return (
    <>
      <CreateUser />

      {/* User Tabs */}
      <div className="mb-6 py-6 px-6 ">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {getUserTabs(userCounts).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap hover:cursor-pointer py-2 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-primary text-primary dark:text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Users Table */}
      <Card className="my-6 mx-6">
        <CardHeader>
          <CardTitle>
            {activeTab === "all"
              ? "All Users"
              : `${
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                } Users`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingUsers ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500">
                  {activeTab === "all" ? "No users found" : `No ${activeTab} users found`}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {user.role === ROLES.SUPERADMIN ? ROLE_LABELS.SUPERADMIN : ROLE_LABELS[user.role.toUpperCase() as keyof typeof ROLE_LABELS] || user.role}
                    </Badge>
                    <EditUser user={user} />
                    <DeleteUser user={user} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    </>
  );
}
