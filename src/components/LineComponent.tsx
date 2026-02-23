import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function LineComponent() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Init chart
    chartInstance.current = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Speed", "Fuel", "RPM"],
      },
      grid: {
        left: "3%",
        right: "4%",
        // bottom: "3%",
        containLabel: true,
      },
      //   toolbox: {
      //     feature: {
      //       saveAsImage: {},
      //     },
      //   },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            // color: colors.value.splitLine,
            width: 1,
          },
        },
      },
      series: [
        {
          name: "Speed",
          type: "line",
          stack: "Total",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Fuel",
          type: "line",
          stack: "Total",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "RPM",
          type: "line",
          stack: "Total",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
      ],
    };

    chartInstance.current.setOption(option);

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

  return (
    <div className="w-full h-full min-h-[300px]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
