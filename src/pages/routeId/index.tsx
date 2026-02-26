import { useLocation } from "react-router-dom";

export default function RouteIdPage() {
  const location = useLocation();
  const isSetup = location.pathname === "/route-id/setup";
  const title = isSetup ? "Setup" : "Datalog";

  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-2">Route ID - {title}</h1>
      <p className="text-sm text-muted-foreground">
        Halaman {title} untuk Route ID.
      </p>
    </div>
  );
}
