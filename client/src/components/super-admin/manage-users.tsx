"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-wrapper";
import { UserRole, User } from "@/types/users/users-types";
import { createUser, getAllUsers, updateUser, deleteUser } from "@/api/users/users-api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const getUserTabs = (userCounts: any) => [
  { id: "all", label: "All Users", count: userCounts.all },
  { id: "admin", label: "Admin", count: userCounts.admin },
  { id: "team", label: "Team", count: userCounts.team },
  { id: "client", label: "Client", count: userCounts.client },
];

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "team", "client"], {
    message: "Please select a role",
  }),
});

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.enum(["admin", "team", "client"], {
    message: "Please select a role",
  }),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

type FormData = {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "team" | "client";
};

export function ManageUsersContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const { handleSubmit, formState: { isSubmitting, errors }, reset, setValue, watch } = form;

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Filter users based on active tab
  const filteredUsers = users.filter(user => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  // Calculate user counts for each role
  const userCounts = {
    all: users.length,
    admin: users.filter(u => u.role === "admin").length,
    team: users.filter(u => u.role === "team").length,
    client: users.filter(u => u.role === "client").length,
    superadmin: users.filter(u => u.role === "superadmin").length,
  };

  // Function to open edit dialog
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditMode(true);
    setIsDialogOpen(true);

    // Use setTimeout to ensure the dialog and form are ready
    setTimeout(() => {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role as "admin" | "team" | "client",
      });
    }, 0);
  };

  // Function to open create dialog
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsEditMode(false);
    form.reset({
      name: "",
      email: "",
      password: "",
      role: undefined,
    });
    setIsDialogOpen(true);
  };

  // Function to open delete confirmation dialog
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm and delete user (soft delete)
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success("User deleted successfully!");
      fetchUsers(); // Refresh the user list
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const onSubmit = async (data: FormData) => {
    setError("");

    try {
      if (isEditMode && editingUser) {
        // Update existing user (no password update)
        await updateUser(editingUser.id, {
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
        });
        toast.success("User updated successfully!");
      } else {
        // Create new user (with password)
        const createData = data as CreateUserForm;
        await createUser({
          name: createData.name,
          email: createData.email,
          password: createData.password,
          role: createData.role as UserRole,
        });
        toast.success("User created successfully! Welcome email sent.");
      }

      setIsDialogOpen(false);
      reset();
      setEditingUser(null);
      setIsEditMode(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
    }
  };
  return (
    <>
      <div className="flex w-full justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage users across all roles
          </p>
        </div>
        <div className="">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!isSubmitting) {
                setIsDialogOpen(open);
                if (!open) {
                  setError("");
                  reset();
                  setEditingUser(null);
                  setIsEditMode(false);
                }
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={handleCreateUser} className="hover:cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit User" : "Add New User"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update user information. Fill in all the required information below."
                    : "Create a new user account. Fill in all the required information below."
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  {!isEditMode && (
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form.register("password" as any)}
                        placeholder="Enter password"
                        disabled={isSubmitting}
                      />
                       {errors.password && (
                         <p className="text-sm text-red-600">{errors.password.message}</p>
                       )}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={watch("role")}
                      onValueChange={(value) => setValue("role", value as any)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="hover:cursor-pointer">
                        <SelectValue placeholder="Select a role"  />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="hover:cursor-pointer" value="admin">Admin</SelectItem>
                        <SelectItem className="hover:cursor-pointer" value="team">Team</SelectItem>
                        <SelectItem className="hover:cursor-pointer" value="client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isSubmitting) {
                        setIsDialogOpen(false);
                        setError("");
                        reset();
                        setEditingUser(null);
                        setIsEditMode(false);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="hover:cursor-pointer">
                    {isSubmitting
                      ? (isEditMode ? "Updating..." : "Creating...")
                      : (isEditMode ? "Update User" : "Create User")
                    }
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {getUserTabs(userCounts).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap hover:cursor-pointer py-2 px-1 border-b-2 font-medium text-sm",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
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
      <Card>
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
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {user.role === "superadmin" ? "Super Admin" : user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:cursor-pointer"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:cursor-pointer"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={confirmDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
