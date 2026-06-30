"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { updateTargetRole } from "@/lib/actions/profile";

interface CareerRole {
  id: string;
  role_name: string;
  description: string | null;
}

interface CareerGoalDialogProps {
  roles: CareerRole[];
}

export default function CareerGoalDialog({
  roles,
}: CareerGoalDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!selectedRole) return;

    startTransition(async () => {
      const result = await updateTargetRole(selectedRole);

      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        alert(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Set Goal
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Choose Your Career Goal
          </DialogTitle>
        </DialogHeader>

        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a career role" />
          </SelectTrigger>

          <SelectContent>
            {roles.map((role) => (
              <SelectItem
                key={role.id}
                value={role.role_name}
              >
                {role.role_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

