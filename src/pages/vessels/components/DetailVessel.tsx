import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { getVesselApiVesselVesselIdGet } from "@/api/base/sdk.gen";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "antd";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTabs from "./tabs/Overview";
import VesselPersonelSection from "./VesselPersonelSection";

interface AssetDetail {
  vessel_id: number;
  vessel_name: string;
  imo?: string;
  mmsi?: string;
  callsign?: string;
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

  no_sertifikat?: string;
  tgl_terbit?: string;
  tgl_expired?: string;
  statussmc?: string;
  tahapan_verifikasi?: string;
}

export default function DetailVesselPage() {
  const { id } = useParams<{ id: string }>();
  const vesselId = Number(id);
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<AssetDetail | null>(null);

  const fetchAsset = async (vesselId: number) => {
    try {
      setLoading(true);
      const res = await getVesselApiVesselVesselIdGet({
        path: { vessel_id: vesselId },
      });
      const api = res as { data?: { data?: AssetDetail } };
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

  useEffect(() => {
    if (!id || !Number.isFinite(vesselId)) return;
    fetchAsset(vesselId);
  }, [id, vesselId]);

  return (
    <div className="h-full">
      <ScrollArea className="h-full p-3">
        {asset ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Card className="p-2">
                <div className="space-y-3">
                  <div className="font-bold text-[20px] uppercase">
                    {asset.vessel_name}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-4">
                    <div className="w-full">
                      <Image
                        src={asset.img}
                        className="rounded-lg w-full h-[200px] object-cover"
                      />
                    </div>

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
                        <span>{asset.callsign ?? "-"}</span>
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
                  <div className="border-t">
                    <div className="font-bold mb-3 mt-3">
                      Safety Management Sertificate (SMC)
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
                      <div className="grid grid-cols-[160px_1fr] text-sm">
                        <span>No Sertifikat</span>
                        <span>{asset.no_sertifikat ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[160px_1fr] text-sm">
                        <span>Tgl Terbit</span>
                        <span>{asset.tgl_terbit ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[160px_1fr] text-sm">
                        <span>Tgl Expired</span>
                        <span>{asset.tgl_expired ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[160px_1fr] text-sm">
                        <span>Status SMC</span>
                        <span>{asset.statussmc ?? "-"}</span>
                      </div>
                      <div className="grid grid-cols-[160px_1fr] text-sm">
                        <span>Tahapan Verifikasi</span>
                        <span>{asset.tahapan_verifikasi ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <VesselPersonelSection
                vesselId={vesselId}
                asset={asset}
                onUpdated={() => fetchAsset(vesselId)}
              />
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
            {loading
              ? "Memuat data vessel..."
              : "Data vessel tidak ditemukan atau gagal dimuat."}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
