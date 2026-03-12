import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { addDays, eachDayOfInterval, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type EngineId = "ME1" | "ME2" | "AE";
type MetricId =
  | "RPM"
  | "Fuel Consumption"
  | "Fuel Density"
  | "Fuel mass"
  | "Fuel temp";

type SeriesKey =
  | "speed"
  | "ME1_RPM"
  | "ME1_Fuel_Consumption"
  | "ME1_Fuel_Density"
  | "ME1_Fuel_mass"
  | "ME1_Fuel_temp"
  | "ME2_RPM"
  | "ME2_Fuel_Consumption"
  | "ME2_Fuel_Density"
  | "ME2_Fuel_mass"
  | "ME2_Fuel_temp"
  | "AE_RPM"
  | "AE_Fuel_Consumption"
  | "AE_Fuel_Density"
  | "AE_Fuel_mass"
  | "AE_Fuel_temp";

const METRICS: MetricId[] = [
  "RPM",
  "Fuel Consumption",
  "Fuel Density",
  "Fuel mass",
  "Fuel temp",
];

const ENGINE_IDS: EngineId[] = ["ME1", "ME2", "AE"];

const metricToKeyPart = (metric: MetricId) =>
  metric.replaceAll(" ", "_") as
    | "RPM"
    | "Fuel_Consumption"
    | "Fuel_Density"
    | "Fuel_mass"
    | "Fuel_temp";

const makeSeriesKey = (engine: EngineId, metric: MetricId): SeriesKey =>
  `${engine}_${metricToKeyPart(metric)}` as SeriesKey;

const buildSeriesName = (key: SeriesKey): string => {
  if (key === "speed") return "Speed";
  const [engine, ...metricParts] = key.split("_");
  const metric = metricParts.join(" ").replaceAll("  ", " ").trim();
  return `${engine} ${metric}`;
};

const seedFromKey = (key: string) =>
  key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

const makeSeriesData = (key: SeriesKey, length: number) => {
  const seed = (seedFromKey(key) % 7) + 1;
  return Array.from({ length }, (_v, idx) => {
    const wave = Math.sin((idx + 1) * 0.55 + seed) * (key === "speed" ? 22 : 12);
    const trend = idx * (key === "speed" ? 1.2 : 2.5);
    const base = key === "speed" ? 90 : 40 + seed * 10;
    return Math.max(0, Math.round(base + wave + trend));
  });
};

const buildDefaultSelection = (): Record<SeriesKey, boolean> => ({
  speed: true,
  ME1_RPM: false,
  ME1_Fuel_Consumption: false,
  ME1_Fuel_Density: false,
  ME1_Fuel_mass: false,
  ME1_Fuel_temp: false,
  ME2_RPM: false,
  ME2_Fuel_Consumption: false,
  ME2_Fuel_Density: false,
  ME2_Fuel_mass: false,
  ME2_Fuel_temp: false,
  AE_RPM: false,
  AE_Fuel_Consumption: false,
  AE_Fuel_Density: false,
  AE_Fuel_mass: false,
  AE_Fuel_temp: false,
});

export default function TrendTabs() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });
  const [selected, setSelected] = useState<Record<SeriesKey, boolean>>(
    buildDefaultSelection,
  );

  const allSeriesKeys = useMemo(
    () => Object.keys(buildDefaultSelection()) as SeriesKey[],
    [],
  );

  const allDataState = useMemo(() => {
    const selectedCount = allSeriesKeys.reduce(
      (acc, key) => acc + (selected[key] ? 1 : 0),
      0,
    );

    if (selectedCount === 0) return false;
    if (selectedCount === allSeriesKeys.length) return true;
    return "indeterminate" as const;
  }, [allSeriesKeys, selected]);

  const xAxisDates = useMemo(() => {
    const now = new Date();
    const from = date?.from ?? addDays(now, -6);
    const to = date?.to ?? date?.from ?? now;
    const start = from <= to ? from : to;
    const end = from <= to ? to : from;

    const days = eachDayOfInterval({ start, end });
    return days.length > 60 ? days.slice(days.length - 60) : days;
  }, [date]);

  const xAxisLabels = useMemo(
    () => xAxisDates.map((d) => format(d, "LLL dd")),
    [xAxisDates],
  );

  const selectedSeries = useMemo(() => {
    const keys = (Object.keys(selected) as SeriesKey[]).filter(
      (k) => selected[k],
    );

    return keys.map((key) => ({
      key,
      name: buildSeriesName(key),
      data: makeSeriesData(key, xAxisLabels.length),
    }));
  }, [selected, xAxisLabels.length]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const option: echarts.EChartsOption = {
      tooltip: { trigger: "axis" },
      legend: { data: selectedSeries.map((s) => s.name) },
      grid: { left: "3%", right: "4%", containLabel: true },
      xAxis: { type: "category", boundaryGap: false, data: xAxisLabels },
      yAxis: {
        type: "value",
        splitLine: { show: true, lineStyle: { type: "dashed", width: 1 } },
      },
      series: selectedSeries.map((s) => ({
        name: s.name,
        type: "line",
        data: s.data,
      })),
    };

    chartInstance.current.setOption(option, { notMerge: true });
  }, [selectedSeries, xAxisLabels]);

  const toggle = (key: SeriesKey, value: boolean) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAllData = (next: boolean) => {
    if (!next) {
      setSelected(buildDefaultSelection());
      return;
    }

    setSelected((prev) => {
      const updated = { ...prev };
      allSeriesKeys.forEach((key) => {
        updated[key] = true;
      });
      return updated;
    });
  };

  return (
    <div className="p-2 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="font-bold text-[20px]">Trend</div>
        <Field className="w-full max-w-[380px]">
          <FieldLabel htmlFor="trend-date-range">Date Range</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="trend-date-range"
                className="w-full justify-start gap-2 px-2.5 font-normal"
              >
                <CalendarIcon className="size-4" />
                <span className="truncate">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </Field>
      </div>

      <div className="w-full min-h-[340px] grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3">
        <div className="border rounded-lg p-3 space-y-4">
          <div className="text-sm font-semibold">Series</div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allDataState}
                onCheckedChange={(next) => toggleAllData(next === true)}
                id="trend-series-all-data"
              />
              <label htmlFor="trend-series-all-data" className="text-sm">
                All data
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selected.speed}
                onCheckedChange={(next) => toggle("speed", next === true)}
                id="trend-series-speed"
              />
              <label htmlFor="trend-series-speed" className="text-sm">
                Speed
              </label>
            </div>
          </div>

          <div className="space-y-3">
            {ENGINE_IDS.map((engine) => (
              <div key={engine} className="space-y-2">
                <div className="text-sm font-semibold">{engine}</div>
                <div className="space-y-2">
                  {METRICS.map((metric) => {
                    const key = makeSeriesKey(engine, metric);
                    const id = `trend-series-${key}`;
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <Checkbox
                          checked={selected[key]}
                          onCheckedChange={(next) => toggle(key, next === true)}
                          id={id}
                        />
                        <label htmlFor={id} className="text-sm">
                          {metric}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={chartRef} className="w-full h-full min-h-[340px]" />
      </div>
    </div>
  );
}

