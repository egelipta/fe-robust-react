import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getVesselApiVesselVesselIdGet } from "@/api/base/sdk.gen";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "antd";
import { Edit, Pencil } from "lucide-react";
import {
  // Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTabs from "./tabs/Overview";

interface AssetDetail {
  // built_year

  // gt
  vessel_id: number;
  vessel_name: string;
  imo?: string;
  mmsi?: string;
  call_sign?: string;
  type?: string;
  class_?: string;
  country_id: string;
  id_company?: string;
  cabang?: string;
  id_terminal?: string;
  built_year: string;
  gt?: string;
  img?: string;

  nahkoda?: string;
  sid_nahkoda?: string;
  no_telp_nahkoda?: string;
  mualim1?: string;
  sid_mualim1?: string;
  no_telp_mualim1?: string;
  mualim2?: string;
  sid_mualim2?: string;
  no_telp_mualim2?: string;
  kkm?: string;
  sid_kkm?: string;
  no_telp_kkm?: string;
  masinis2?: string;
  sid_masinis2?: string;
  no_telp_masinis2?: string;
  masinis3?: string;
  sid_masinis3?: string;
  no_telp_masinis3?: string;
}

export default function DetailVesselPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<AssetDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getVesselApiVesselVesselIdGet({
          path: { vessel_id: Number(id) },
        });
        const api = res as any;
        if (!api?.data?.data) {
          toast.error("Asset tidak ditemukan");
          return;
        }
        setAsset(api.data.data);
      } catch (err) {
        console.error("Failed to fetch asset:", err);
        toast.error("Gagal mengambil data asset");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return (
    <div className="h-full">
      <ScrollArea className="h-full p-3">
        {asset ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* BASIC INFO */}
              <Card className="p-2">
                <div className="space-y-3">
                  <div className="font-bold text-lg uppercase">
                    {asset.vessel_name}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-4">
                    {/* IMAGE */}
                    <div className="w-full">
                      <Image
                        src={asset.img}
                        className="rounded-lg w-full h-[200px] object-cover"
                      />
                    </div>

                    {/* INFO LEFT */}
                    <div className="space-y-0">
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>IMO</span>
                        <span>{asset.imo || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>MMSI</span>
                        <span>{asset.mmsi ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Callsign</span>
                        <span>{asset.call_sign ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Type</span>
                        <span>{asset.type ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Class</span>
                        <span>{asset.class_ || "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Terminal</span>
                        <span>{asset.id_terminal ?? "-"}</span>
                      </div>
                    </div>

                    {/* INFO RIGHT */}
                    <div className="space-y-0">
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Country</span>
                        <span>{asset.country_id ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Company</span>
                        <span>{asset.id_company ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Cabang</span>
                        <span>{asset.cabang ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>Built Year</span>
                        <span>{asset.built_year ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] text-sm">
                        <span>GT</span>
                        <span>{asset.gt ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CREW */}
              <Card className="p-2">
                <div className="space-y-3">
                  <div className="font-bold text-lg">Personil Kapal</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div className="flex justify-between">
                        <div>NAHKODA</div>
                        <Button size={"sm"} variant={"ghost"}>
                          <Pencil />
                        </Button>
                      </div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.nahkoda || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_nahkoda || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_nahkoda ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div>MUALIM I</div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.mualim1 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_mualim1 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_mualim1 ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div>MUALIM II</div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.mualim2 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_mualim2 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_mualim2 ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div>KKM</div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.kkm || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_kkm || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_kkm ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div>MASINIS II</div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.masinis2 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_masinis2 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_masinis2 ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 border border-dashed space-y-2 rounded-lg">
                      <div>MASINIS III</div>
                      <div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Name</div>
                          <div>{asset.masinis3 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>SID</div>
                          <div>{asset.sid_masinis3 || "-"}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <div>Telp</div>
                          <div>{asset.no_telp_masinis3 ?? "-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card className="p-2">
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Logs</TabsTrigger>
                    <TabsTrigger value="reports">Trend</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <OverviewTabs />
                  </TabsContent>
                  <TabsContent value="analytics">
                    <Card>
                      <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                        <CardDescription>
                          Track performance and user engagement metrics. Monitor
                          trends and identify growth opportunities.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-muted-foreground text-sm">
                        Page views are up 25% compared to last month.
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reports">
                    <Card>
                      <CardHeader>
                        <CardTitle>Reports</CardTitle>
                        <CardDescription>
                          Generate and download your detailed reports. Export
                          data in multiple formats for analysis.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-muted-foreground text-sm">
                        You have 5 reports ready and available to export.
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        ) : (
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
            aliquid nulla pariatur vero quis est, impedit cumque maiores. Omnis,
            hic perferendis! Culpa, minima quo dolore sit voluptates dolorem ad
            consequatur.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
