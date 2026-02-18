import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { getAllVesselsApiVesselAllGet } from "@/api/base/sdk.gen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export type VesselSearchStatus = "0" | "1" | "2" | "unknown";
export type VesselStatusFilter = VesselSearchStatus | "all";

export type VesselSearchItem = {
  id: number;
  name: string;
  lat: number;
  long: number;
  status: VesselSearchStatus;
  heading: number;
};

type Props = {
  statusFilter: VesselStatusFilter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: VesselSearchItem) => void;
};

export default function FilterSearch({
  statusFilter,
  open,
  onOpenChange,
  onSelect,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<VesselSearchItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoadingSearch(true);

        const resp = await getAllVesselsApiVesselAllGet({
          query: {
            search: value,
            ...(statusFilter === "all"
              ? {}
              : statusFilter === "unknown"
                ? { status: "" }
                : { status: statusFilter }),
          },
        });

        const r = (resp as any)?.data ?? (resp as any);
        let items: any[] = [];

        if (Array.isArray(r?.data)) items = r.data;
        else if (Array.isArray(r)) items = r;
        else if (Array.isArray(r?.items)) items = r.items;

        const mapped: VesselSearchItem[] = items.map((v: any, idx: number) => {
          const rawStatus = String(v.status ?? "").trim();
          const status: VesselSearchStatus =
            rawStatus === "0" || rawStatus === "1" || rawStatus === "2"
              ? rawStatus
              : "unknown";

          return {
            id: v.id_vessel ?? v.id ?? idx,
            name: v.vessel_name ?? v.name ?? `Vessel ${idx}`,
            lat: Number(v.lat ?? v.latitude ?? 0),
            long: Number(v.long ?? v.longitude ?? 0),
            status,
            heading: v.heading ?? 0,
          };
        });

        setSearchResults(mapped);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center gap-3">
      <Button
        onClick={() => onOpenChange(!open)}
        className={`w-10 h-10 rounded-full bg-[var(--navbar)] text-[var(--text-primary)] shadow-lg
          flex items-center justify-center transition-all duration-200
          hover:bg-primary hover:text-white
          ${open ? "bg-primary text-white shadow-none" : ""}`}
      >
        <Search size={20} />
      </Button>

      <div
        className={`absolute left-12 transition-all duration-300 ease-in-out
          ${open ? "w-64 opacity-100 pointer-events-auto bg-[var(--background)] p-2 rounded-md" : "w-0 opacity-0 pointer-events-none"}`}
      >
        <Input
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search vessel..."
          className="h-9"
          autoFocus={open}
        />
      </div>

      {open && (loadingSearch || searchResults.length > 0) && (
        <div className="absolute left-12 top-12 w-72 bg-[var(--background)] shadow-xl rounded-md z-[1001]">
          {loadingSearch && (
            <div className="p-3 text-sm text-muted-foreground">
              Searching...
            </div>
          )}
          <ScrollArea className="h-72 p-2">
            <div className="space-y-1">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onOpenChange(false);
                    setSearchResults([]);
                    setSearchValue("");
                  }}
                  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-muted transition"
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.lat}, {item.long}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
