"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "@/api/users/users-api";
import { toast } from "sonner";
import { User } from "@/types/users/users-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface DeleteUserProps {
  user: User;
}

export default function DeleteUser({ user }: DeleteUserProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // React Query mutation for deleting user
  const deleteUserMutation = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      toast.success("User deleted successfully!");
      setIsDialogOpen(false);
      // Invalidate users query to refetch data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    },
  });

  // Function to handle delete user dialog
  const handleDeleteUser = () => {
    setIsDialogOpen(true);
  };

  // Function to confirm and delete user
  const confirmDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      if (!deleteUserMutation.isPending) {
        setIsDialogOpen(open);
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:cursor-pointer"
          onClick={handleDeleteUser}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => setIsDialogOpen(false)}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={confirmDeleteUser}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}