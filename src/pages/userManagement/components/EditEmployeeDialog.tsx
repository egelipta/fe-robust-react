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
import type { EditEmployeeForm } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: EditEmployeeForm;
  setForm: Dispatch<SetStateAction<EditEmployeeForm>>;
  submitting: boolean;
  onSubmit: () => void;
};

export default function EditEmployeeDialog({
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
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Perbarui data employee.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Nama Employee</Label>
            <Input
              value={form.employee_name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  employee_name: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Department</Label>
            <Input
              value={form.employee_dept}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  employee_dept: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Note</Label>
            <Input
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, note: event.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
