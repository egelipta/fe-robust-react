import { useCallback, useEffect, useMemo, useState } from "react";
import {
  assignUserApiUserCreatePost,
  createEmployeeApiEmployeePost,
  createRoleUserApiRoleUsersAssignPost,
  deleteUserApiEmployeeEmployeeIdDelete,
  getAllVesselRoleUsersApiRoleUsersGet,
  getCabangByCompanyApiListCabangAllGet,
  getCompaniesAllApiListCompanyAllGet,
  getEmployeeApiEmployeeGet,
  getRolesAllApiRolesAllGet,
  resetUserPasswordApiUserResetPasswordPost,
  toggleUserStatusApiUserStatusUpdatePut,
  unassignRoleUserApiRoleUserUnassignIdRoleUserDelete,
  updateEmployeeApiEmployeeEmployeeIdPut,
  updateRoleUserApiRoleUserUpdateIdRoleUserPut,
} from "@/api/base/sdk.gen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, RefreshCcw, Search } from "lucide-react";
import AssignAccountDialog from "./components/AssignAccountDialog";
import CreateEmployeeDialog from "./components/CreateEmployeeDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditEmployeeDialog from "./components/EditEmployeeDialog";
import ManageRoleDialog from "./components/ManageRoleDialog";
import ResetPasswordDialog from "./components/ResetPasswordDialog";
import UserTable from "./components/UserTable";
import {
  type AssignAccountForm,
  type CompanyOption,
  type CreateEmployeeForm,
  type EditEmployeeForm,
  type EmployeeRecord,
  initialAssignAccountForm,
  initialCreateEmployeeForm,
  initialEditEmployeeForm,
  initialResetPasswordForm,
  type RegionOption,
  type ResetPasswordForm,
  type RoleOption,
} from "./components/types";

type UnknownRecord = Record<string, unknown>;

type RoleAssignment = {
  id_role_user: number;
  user_id: number | null;
  role_id: number | null;
  role_name: string;
  username: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toRecord(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function getString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function getNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractPayload(response: unknown): unknown {
  const top = toRecord(response);
  const level1 = top.data;
  if (!isRecord(level1)) return level1;
  return "data" in level1 ? (level1.data ?? level1) : level1;
}

function extractArray(payload: unknown, keys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;
  const obj = toRecord(payload);

  for (const key of keys) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }

  const commonKeys = ["items", "list", "results", "rows", "records", "data"];
  for (const key of commonKeys) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }

  return [];
}

function extractArrayDeep(
  payload: unknown,
  keys: string[],
  markerKeys: string[],
): unknown[] {
  const direct = extractArray(payload, keys);
  if (direct.length > 0) return direct;

  const queue: unknown[] = [payload];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      if (current.length === 0) continue;
      const first = toRecord(current[0]);
      const hasMarker = markerKeys.some((marker) => marker in first);
      if (hasMarker) return current;
      current.forEach((item) => queue.push(item));
      continue;
    }

    const obj = toRecord(current);
    const nested = extractArray(obj, keys);
    if (nested.length > 0) return nested;

    Object.values(obj).forEach((value) => {
      if (isRecord(value) || Array.isArray(value)) queue.push(value);
    });
  }

  return [];
}

function getMessage(response: unknown, fallback: string): string {
  const top = toRecord(response);
  const lvl1 = toRecord(top.data);
  const message = lvl1.message ?? top.message;
  const normalized = getString(message).trim();
  return normalized || fallback;
}

function mapRoleAssignment(item: unknown): RoleAssignment | null {
  const row = toRecord(item);
  const roleUser = toRecord(row.role_user);
  const user = toRecord(row.user);
  const role = toRecord(row.role);

  const idRoleUser =
    getNumber(row.id_role_user) ??
    getNumber(roleUser.id_role_user) ??
    getNumber(row.idRoleUser) ??
    getNumber(row.id);
  if (!idRoleUser) return null;

  const userId =
    getNumber(row.user_id) ??
    getNumber(roleUser.user_id) ??
    getNumber(row.id_user) ??
    getNumber(user.id_user) ??
    getNumber(user.id);

  const roleId =
    getNumber(row.role_id) ??
    getNumber(roleUser.role_id) ??
    getNumber(row.id_role) ??
    getNumber(role.id_role) ??
    getNumber(role.id);

  const roleName =
    getString(row.role_name) ||
    getString(roleUser.role_name) ||
    getString(role.role_name) ||
    getString(role.name);

  const username =
    getString(row.username) ||
    getString(roleUser.username) ||
    getString(user.username) ||
    getString(row.user_name);

  return {
    id_role_user: idRoleUser,
    user_id: userId,
    role_id: roleId,
    role_name: roleName,
    username,
  };
}

