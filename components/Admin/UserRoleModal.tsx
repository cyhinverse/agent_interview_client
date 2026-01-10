'use client';

import { useState, useEffect } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUpdateUserRole } from '@/hooks/useAdmin';
import { User } from '@/features/users/usersApi';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

const roles = [
  {
    value: 'CANDIDATE',
    label: 'Candidate',
    description: 'Can take interviews',
    variant: 'secondary' as const,
  },
  {
    value: 'INTERVIEWER',
    label: 'Interviewer',
    description: 'Can review sessions',
    variant: 'default' as const,
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Full system access',
    variant: 'destructive' as const,
  },
];

export function UserRoleModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');

  const { mutate: updateRole, isPending } = useUpdateUserRole();

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRole) return;

    updateRole(
      {
        userId: user.id,
        role: selectedRole as 'CANDIDATE' | 'INTERVIEWER' | 'ADMIN',
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>{user.fullName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              {user.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant={role.variant}>{role.label}</Badge>
                      <span className="text-muted-foreground text-xs">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || selectedRole === user.role}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
