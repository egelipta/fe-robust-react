import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initTheme } from "./lib/theme";
// Ensure the generated API client uses a relative baseUrl so the Vite dev
// proxy can forward requests and avoid CORS without editing files under
// `src/api/base` (per request).
import { client } from "@/api/base/client.gen";

// Set the client baseUrl to the dev proxy path. This will make all SDK
// requests go to /api/* on the dev server which is proxied to the backend.
// Use empty baseUrl so requests go to the current origin + endpoint path
// (the generated SDK includes full endpoint URLs like '/api/login'). This
// lets Vite's proxy forward requests to the backend during development.
client.setConfig({ baseUrl: "", credentials: "include" as any });

// Attach Authorization header from localStorage for all outgoing requests
// so the app has parity with the Vue project. If `auth_token` exists we
// add it as `Authorization: Bearer <token>` to every request.
client.interceptors.request.use((request: Request) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return request;

    const authValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const headers = new Headers(request.headers);
    headers.set("Authorization", authValue);

    return new Request(request, { headers });
  } catch (err) {
    return request;
  }
});

initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
