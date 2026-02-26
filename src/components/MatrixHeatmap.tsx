import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";

const HOURS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`,
);

type BinaryValue = 0 | 1;
type HeatmapPoint = [number, number, BinaryValue];

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

const buildDateLabels = (days: number) => {
  const labels: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(formatDayLabel(date));
  }

  return labels;
};

const buildMatrixData = (yLabels: string[]) => {
  const data: HeatmapPoint[] = [];

  for (let yIndex = 0; yIndex < yLabels.length; yIndex += 1) {
    for (let xIndex = 0; xIndex < HOURS.length; xIndex += 1) {
      data.push([xIndex, yIndex, Math.random() > 0.5 ? 1 : 0]);
    }
  }

  return data;
};

const getIsDark = () => document.documentElement.classList.contains("dark");

const getHeatmapPoint = (params: unknown): HeatmapPoint | null => {
  const singleParam =
    Array.isArray(params) && params.length > 0 ? params[0] : params;

  if (
    singleParam &&
    typeof singleParam === "object" &&
    "value" in singleParam &&
    Array.isArray(singleParam.value) &&
    singleParam.value.length >= 3
  ) {
    const [xIndex, yIndex, value] = singleParam.value as [
      number,
      number,
      BinaryValue,
    ];
    return [xIndex, yIndex, value];
  }

  return null;
};

export default function MatrixHeatmap() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isDark, setIsDark] = useState<boolean>(getIsDark);

  const yData = useMemo(() => buildDateLabels(7), []);
  const matrixData = useMemo(() => buildMatrixData(yData), [yData]);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(getIsDark());
    };

    const classObserver = new MutationObserver(handleThemeChange);
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      classObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const matrixColors = {
      axisLabel: isDark ? "#cbd5e1" : "#475569",
      splitLine: isDark ? "#374151" : "#e5e7eb",
    };

    const option: echarts.EChartsOption = {
      tooltip: {
        position: "top",
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        textStyle: {
          color: isDark ? "#f3f4f6" : "#111827",
        },
        formatter: (params) => {
          const point = getHeatmapPoint(params);
          if (!point) return "";
          const [xIndex, yIndex, value] = point;
          return `${yData[yIndex]}<br/>${HOURS[xIndex]}: <b>${value}</b>`;
        },
      },
      grid: {
        top: "5%",
        left: "0%",
        right: "0%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: HOURS,
        position: "bottom",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: matrixColors.axisLabel,
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: matrixColors.splitLine,
            width: 1,
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: isDark ? ["#020617", "#020617"] : ["#ffffff", "#ffffff"],
          },
        },
      },
      yAxis: {
        type: "category",
        data: yData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: matrixColors.axisLabel,
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: matrixColors.splitLine,
            width: 1,
          },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: isDark ? ["#020617", "#020617"] : ["#ffffff", "#ffffff"],
          },
        },
      },
      visualMap: {
        min: 0,
        max: 1,
        show: false,
        inRange: {
          color: [isDark ? "#1e293b" : "#f1f5f9", "#22c55e"],
        },
      },
      series: [
        {
          name: "Matrix",
          type: "heatmap",
          data: matrixData,
          itemStyle: {
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#e5e7eb",
          },
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              borderWidth: 1,
              borderColor: isDark ? "#e5e7eb" : "#374151",
              shadowBlur: 6,
              shadowColor: "rgba(0,0,0,0.25)",
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option, true);
    chartInstance.current.resize();
  }, [isDark, matrixData, yData]);

  console.log(matrixData);
  console.log(yData);

  return (
    <div className="w-full h-[300px]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
