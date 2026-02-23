import GaugeComponent from "@/components/GaugeComponent";
import LineComponent from "@/components/LineComponent";
import MatrixHeatmap from "@/components/MatrixHeatmap";
import { Card } from "@/components/ui/card";

export default function OverviewTabs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-2 space-y-2">
        <div className="font-semibold text-sm">GAUGE CHART</div>
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
        <div className="font-semibold text-sm">LINE CHART</div>
        <LineComponent />
      </div>
      <div className="p-2 space-y-2">
        <div className="font-semibold text-sm">MATRIX</div>
        <MatrixHeatmap />
      </div>
      <div className="p-2 space-y-2">
        <div className="font-semibold text-sm">TABLE LOGS</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quae
          itaque nihil natus mollitia culpa hic, omnis quos? Ipsa itaque placeat
          dolorem culpa, perspiciatis voluptate. Error doloribus maiores quas
          velit!
        </div>
      </div>
    </div>
  );
}
