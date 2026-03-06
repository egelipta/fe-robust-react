import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmployeeRecord, RoleOption } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployee: EmployeeRecord | null;
  selectedRoleId: string;
  setSelectedRoleId: (value: string) => void;
  roles: RoleOption[];
  submitting: boolean;
  onSubmit: () => void;
};

export default function ManageRoleDialog({
  open,
  onOpenChange,
  selectedEmployee,
  selectedRoleId,
  setSelectedRoleId,
  roles,
  submitting,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Role</DialogTitle>
          <DialogDescription>
            Atur role untuk {selectedEmployee?.employee_name || "employee"}. Kosongkan role untuk
            unassign.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Role</Label>
            <Select
              value={selectedRoleId || "none"}
              onValueChange={(value) => setSelectedRoleId(value === "none" ? "" : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Role</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id_role} value={String(role.id_role)}>
                    {role.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            Save Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
