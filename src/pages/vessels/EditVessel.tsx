import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAssetByIdApiAssetsDetailIdVesselGet } from "@/api/base/sdk.gen";
import { toast } from "sonner";

interface AssetDetail {
  id_vessel: number;
  vessel_name: string;
  call_sign?: string;
  cabang?: string;
  id_terminal?: string;
  imo?: string;
}

export default function EditVesselPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<AssetDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getAssetByIdApiAssetsDetailIdVesselGet({
          path: { id_vessel: Number(id) },
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
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Edit Vessel</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Card className="p-4">
        {loading ? (
          <div>Loading...</div>
        ) : asset ? (
          <div className="space-y-2">
            <div>
              <strong>Name: </strong>
              {asset.vessel_name}
            </div>
            <div>
              <strong>Callsign: </strong>
              {asset.call_sign ?? "-"}
            </div>
            <div>
              <strong>Cabang: </strong>
              {asset.cabang ?? "-"}
            </div>
            <div>
              <strong>ID Terminal: </strong>
              {asset.id_terminal ?? "-"}
            </div>
            <div>
              <strong>IMO: </strong>
              {asset.imo ?? "-"}
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              This page is a starting point for building the full edit form. If
              you want, I can wire the full editable form and save behavior
              (reusing AddVesselDialog logic).
            </div>
          </div>
        ) : (
          <div>No asset data</div>
        )}
      </Card>
    </div>
  );
}
