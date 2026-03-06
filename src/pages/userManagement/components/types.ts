export type EmployeeRecord = {
  employee_id: number;
  employee_name: string;
  employee_dept: string;
  email: string;
  note: string;
  username: string;
  user_id: number | null;
  is_active: number | null;
  role_name: string;
  role_id: number | null;
  id_role_user: number | null;
};

export type RoleOption = {
  id_role: number;
  role_name: string;
};

export type CompanyOption = {
  id_com: number;
  name: string;
};

export type RegionOption = {
  id_reg: number;
  name: string;
};

export type CreateEmployeeForm = {
  employee_name: string;
  employee_dept: string;
  email: string;
  note: string;
  companies_id: string;
  idpur_regions: string;
};

export type EditEmployeeForm = {
  employee_name: string;
  employee_dept: string;
  email: string;
  note: string;
};

export type AssignAccountForm = {
  username: string;
  password: string;
  re_password: string;
  affiliation_type: string;
  desc: string;
  id_company: string;
  id_region: string;
  role_id: string;
};

export type ResetPasswordForm = {
  username: string;
  new_password: string;
  confirm_password: string;
};

export const initialCreateEmployeeForm: CreateEmployeeForm = {
  employee_name: "",
  employee_dept: "",
  email: "",
  note: "",
  companies_id: "",
  idpur_regions: "",
};

export const initialEditEmployeeForm: EditEmployeeForm = {
  employee_name: "",
  employee_dept: "",
  email: "",
  note: "",
};

export const initialAssignAccountForm: AssignAccountForm = {
  username: "",
  password: "",
  re_password: "",
  affiliation_type: "1",
  desc: "",
  id_company: "",
  id_region: "",
  role_id: "",
};

export const initialResetPasswordForm: ResetPasswordForm = {
  username: "",
  new_password: "",
  confirm_password: "",
};
