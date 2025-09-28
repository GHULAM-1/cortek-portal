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
import { Plus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLES, ROLE_LABELS, UserRole } from "@/lib/constants/roles";
import { createUser } from "@/api/users/users-api";
import { toast } from "sonner";
import { createUserSchema, CreateUserForm } from "@/client-schema/user-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateUser() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const { handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  // React Query mutation for creating user
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully! Welcome email sent.");
      setIsDialogOpen(false);
      reset();
      // Invalidate users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    },
  });

  // Function to handle create user dialog
  const handleCreateUser = () => {
    reset({
      name: "",
      email: "",
      password: "",
      role: undefined,
    });
    setIsDialogOpen(true);
  };

  // Function to handle form submission
  const onSubmit = (data: CreateUserForm) => {
    setError("");
    createUserMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role as UserRole,
    });
  };

  return (
    <div className="flex py-6 px-6  w-full justify-between items-center mb-6">
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
          if (!createUserMutation.isPending) {
            setIsDialogOpen(open);
            if (!open) {
              setError("");
              reset();
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
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all the required information below.
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
                  disabled={createUserMutation.isPending}
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
                  disabled={createUserMutation.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Enter password"
                    disabled={createUserMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute hover:cursor-pointer right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={createUserMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={watch("role")}
                  onValueChange={(value) => setValue("role", value as any)}
                  disabled={createUserMutation.isPending}
                >
                  <SelectTrigger className="hover:cursor-pointer">
                    <SelectValue placeholder="Select a role"  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="hover:cursor-pointer" value={ROLES.ADMIN}>{ROLE_LABELS.ADMIN}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value={ROLES.TEAM}>{ROLE_LABELS.TEAM}</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value={ROLES.CLIENT}>{ROLE_LABELS.CLIENT}</SelectItem>
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
                  if (!createUserMutation.isPending) {
                    setIsDialogOpen(false);
                    setError("");
                    reset();
                  }
                }}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending} className="hover:cursor-pointer">
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  )
}
