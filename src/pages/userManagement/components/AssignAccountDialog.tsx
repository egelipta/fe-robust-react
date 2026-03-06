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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AssignAccountForm,
  CompanyOption,
  EmployeeRecord,
  RegionOption,
  RoleOption,
} from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: AssignAccountForm;
  setForm: Dispatch<SetStateAction<AssignAccountForm>>;
  roles: RoleOption[];
  companies: CompanyOption[];
  regions: RegionOption[];
  selectedEmployee: EmployeeRecord | null;
  submitting: boolean;
  onSubmit: () => void;
};

export default function AssignAccountDialog({
  open,
  onOpenChange,
  form,
  setForm,
  roles,
  companies,
  regions,
  selectedEmployee,
  submitting,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User Account</DialogTitle>
          <DialogDescription>
            Buat akun login untuk employee
            {selectedEmployee ? `: ${selectedEmployee.employee_name}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Re Password</Label>
              <Input
                type="password"
                value={form.re_password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    re_password: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Affiliation Type</Label>
              <Select
                value={form.affiliation_type}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    affiliation_type: value,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Internal</SelectItem>
                  <SelectItem value="2">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Role (optional)</Label>
              <Select
                value={form.role_id || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, role_id: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id_role} value={String(role.id_role)}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Company (optional)</Label>
              <Select
                value={form.id_company || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, id_company: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id_com} value={String(company.id_com)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Region (optional)</Label>
              <Select
                value={form.id_region || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, id_region: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id_reg} value={String(region.id_reg)}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Input
              value={form.desc}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, desc: event.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            Save Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
