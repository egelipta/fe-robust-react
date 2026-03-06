import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResetPasswordForm } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ResetPasswordForm;
  setForm: Dispatch<SetStateAction<ResetPasswordForm>>;
  submitting: boolean;
  onSubmit: () => void;
};

export default function ResetPasswordDialog({
  open,
  onOpenChange,
  form,
  setForm,
  submitting,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password User</DialogTitle>
          <DialogDescription>Reset password akun user berdasarkan employee dan username.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>New Password</Label>
              <Input
                type="password"
                value={form.new_password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    new_password: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={form.confirm_password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    confirm_password: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
