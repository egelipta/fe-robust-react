import GaugeComponent from "@/components/GaugeComponent";
import LineComponent from "@/components/LineComponent";
import MatrixHeatmap from "@/components/MatrixHeatmap";
import { Card } from "@/components/ui/card";
import LogsDataTable from "./LogsDataTable";

export default function OverviewTabs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-2 space-y-2">
        <div className="font-bold text-[20px]">Gauge Chart</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 1</div>
            <GaugeComponent />
          </Card>
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 2</div>
            <GaugeComponent />
          </Card>
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 3</div>
            <GaugeComponent />
          </Card>
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 4</div>
            <GaugeComponent />
          </Card>
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 5</div>
            <GaugeComponent />
          </Card>
          <Card className="p-2 border border-dashed">
            <div className="text-xs font-semibold">GAUGE 6</div>
            <GaugeComponent />
          </Card>
        </div>
      </div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-[20px]">Telematic Data Graph</div>
        <LineComponent />
      </div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-[20px]">
          Operation / Engine Hour Graph
        </div>
        <MatrixHeatmap />
      </div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-[20px]">Table Logs</div>
        <LogsDataTable />
      </div>
    </div>
  );
}