function mapEmployee(item: unknown): EmployeeRecord | null {
  const row = toRecord(item);
  const employee = toRecord(row.employee);
  const user = toRecord(row.user);

  const employeeId =
    getNumber(row.employee_id) ??
    getNumber(row.idpur_employees) ??
    getNumber(employee.employee_id) ??
    getNumber(employee.idpur_employees) ??
    getNumber(row.id_employee) ??
    getNumber(employee.id_employee) ??
    getNumber(row.idemployee) ??
    getNumber(employee.idemployee) ??
    getNumber(row.id);

  if (!employeeId) return null;

  const employeeName =
    getString(row.employee_name) ||
    getString(employee.employee_name) ||
    getString(row.name) ||
    getString(employee.name) ||
    getString(row.full_name);

  const employeeDept =
    getString(row.employee_dept) ||
    getString(employee.employee_dept) ||
    getString(row.department);
  const email = getString(row.email) || getString(employee.email);
  const note = getString(row.note) || getString(employee.note);

  const username =
    getString(row.username) ||
    getString(employee.username) ||
    getString(user.username) ||
    getString(row.user_name);

  const userId =
    getNumber(row.user_id) ??
    getNumber(employee.user_id) ??
    getNumber(row.id_user) ??
    getNumber(user.id_user) ??
    getNumber(user.id);

  const isActive =
    getNumber(row.is_active) ??
    getNumber(employee.is_active) ??
    getNumber(row.active) ??
    getNumber(user.is_active) ??
    getNumber(user.active);

  return {
    employee_id: employeeId,
    employee_name: employeeName || `Employee #${employeeId}`,
    employee_dept: employeeDept,
    email,
    note,
    username,
    user_id: userId,
    is_active: isActive,
    role_name: "",
    role_id: null,
    id_role_user: null,
  };
}

function mapRole(item: unknown): RoleOption | null {
  const row = toRecord(item);
  const id = getNumber(row.id_role) ?? getNumber(row.role_id) ?? getNumber(row.id);
  if (!id) return null;
  const name = getString(row.role_name) || getString(row.name);
  return {
    id_role: id,
    role_name: name || `Role #${id}`,
  };
}

function mapCompany(item: unknown): CompanyOption | null {
  const row = toRecord(item);
  const id = getNumber(row.id_com) ?? getNumber(row.company_id) ?? getNumber(row.id);
  if (!id) return null;
  const name = getString(row.name) || getString(row.company_name);
  return {
    id_com: id,
    name: name || `Company #${id}`,
  };
}

function mapRegion(item: unknown): RegionOption | null {
  const row = toRecord(item);
  const id = getNumber(row.id_reg) ?? getNumber(row.region_id) ?? getNumber(row.id);
  if (!id) return null;
  const name = getString(row.name) || getString(row.region_name);
  return {
    id_reg: id,
    name: name || `Region #${id}`,
  };
}

async function findUserIdByUsername(username: string): Promise<number | null> {
  const response = await getAllVesselRoleUsersApiRoleUsersGet({
    query: { search: username, page: 1, limit: 100 },
  });

  const payload = extractPayload(response);
  const roleRows = extractArrayDeep(
    payload,
    ["role_users", "roleUsers", "assignments"],
    ["id_role_user", "user_id", "role_id", "username"],
  )
    .map(mapRoleAssignment)
    .filter((item): item is RoleAssignment => item !== null);

  const found = roleRows.find(
    (item) => item.username.toLowerCase() === username.toLowerCase(),
  );

  return found?.user_id ?? null;
}

