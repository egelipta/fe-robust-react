import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  LayoutGrid,
  List,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  Ellipsis,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { getVesselsApiVesselGet } from "@/api/base/sdk.gen";
import { Image } from "antd";

interface Vessel {
  id_vessel: number;
  vessel_name: string;
  callsign?: string;
  cabang?: string;
  id_terminal?: string;
  imo?: string;
  status?: string;
}

function VesselsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dtVessels, setDtVessels] = useState<Vessel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(55);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchAllVessels = async () => {
    try {
      setLoading(true);

      const res = await getVesselsApiVesselGet({
        query: {
          pageSize,
          current: page,
          search: debouncedSearch || undefined,
        },
      });

      const api = res as any;

      if (!api?.data?.data) return;

      setDtVessels(api.data.data.vessels ?? []);
      setTotalPages(api.data.data.pagination?.totalPages ?? 1);
      setPage(api.data.data.pagination?.current ?? 1);
    } catch (error) {
      console.error("Error fetching vessels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVessels();
  }, [page, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset ke page 1 saat search berubah
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "0":
        return {
          label: "operational",
          dot: "bg-green-500",
          badge: "bg-green-500/20 text-green-600",
        };
      case "1":
        return {
          label: "docking",
          dot: "bg-yellow-500",
          badge: "bg-yellow-500/20 text-yellow-600",
        };
      case "2":
        return {
          label: "damaged",
          dot: "bg-red-500",
          badge: "bg-red-500/20 text-red-600",
        };
      default:
        return {
          label: "unknown",
          dot: "bg-gray-400",
          badge: "bg-gray-400/20 text-gray-500",
        };
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search here..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4" />
          </Button>

          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Vessel
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div
          className={clsx(
            "px-3 gap-2",
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              : "flex flex-col",
          )}
        >
          {dtVessels.length === 0 && !loading && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No vessels found
            </div>
          )}

          {dtVessels.map((dv) =>
            view === "grid" ? (
              <Card key={dv.id_vessel} className="p-0">
                <div className="p-2">
                  <div className="flex justify-between items-center">
                    <label className="uppercase font-semibold">
                      {dv.vessel_name}
                    </label>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Ellipsis className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ShareIcon className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive">
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Image
                      height={80}
                      width={80}
                      src="https://cdn.pixabay.com/photo/2021/09/16/21/27/container-ship-6631117_1280.jpg"
                      className="object-cover rounded-lg"
                    />

                    <div className="flex flex-col text-sm">
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-muted-foreground">Callsign</span>
                        <span className="uppercase">{dv.callsign ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-muted-foreground">Cabang</span>
                        <span>{dv.cabang ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-muted-foreground">
                          ID Terminal
                        </span>
                        <span>{dv.id_terminal ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr]">
                        <span className="text-muted-foreground">IMO</span>
                        <span>{dv.imo ?? "-"}</span>
                      </div>

                      {(() => {
                        const statusConfig = getStatusConfig(dv.status);

                        return (
                          <div className="flex gap-2 items-center mt-1">
                            <span
                              className={clsx(
                                "w-2 h-2 rounded-full",
                                statusConfig.dot,
                              )}
                            />
                            <span
                              className={clsx(
                                "rounded-lg px-2 py-1 text-[10px] font-semibold",
                                statusConfig.badge,
                              )}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card key={dv.id_vessel} className="p-0">
                <div className="p-2">
                  {/* HEADER */}
                  {(() => {
                    const statusConfig = getStatusConfig(dv.status);

                    return (
                      <div className="flex justify-between items-center gap-2">
                        <label className="uppercase font-semibold text-xs truncate">
                          {dv.vessel_name}
                        </label>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* STATUS */}
                          <div className="flex items-center gap-1">
                            <span
                              className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                                statusConfig.dot,
                              )}
                            />
                            <span
                              className={clsx(
                                "rounded px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap",
                                statusConfig.badge,
                              )}
                            >
                              {statusConfig.label}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Ellipsis className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* BODY */}
                  <div className="flex gap-2">
                    {/* IMAGE */}
                    <Image
                      height={40}
                      width={40}
                      src="https://cdn.pixabay.com/photo/2021/09/16/21/27/container-ship-6631117_1280.jpg"
                      className="object-cover rounded-md shrink-0"
                    />

                    {/* DETAILS */}
                    <div className="flex-1 text-xs">
                      <div className="grid grid-cols-2 gap-x-6">
                        {/* LEFT COLUMN */}
                        <div className="space-y-1">
                          <div className="flex">
                            <span className="w-20 text-muted-foreground">
                              Callsign
                            </span>
                            <span className="font-medium">
                              {dv.callsign ?? "-"}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="w-20 text-muted-foreground">
                              Cabang
                            </span>
                            <span className="font-medium">
                              {dv.cabang ?? "-"}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-1">
                          <div className="flex">
                            <span className="w-20 text-muted-foreground">
                              ID Terminal
                            </span>
                            <span className="font-medium">
                              {dv.id_terminal ?? "-"}
                            </span>
                          </div>

                          <div className="flex">
                            <span className="w-20 text-muted-foreground">
                              IMO
                            </span>
                            <span className="font-medium">{dv.imo ?? "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              // <div
              //   key={dv.id_vessel}
              //   className="border rounded-md p-3 flex items-center justify-between hover:bg-muted"
              // >
              //   <div>
              //     <div className="font-semibold">{dv.vessel_name}</div>
              //   </div>
              //   <div className="text-sm text-muted-foreground">
              //     #{dv.id_vessel}
              //   </div>
              // </div>
            ),
          )}
        </div>
      </ScrollArea>

      {/* PAGINATION */}
      <div className="p-3 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default VesselsPage;
