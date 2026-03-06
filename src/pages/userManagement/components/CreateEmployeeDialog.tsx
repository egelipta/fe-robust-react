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
  CompanyOption,
  CreateEmployeeForm,
  RegionOption,
} from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateEmployeeForm;
  setForm: Dispatch<SetStateAction<CreateEmployeeForm>>;
  companies: CompanyOption[];
  regions: RegionOption[];
  submitting: boolean;
  onSubmit: () => void;
};

export default function CreateEmployeeDialog({
  open,
  onOpenChange,
  form,
  setForm,
  companies,
  regions,
  submitting,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Employee</DialogTitle>
          <DialogDescription>Buat data employee baru untuk user management.</DialogDescription>
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
                setForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Company</Label>
              <Select
                value={form.companies_id || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, companies_id: value }))
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
              <Label>Region</Label>
              <Select
                value={form.idpur_regions || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, idpur_regions: value }))
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
            <Label>Note</Label>
            <Input
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  note: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
