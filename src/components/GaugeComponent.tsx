import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function GaugeComponent() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Init chart
    chartInstance.current = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      series: [
        {
          type: "gauge",
          radius: "70%",
          center: ["50%", "50%"],
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, "#22c55e"],
                [0.7, "#c5c222"],
                [1, "#c53a22"],
              ],
            },
          },
          pointer: {
            length: "90%",
            width: 2,
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: { show: false },
          splitLine: {
            distance: -25,
            length: 3,
            lineStyle: {
              width: 1,
            },
          },
          axisLabel: {
            color: "inherit",
            distance: 5,
            fontSize: 10,
          },
          detail: {
            valueAnimation: true,
            formatter: "{value} km/h",
            color: "inherit",
            fontSize: 11,
            fontWeight: "bold",
            offsetCenter: [0, "65%"],
          },
          data: [
            {
              value: 44,
            },
          ],
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Interval update
    const interval = setInterval(() => {
      const randomValue = +(Math.random() * 100).toFixed(2);

      chartInstance.current?.setOption({
        series: [
          {
            data: [{ value: randomValue }],
          },
        ],
      });
    }, 2000);

    // Resize handling
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[150px]">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
