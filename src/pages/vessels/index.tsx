import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  Split,
  Ship,
  ChartNoAxesColumn,
} from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 55;

function VesselsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const dataVessel = useMemo(
    () =>
      Array.from({ length: 177 }).map((_, i) => ({
        id: i + 1,
        name: `KMP. VESSEL ${i + 1}`,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis odio dignissimos",
      })),
    [],
  );

  const totalPage = Math.ceil(dataVessel.length / PAGE_SIZE);

  const pagedData = dataVessel.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 🔥 pagination window (3 page)
  const pageWindow = useMemo(() => {
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPage, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPage]);

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2 p-3">
        <Input placeholder="Search here..." className="max-w-sm" />

        <div className="flex items-center gap-2">
          {/* TOGGLE */}
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
            <Plus /> Add Vessel
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div
          className={clsx(
            "px-3 gap-2",
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
              : "flex flex-col",
          )}
        >
          {pagedData.map((dv) =>
            view === "grid" ? (
              <Card key={dv.id} className="p-0">
                <div className="p-3 flex gap-3">
                  <img
                    src="https://cdn.pixabay.com/photo/2021/09/16/21/27/container-ship-6631117_1280.jpg"
                    alt=""
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* Content kanan */}
                  <div className="flex flex-col flex-1 justify-between">
                    {/* Header */}
                    <div className="flex items-start w-full">
                      <div className="font-semibold text-xs truncate">
                        {dv.name}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto shrink-0"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>

                    {/* Sub Info */}
                    <div className="grid grid-cols-[90px_1fr] gap-y-0 text-xs text-muted-foreground mt-2">
                      <span className="font-medium text-foreground">
                        Cabang
                      </span>
                      <span>PADANG</span>

                      <span className="font-medium text-foreground">
                        ID Terminal
                      </span>
                      <span>PADANG</span>

                      <span className="font-medium text-foreground">IMO</span>
                      <span>892569823</span>

                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span className="text-green-500 bg-green-500/30 px-2 rounded-full">
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div
                key={dv.id}
                className="border rounded-md p-3 flex items-center justify-between hover:bg-muted"
              >
                <div>
                  <div className="font-semibold">{dv.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {dv.description}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">#{dv.id}</div>
              </div>
            ),
          )}
        </div>
      </ScrollArea>

      {/* PAGINATION */}
      <div className="p-3 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft />
        </Button>

        {pageWindow.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPage}
          onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default VesselsPage;
