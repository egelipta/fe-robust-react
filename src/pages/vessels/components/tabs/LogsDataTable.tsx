import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LogStatus = "Normal" | "Warning" | "Critical";

type LogItem = {
  timestamp: string;
  sensor: string;
  value: string;
  unit: string;
  status: LogStatus;
};

const logsData: LogItem[] = [
  {
    timestamp: "2026-02-26 09:01",
    sensor: "Engine Temp",
    value: "72.1",
    unit: "C",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:03",
    sensor: "Oil Pressure",
    value: "42.4",
    unit: "psi",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:05",
    sensor: "Fuel Rate",
    value: "88.3",
    unit: "L/h",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:07",
    sensor: "Battery Volt",
    value: "23.9",
    unit: "V",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:09",
    sensor: "Coolant Temp",
    value: "95.6",
    unit: "C",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:11",
    sensor: "RPM",
    value: "1200",
    unit: "rpm",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:13",
    sensor: "Exhaust Temp",
    value: "342",
    unit: "C",
    status: "Critical",
  },
  {
    timestamp: "2026-02-26 09:15",
    sensor: "Engine Load",
    value: "78",
    unit: "%",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:17",
    sensor: "Generator Temp",
    value: "67.5",
    unit: "C",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:19",
    sensor: "Tank Level",
    value: "58",
    unit: "%",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:21",
    sensor: "Oil Temp",
    value: "108.2",
    unit: "C",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:23",
    sensor: "Vibration",
    value: "6.4",
    unit: "mm/s",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:25",
    sensor: "RPM",
    value: "1320",
    unit: "rpm",
    status: "Normal",
  },
  {
    timestamp: "2026-02-26 09:27",
    sensor: "Fuel Rate",
    value: "93.7",
    unit: "L/h",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:29",
    sensor: "Engine Temp",
    value: "81.8",
    unit: "C",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:31",
    sensor: "Battery Volt",
    value: "22.7",
    unit: "V",
    status: "Critical",
  },
  {
    timestamp: "2026-02-26 09:33",
    sensor: "Oil Pressure",
    value: "34.9",
    unit: "psi",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:35",
    sensor: "Coolant Temp",
    value: "101.3",
    unit: "C",
    status: "Critical",
  },
  {
    timestamp: "2026-02-26 09:37",
    sensor: "Engine Load",
    value: "84",
    unit: "%",
    status: "Warning",
  },
  {
    timestamp: "2026-02-26 09:39",
    sensor: "Tank Level",
    value: "49",
    unit: "%",
    status: "Normal",
  },
];

// const statusClass: Record<LogStatus, string> = {
//   Normal: "text-emerald-600",
//   Warning: "text-amber-600",
//   Critical: "text-red-600",
// };

export default function LogsDataTable() {
  const columns = useMemo<ColumnDef<LogItem>[]>(
    () => [
      { accessorKey: "timestamp", header: "Timestamp" },
      { accessorKey: "sensor", header: "Sensor" },
      { accessorKey: "value", header: "Value" },
      { accessorKey: "unit", header: "Unit" },
      // {
      //   accessorKey: "status",
      //   header: "Status",
      //   cell: ({ row }) => {
      //     const status = row.original.status;
      //     return <span className={`font-semibold ${statusClass[status]}`}>{status}</span>;
      //   },
      // },
    ],
    [],
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: logsData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No logs available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          Page {currentPage} of {pageCount}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[72px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i}
                variant={
                  i === table.getState().pagination.pageIndex
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="h-8 min-w-8 px-2"
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
