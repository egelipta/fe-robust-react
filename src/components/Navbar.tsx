import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

const menuClass = ({ isActive }: { isActive: boolean }) =>
  `block px-2 py-1 rounded-none text-sm font-medium transition-colors
   ${
     isActive
       ? "bg-primary/10 text-primary"
       : "hover:bg-primary/10 hover:text-primary"
   }`;

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const dateTime = now.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // close dropdown when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="relative w-full h-14 px-3 flex items-center justify-between bg-[var(--navbar)] sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 font-bold text-lg">
          {/* LIGHT */}
          <img
            src="/logo-green.png"
            alt="Logo"
            className="h-9 block dark:hidden"
          />
          <img
            src="/brand-green.png"
            alt="Brand"
            className="h-9 block dark:hidden"
          />

          {/* DARK */}
          <img
            src="/logo-white.png"
            alt="Logo Dark"
            className="h-9 hidden dark:block"
          />
          <img
            src="/brand-white.png"
            alt="Brand Dark"
            className="h-9 hidden dark:block"
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/map-tracking" className={menuClass}>
            <span className="font-semibold text-md uppercase">
              Map Tracking
            </span>
          </NavLink>
          <NavLink to="/vessels-data" className={menuClass}>
            <span className="font-semibold text-md uppercase">
              Vessels Data
            </span>
          </NavLink>
          <NavLink to="/route-id" className={menuClass}>
            <span className="font-semibold text-md uppercase">Route ID</span>
          </NavLink>
        </div>
      </div>

      {/* CENTER TITLE */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block text-lg font-semibold tracking-wide">
        TELEMATIC TRACKING SERVICE
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right leading-tight">
          <div className="font-semibold">Hi, Admin</div>
          <div className="text-xs text-muted-foreground">{dateTime}</div>
        </div>

        <Button
          size="sm"
          className="hidden md:flex cursor-pointer"
          variant={"outline"}
        >
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>

        {/* HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md hover:bg-primary/10"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DROPDOWN MOBILE */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-3 top-14 w-56 rounded-lg border bg-background shadow-lg p-2 md:hidden space-y-1"
        >
          <NavLink
            to="/map-tracking"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            Map Tracking
          </NavLink>
          <NavLink
            to="/vessels-data"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            Vessels Data
          </NavLink>
          <NavLink
            to="/route-id"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            Route ID
          </NavLink>

          <div className="my-2 border-t" />

          <div className="px-3 py-2 text-xs text-muted-foreground">
            Hi, Admin
            <br />
            {dateTime}
          </div>

          <Button
            size="sm"
            className="w-full mt-2 cursor-pointer"
            variant="destructive"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
