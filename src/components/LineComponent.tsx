import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { Checkbox } from "@/components/ui/checkbox";

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

const X_AXIS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

const makeData = (seed: number) =>
  X_AXIS.map((_label, idx) => {
    const wave = Math.sin((idx + 1) * 0.8 + seed) * 12;
    const trend = idx * 2.5;
    return Math.max(0, Math.round(40 + seed * 10 + wave + trend));
  });

const buildDefaultSelection = (): Record<SeriesKey, boolean> => {
  const base: Record<SeriesKey, boolean> = {
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
  };
  return base;
};

export default function LineComponent() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
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

  const selectedSeries = useMemo(() => {
    const keys = (Object.keys(selected) as SeriesKey[]).filter(
      (k) => selected[k],
    );
    return keys.map((key, index) => ({
      key,
      name: buildSeriesName(key),
      data:
        key === "speed"
          ? [120, 132, 101, 134, 90, 230, 210]
          : makeData(index + 1),
    }));
  }, [selected]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Init chart
    chartInstance.current = echarts.init(chartRef.current);

    // Resize responsive
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
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
      grid: {
        left: "3%",
        right: "4%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: X_AXIS,
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", width: 1 },
        },
      },
      series: selectedSeries.map((s) => ({
        name: s.name,
        type: "line",
        data: s.data,
      })),
    };

    chartInstance.current.setOption(option, { notMerge: true });
  }, [selectedSeries]);

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
    <div className="w-full  min-h-[300px] grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3">
      <div className="border rounded-lg p-3 space-y-4">
        <div className="text-sm font-semibold">Series</div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allDataState}
              onCheckedChange={(next) => toggleAllData(next === true)}
              id="series-all-data"
            />
            <label htmlFor="series-all-data" className="text-sm">
              All data
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selected.speed}
              onCheckedChange={(next) => toggle("speed", next === true)}
              id="series-speed"
            />
            <label htmlFor="series-speed" className="text-sm">
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
                  const id = `series-${key}`;
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

      <div ref={chartRef} className="w-full h-full min-h-[300px]" />
    </div>
  );
}
