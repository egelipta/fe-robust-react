import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function MatrixHeatmap() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const xCnt = 8;
    const yCnt = xCnt;

    const xData: { value: string }[] = [];
    const yData: { value: string }[] = [];

    for (let i = 0; i < xCnt; ++i) {
      xData.push({ value: "X" + (i + 1) });
    }

    for (let i = 0; i < yCnt; ++i) {
      yData.push({ value: "Y" + (i + 1) });
    }

    const data: (string | number)[][] = [];

    for (let i = 1; i <= xCnt; ++i) {
      for (let j = 1; j <= yCnt; ++j) {
        if (i >= j) {
          data.push(["X" + i, "Y" + j, i === j ? 1 : Math.random() * 2 - 1]);
        }
      }
    }

    const option: echarts.EChartsOption = {
      matrix: {
        x: {
          data: xData,
        },
        y: {
          data: yData,
        },
        top: 0,
      },
      visualMap: {
        type: "continuous",
        min: 0,
        max: 1,
        show: false,
        dimension: 2,
        calculable: true,
        orient: "horizontal",
        // top: 5,
        left: "center",
      },
      series: {
        type: "heatmap",
        coordinateSystem: "matrix",
        data,
        label: {
          show: true,
          formatter: (params: any) => Number(params.value[2]).toFixed(2),
        },
      },
    };

    chartInstance.current.setOption(option);

    // Responsive resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[500px]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
