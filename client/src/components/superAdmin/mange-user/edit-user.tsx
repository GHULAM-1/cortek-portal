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
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLES, ROLE_LABELS, UserRole } from "@/lib/constants/roles";
import { updateUser } from "@/api/users/users-api";
import { toast } from "sonner";
import { editUserSchema, EditUserForm } from "@/client-schema/user-schema";
import { User } from "@/types/users/users-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditUserProps {
  user: User;
}

export default function EditUser({ user }: EditUserProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role as typeof ROLES.ADMIN | typeof ROLES.TEAM | typeof ROLES.CLIENT,
    },
  });

  const { handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  // React Query mutation for updating user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditUserForm }) =>
      updateUser(id, { name: data.name, email: data.email, role: data.role as UserRole }),
    onSuccess: () => {
      toast.success("User updated successfully!");
      setIsDialogOpen(false);
      reset();
      // Invalidate users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    },
  });

  // Function to handle edit user dialog
  const handleEditUser = () => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role as typeof ROLES.ADMIN | typeof ROLES.TEAM | typeof ROLES.CLIENT,
    });
    setIsDialogOpen(true);
  };

  // Function to handle form submission
  const onSubmit = (data: EditUserForm) => {
    setError("");
    updateUserMutation.mutate({ id: user.id, data });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!updateUserMutation.isPending) {
          setIsDialogOpen(open);
          if (!open) {
            setError("");
            reset();
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:cursor-pointer"
          onClick={handleEditUser}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information. Fill in all the required information below.
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
                disabled={updateUserMutation.isPending}
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
                disabled={updateUserMutation.isPending}
              />  
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value as any)}
                disabled={updateUserMutation.isPending}
              >
                <SelectTrigger className="hover:cursor-pointer">
                  <SelectValue placeholder="Select a role" />
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
                if (!updateUserMutation.isPending) {
                  setIsDialogOpen(false);
                  setError("");
                  reset();
                }
              }}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending} className="hover:cursor-pointer">
              {updateUserMutation.isPending ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}