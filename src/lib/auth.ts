import { loginApiLoginPost } from "@/api/base";

export type LoginResult = {
  success: boolean;
  message?: string;
  status_code?: number;
  data?: any;
};

/**
 * Attempt to login with username and password.
 * Note: the generated API expects an `ip_address` field; we pass an empty
 * string here because client IP is not available in the browser context.
 *
 * On success we store the `data` payload from the server into localStorage
 * under the `auth` key (as JSON). The stored shape matches the backend
 * `data` object (user, employee, company, permissions).
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResult> {
  const body = { username, password, ip_address: "" };

  const res = await loginApiLoginPost({ body });

  // The generated client returns an object with either { data, request, response }
  // or { error, request, response } depending on the outcome. We'll handle
  // both cases and throw on error.
  if ((res as any).data) {
    const server = (res as any).data as LoginResult;

    // If login succeeded, persist several keys to localStorage to match
    // the behaviour used in the Vue project so the rest of the app can
    // read user, employee, company and permissions.
    try {
      const payload =
        server && (server as any).data ? (server as any).data : (server as any);

      localStorage.setItem(
        "auth_authenticated",
        String(server.success === true),
      );
      // Backwards-compatible flag used by the React app's RequireAuth
      // component. Some parts of the app still check `localStorage.auth`.
      if (server.success === true) {
        localStorage.setItem("auth", "true");
      } else {
        localStorage.removeItem("auth");
      }

      if (payload?.user) {
        localStorage.setItem("auth_user", JSON.stringify(payload.user));
      } else {
        localStorage.removeItem("auth_user");
      }

      if (payload?.employee) {
        localStorage.setItem("auth_employee", JSON.stringify(payload.employee));
      } else {
        localStorage.removeItem("auth_employee");
      }

      if (payload?.company) {
        localStorage.setItem("auth_company", JSON.stringify(payload.company));
      } else {
        localStorage.removeItem("auth_company");
      }

      if (Array.isArray(payload?.permissions)) {
        localStorage.setItem(
          "auth_permissions",
          JSON.stringify(payload.permissions),
        );
      } else {
        localStorage.setItem("auth_permissions", JSON.stringify([]));
      }

      // Backward-compatible username and employee name
      const employee = payload?.employee;
      const user = payload?.user;
      const usernameToStore = String(
        employee?.username ?? user?.username ?? username ?? "",
      );
      localStorage.setItem("username", usernameToStore);

      if (employee?.employee_name) {
        localStorage.setItem("employee_name", String(employee.employee_name));
      } else {
        localStorage.removeItem("employee_name");
      }

      // If the server returned a token (common field names), store it for
      // Authorization header usage. This is optional — if the backend uses
      // session cookies only there may be no token.
      const token =
        payload?.token ??
        payload?.access_token ??
        (server as any)?.token ??
        (server as any)?.access_token;
      if (token) {
        localStorage.setItem("auth_token", String(token));
      }
    } catch (e) {
      // ignore storage issues
    }

    return server as LoginResult;
  }

  const err = (res as any).error ?? "Login failed";
  // Normalize to Error
  throw err instanceof Error
    ? err
    : new Error(typeof err === "string" ? err : JSON.stringify(err));
}
