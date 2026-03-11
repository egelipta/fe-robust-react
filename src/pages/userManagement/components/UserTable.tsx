import { Pencil, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeRecord } from "./types";

type Props = {
  loading: boolean;
  rows: EmployeeRecord[];
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onEdit: (employee: EmployeeRecord) => void;
  onAssign: (employee: EmployeeRecord) => void;
  onManageRole: (employee: EmployeeRecord) => void;
  onResetPassword: (employee: EmployeeRecord) => void;
  onToggleStatus: (employee: EmployeeRecord) => void;
  statusText: (value: number | null) => string;
};

export default function UserTable({
  loading,
  rows,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onEdit,
  onAssign,
  onManageRole,
  onResetPassword,
  onToggleStatus,
  statusText,
}: Props) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                Data user tidak ditemukan
              </TableCell>
            </TableRow>
          )}

          {rows.map((row) => (
            <TableRow key={row.employee_id}>
              <TableCell>
                <div className="font-medium">{row.employee_name}</div>
                <div className="text-xs text-muted-foreground">{row.employee_dept || "-"}</div>
              </TableCell>
              <TableCell>{row.username || "-"}</TableCell>
              <TableCell>{row.email || "-"}</TableCell>
              <TableCell>{row.role_name || "-"}</TableCell>
              <TableCell>
                <span
                  className={
                    row.is_active === 1
                      ? "text-green-600 font-medium"
                      : row.is_active === 0
                        ? "text-red-600 font-medium"
                        : "text-muted-foreground"
                  }
                >
                  {statusText(row.is_active)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(row)}
                    title="Edit employee"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssign(row)}
                    title="Assign account"
                  >
                    <UserRound className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageRole(row)}
                    title="Manage role"
                  >
                    <Shield className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResetPassword(row)}
                    disabled={!row.username}
                  >
                    Reset Password
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleStatus(row)}
                    disabled={!row.user_id}
                  >
                    Toggle Status
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-3 flex items-center justify-between border-t">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={onPrevPage}>
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || loading}
            onClick={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