export default function UserManagementPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [rows, setRows] = useState<EmployeeRecord[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [openAssignAccount, setOpenAssignAccount] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<EmployeeRecord | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);

  const [createEmployeeForm, setCreateEmployeeForm] =
    useState<CreateEmployeeForm>(initialCreateEmployeeForm);
  const [editEmployeeForm, setEditEmployeeForm] =
    useState<EditEmployeeForm>(initialEditEmployeeForm);
  const [assignAccountForm, setAssignAccountForm] =
    useState<AssignAccountForm>(initialAssignAccountForm);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [resetPasswordForm, setResetPasswordForm] =
    useState<ResetPasswordForm>(initialResetPasswordForm);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [employeesRes, roleUsersRes, rolesRes, companiesRes, regionsRes] =
        await Promise.all([
          getEmployeeApiEmployeeGet({
            query: {
              current: page,
              pageSize,
              search: debouncedSearch || null,
            },
          }),
          getAllVesselRoleUsersApiRoleUsersGet({
            query: {
              search: debouncedSearch || null,
              page,
              limit: 200,
            },
          }),
          getRolesAllApiRolesAllGet(),
          getCompaniesAllApiListCompanyAllGet(),
          getCabangByCompanyApiListCabangAllGet(),
        ]);

      const employeePayload = extractPayload(employeesRes);
      const rolePayload = extractPayload(roleUsersRes);
      const rolesPayload = extractPayload(rolesRes);
      const companyPayload = extractPayload(companiesRes);
      const regionPayload = extractPayload(regionsRes);

      const mappedEmployees = extractArrayDeep(
        employeePayload,
        ["employees", "employee", "users"],
        ["employee_id", "id_employee", "employee_name", "email", "username"],
      )
        .map(mapEmployee)
        .filter((item): item is EmployeeRecord => item !== null);

      const mappedRoleAssignments = extractArrayDeep(
        rolePayload,
        ["role_users", "roleUsers", "assignments"],
        ["id_role_user", "user_id", "role_id", "username"],
      )
        .map(mapRoleAssignment)
        .filter((item): item is RoleAssignment => item !== null);

      const rolesList = extractArrayDeep(
        rolesPayload,
        ["roles", "items", "data"],
        ["id_role", "role_id", "role_name", "name"],
      )
        .map(mapRole)
        .filter((item): item is RoleOption => item !== null);

      const companyList = extractArrayDeep(
        companyPayload,
        ["companies", "items", "data"],
        ["id_com", "company_id", "name", "company_name"],
      )
        .map(mapCompany)
        .filter((item): item is CompanyOption => item !== null);

      const regionList = extractArrayDeep(
        regionPayload,
        ["regions", "items", "data"],
        ["id_reg", "region_id", "name", "region_name"],
      )
        .map(mapRegion)
        .filter((item): item is RegionOption => item !== null);

      const roleByUserId = new Map<number, RoleAssignment>();
      const roleByUsername = new Map<string, RoleAssignment>();

      mappedRoleAssignments.forEach((assignment) => {
        if (assignment.user_id) roleByUserId.set(assignment.user_id, assignment);
        if (assignment.username) {
          roleByUsername.set(assignment.username.toLowerCase(), assignment);
        }
      });

      const merged = mappedEmployees.map((employee) => {
        const byUserId = employee.user_id ? roleByUserId.get(employee.user_id) : undefined;
        const byUsername = employee.username
          ? roleByUsername.get(employee.username.toLowerCase())
          : undefined;
        const assignment = byUserId ?? byUsername;

        return {
          ...employee,
          role_name: assignment?.role_name ?? "",
          role_id: assignment?.role_id ?? null,
          id_role_user: assignment?.id_role_user ?? null,
        };
      });

      const pagination = toRecord(toRecord(employeePayload).pagination);
      const current = getNumber(pagination.current) ?? page;
      const total = getNumber(pagination.totalPages) ?? 1;

      setRows(merged);
      setRoles(rolesList);
      setCompanies(companyList);
      setRegions(regionList);
      setPage(current);
      setTotalPages(total);
    } catch (error) {
      console.error("Failed to fetch user management data:", error);
      toast.error("Gagal memuat data user management");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const statusText = useMemo(() => {
    return (value: number | null) => {
      if (value === 1) return "Active";
      if (value === 0) return "Inactive";
      return "-";
    };
  }, []);

  const openEditDialog = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
    setEditEmployeeForm({
      employee_name: employee.employee_name,
      employee_dept: employee.employee_dept,
      email: employee.email,
      note: employee.note,
    });
    setOpenEditEmployee(true);
  };

  const openAssignDialog = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
    setAssignAccountForm({
      ...initialAssignAccountForm,
      username: employee.username,
    });
    setOpenAssignAccount(true);
  };

  const openRoleManageDialog = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
    setSelectedRoleId(employee.role_id ? String(employee.role_id) : "");
    setOpenRoleDialog(true);
  };

  const openResetDialog = (employee: EmployeeRecord) => {
    setSelectedEmployee(employee);
    setResetPasswordForm({
      ...initialResetPasswordForm,
      username: employee.username,
    });
    setOpenResetPassword(true);
  };

  const handleCreateEmployee = async () => {
    if (!createEmployeeForm.employee_name.trim()) {
      toast.error("Nama employee wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const response = await createEmployeeApiEmployeePost({
        body: {
          employee_name: createEmployeeForm.employee_name.trim(),
          employee_dept: createEmployeeForm.employee_dept || null,
          email: createEmployeeForm.email || null,
          note: createEmployeeForm.note || null,
          companies_id: createEmployeeForm.companies_id
            ? Number(createEmployeeForm.companies_id)
            : null,
          idpur_regions: createEmployeeForm.idpur_regions
            ? Number(createEmployeeForm.idpur_regions)
            : null,
        },
      });

      toast.success(getMessage(response, "Employee berhasil ditambahkan"));
      setOpenCreateEmployee(false);
      setCreateEmployeeForm(initialCreateEmployeeForm);
      await fetchData();
    } catch (error) {
      console.error("Create employee failed:", error);
      toast.error("Gagal menambahkan employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;

    if (!editEmployeeForm.employee_name.trim()) {
      toast.error("Nama employee wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateEmployeeApiEmployeeEmployeeIdPut({
        path: { employee_id: selectedEmployee.employee_id },
        body: {
          employee_name: editEmployeeForm.employee_name,
          employee_dept: editEmployeeForm.employee_dept || null,
          email: editEmployeeForm.email || null,
          note: editEmployeeForm.note || null,
        },
      });

      toast.success(getMessage(response, "Employee berhasil diperbarui"));
      setOpenEditEmployee(false);
      await fetchData();
    } catch (error) {
      console.error("Update employee failed:", error);
      toast.error("Gagal memperbarui employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignAccount = async () => {
    if (!selectedEmployee) return;

    if (!assignAccountForm.username.trim()) {
      toast.error("Username wajib diisi");
      return;
    }

    if (!assignAccountForm.password) {
      toast.error("Password wajib diisi");
      return;
    }

    if (assignAccountForm.password !== assignAccountForm.re_password) {
      toast.error("Password dan re-password tidak sama");
      return;
    }

    try {
      setSubmitting(true);

      const response = await assignUserApiUserCreatePost({
        body: {
          idemployee: selectedEmployee.employee_id,
          username: assignAccountForm.username,
          password: assignAccountForm.password,
          re_password: assignAccountForm.re_password,
          affiliation_type: Number(assignAccountForm.affiliation_type || "1"),
          desc: assignAccountForm.desc,
          id_company: assignAccountForm.id_company
            ? Number(assignAccountForm.id_company)
            : null,
          id_region: assignAccountForm.id_region
            ? Number(assignAccountForm.id_region)
            : null,
        },
      });

      if (assignAccountForm.role_id) {
        const roleId = Number(assignAccountForm.role_id);
        let userId = selectedEmployee.user_id;

        if (!userId) {
          userId = await findUserIdByUsername(assignAccountForm.username);
        }

        if (userId) {
          await createRoleUserApiRoleUsersAssignPost({
            body: {
              user_id: userId,
              role_id: roleId,
              scope: 0,
            },
          });
        } else {
          toast.warning(
            "Akun dibuat, tapi assign role dilewati karena user_id belum terdeteksi",
          );
        }
      }

      toast.success(getMessage(response, "Akun user berhasil dibuat"));
      setOpenAssignAccount(false);
      setAssignAccountForm(initialAssignAccountForm);
      await fetchData();
    } catch (error) {
      console.error("Assign account failed:", error);
      toast.error("Gagal membuat akun user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (employee: EmployeeRecord) => {
    if (!employee.user_id) {
      toast.error("User ID tidak tersedia untuk toggle status");
      return;
    }

    try {
      setSubmitting(true);
      const response = await toggleUserStatusApiUserStatusUpdatePut({
        query: { id_user: employee.user_id },
      });

      toast.success(getMessage(response, "Status user berhasil diubah"));
      await fetchData();
    } catch (error) {
      console.error("Toggle status failed:", error);
      toast.error("Gagal mengubah status user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedEmployee) return;

    if (!resetPasswordForm.username.trim()) {
      toast.error("Username wajib diisi");
      return;
    }

    if (!resetPasswordForm.new_password) {
      toast.error("Password baru wajib diisi");
      return;
    }

    if (resetPasswordForm.new_password !== resetPasswordForm.confirm_password) {
      toast.error("Password dan konfirmasi password tidak sama");
      return;
    }

    try {
      setSubmitting(true);
      const response = await resetUserPasswordApiUserResetPasswordPost({
        body: {
          id_employee: selectedEmployee.employee_id,
          username: resetPasswordForm.username,
          new_password: resetPasswordForm.new_password,
          confirm_password: resetPasswordForm.confirm_password,
        },
      });

      toast.success(getMessage(response, "Password berhasil direset"));
      setOpenResetPassword(false);
      setResetPasswordForm(initialResetPasswordForm);
      await fetchData();
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Gagal reset password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveRole = async () => {
    if (!selectedEmployee) return;

    try {
      setSubmitting(true);

      if (selectedEmployee.id_role_user && !selectedRoleId) {
        const response = await unassignRoleUserApiRoleUserUnassignIdRoleUserDelete({
          path: { id_role_user: selectedEmployee.id_role_user },
        });
        toast.success(getMessage(response, "Role berhasil dilepas"));
      } else if (selectedEmployee.id_role_user && selectedRoleId) {
        const response = await updateRoleUserApiRoleUserUpdateIdRoleUserPut({
          path: { id_role_user: selectedEmployee.id_role_user },
          query: { new_role_id: Number(selectedRoleId) },
        });
        toast.success(getMessage(response, "Role berhasil diperbarui"));
      } else if (selectedRoleId) {
        if (!selectedEmployee.user_id) {
          toast.error("User ID tidak tersedia untuk assign role");
          return;
        }

        const response = await createRoleUserApiRoleUsersAssignPost({
          body: {
            user_id: selectedEmployee.user_id,
            role_id: Number(selectedRoleId),
            scope: 0,
          },
        });

        toast.success(getMessage(response, "Role berhasil di-assign"));
      } else {
        toast.error("Pilih role terlebih dahulu");
        return;
      }

      setOpenRoleDialog(false);
      await fetchData();
    } catch (error) {
      console.error("Save role failed:", error);
      toast.error("Gagal menyimpan role user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deleteTarget) return;

    try {
      setSubmitting(true);
      const response = await deleteUserApiEmployeeEmployeeIdDelete({
        path: { employee_id: deleteTarget.employee_id },
      });

      toast.success(getMessage(response, "User berhasil dihapus"));
      setDeleteTarget(null);
      await fetchData();
    } catch (error) {
      console.error("Delete user failed:", error);
      toast.error("Gagal menghapus user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-3 gap-3">
      <Card className="p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari nama, email, username..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading || submitting}>
              <RefreshCcw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button onClick={() => setOpenCreateEmployee(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Employee
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <UserTable
          loading={loading}
          rows={rows}
          page={page}
          totalPages={totalPages}
          onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
          onNextPage={() => setPage((prev) => prev + 1)}
          onEdit={openEditDialog}
          onAssign={openAssignDialog}
          onManageRole={openRoleManageDialog}
          onResetPassword={openResetDialog}
          onToggleStatus={handleToggleStatus}
          onDelete={setDeleteTarget}
          statusText={statusText}
        />
      </Card>

      <CreateEmployeeDialog
        open={openCreateEmployee}
        onOpenChange={setOpenCreateEmployee}
        form={createEmployeeForm}
        setForm={setCreateEmployeeForm}
        companies={companies}
        regions={regions}
        submitting={submitting}
        onSubmit={handleCreateEmployee}
      />

      <EditEmployeeDialog
        open={openEditEmployee}
        onOpenChange={setOpenEditEmployee}
        form={editEmployeeForm}
        setForm={setEditEmployeeForm}
        submitting={submitting}
        onSubmit={handleUpdateEmployee}
      />

      <AssignAccountDialog
        open={openAssignAccount}
        onOpenChange={setOpenAssignAccount}
        form={assignAccountForm}
        setForm={setAssignAccountForm}
        roles={roles}
        companies={companies}
        regions={regions}
        selectedEmployee={selectedEmployee}
        submitting={submitting}
        onSubmit={handleAssignAccount}
      />

      <ManageRoleDialog
        open={openRoleDialog}
        onOpenChange={setOpenRoleDialog}
        selectedEmployee={selectedEmployee}
        selectedRoleId={selectedRoleId}
        setSelectedRoleId={setSelectedRoleId}
        roles={roles}
        submitting={submitting}
        onSubmit={handleSaveRole}
      />

      <ResetPasswordDialog
        open={openResetPassword}
        onOpenChange={setOpenResetPassword}
        form={resetPasswordForm}
        setForm={setResetPasswordForm}
        submitting={submitting}
        onSubmit={handleResetPassword}
      />

      <DeleteUserDialog
        target={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        submitting={submitting}
        onConfirm={handleDeleteEmployee}
      />
    </div>
  );
}
