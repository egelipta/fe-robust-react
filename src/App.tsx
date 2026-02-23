import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import MapTrackingPage from "./pages/mapTracking";
import VesselsPage from "./pages/vessels";
import EditVesselPage from "./pages/vessels/EditVessel";
import DetailVesselPage from "./pages/vessels/components/DetailVessel";
import LoginPage from "./pages/Login";
import RouteIdPage from "./pages/routeId";
import type { JSX } from "react";
import { Toaster } from "@/components/ui/sonner";

function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuth = localStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
}

function LayoutApp() {
  const location = useLocation();
  const showMap =
    location.pathname === "/map-tracking" || location.pathname === "/";

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" />

      <div className="flex-1 relative overflow-hidden">
        {/* 🔥 Map tidak pernah unmount */}
        <div className={showMap ? "block h-full" : "hidden"}>
          <MapTrackingPage />
        </div>

        {!showMap && (
          <Routes>
            <Route path="/vessels-data" element={<VesselsPage />} />
            <Route path="/vessels-data/:id/edit" element={<EditVesselPage />} />
            <Route
              path="/vessels-data/:id/detail"
              element={<DetailVesselPage />}
            />
            <Route path="/route-id" element={<RouteIdPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED APP */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <LayoutApp />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
