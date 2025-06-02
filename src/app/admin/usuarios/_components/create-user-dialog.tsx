"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateUser } from "../_hooks/user-mutations";
import { UserForm } from "./user-form";

export const CreateUserDialog = ({ orgId }: { orgId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutate: createUser } = useCreateUser(orgId, () => {
    setIsOpen(false);
    router.refresh();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={createUser} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
