import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getVesselApiVesselVesselIdGet } from "@/api/base/sdk.gen";
import { Image } from "antd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  vesselId: number;
  onClose: () => void;
};

export default function VesselOverlay({ vesselId, onClose }: Props) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const resp = await getVesselApiVesselVesselIdGet({
          path: { vessel_id: Number(vesselId) },
        });
        // - the raw vessel object itself
        let payload: any = resp as any;
        if (payload?.data !== undefined) payload = payload.data;
        // unwrap nested data.data
        if (payload?.data !== undefined) payload = payload.data;
        // final payload should be the vessel object
        if (!mounted) return;
        setData(payload ?? null);
      } catch (e: any) {
        console.error("Failed to load vessel detail", e);
        if (!mounted) return;
        setError((e && e.message) || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [vesselId]);

  // Only use API-fetched data (no fallback). While loading, `data` will be null.
  const dVessel = data ?? {};

  const rawStatus = dVessel.status ?? null;
  const statusLabel =
    rawStatus === "0"
      ? "operational"
      : rawStatus === "1"
        ? "docking"
        : rawStatus === "2"
          ? "damaged"
          : "unknown";
  const statusClass =
    rawStatus === "0"
      ? "text-green-600"
      : rawStatus === "1"
        ? "text-yellow-600"
        : rawStatus === "2"
          ? "text-red-600"
          : "text-gray-600";

  return (
    <div className="bg-[var(--navbar)] p-3 shadow-md relative h-62">
      <Button
        size="sm"
        onClick={onClose}
        className="absolute top-2 right-2 cursor-pointer"
        variant="outline"
      >
        <X size={16} />
      </Button>

      {loading ? (
        <div className="h-full flex justify-center items-center">
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="h-full flex justify-center items-center">
          <span className="text-red-500">Error: {error}</span>
        </div>
      ) : (
        <div className="h-full">
          <div className="h-full flex flex-col space-y-4">
            <div>
              <span className="font-semibold uppercase">
                {dVessel.vessel_name}
              </span>
            </div>

            {/* Scroll only on mobile */}
            <ScrollArea className="h-[170px] md:h-auto md:overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_600px] gap-3">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-3">
                  <div className="w-full md:w-[250px] flex justify-center">
                    <Image
                      src={dVessel.img}
                      alt="Vessel"
                      //   width={250}
                      height={170}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">IMO</label>
                      <span>{dVessel.imo ?? "-"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">CALLSIGN</label>
                      <span>{dVessel.callsign ?? "-"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">LOA/LBP</label>
                      <span>
                        {dVessel.loa ?? "-"} / {dVessel.lbp ?? "-"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">DEPTH</label>
                      <span>{dVessel.depth ?? "-"} m</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">BREADTH</label>
                      <span>{dVessel.breadth ?? "-"} m</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">DRAFT</label>
                      <span>{dVessel.draft ?? "-"} m</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">GT</label>
                      <span>{dVessel.gt ?? "-"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">BUILT</label>
                      <span>{dVessel.built_year ?? "-"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">
                        MAIN ENGINE
                      </label>
                      <span>
                        {dVessel.engine_merek ?? "-"},
                        {dVessel.engine_type ?? " -"},
                        {dVessel.engine_hp ?? " -"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">
                        AUX ENGINE
                      </label>
                      <span>
                        {dVessel.aux_engine_merek ?? "-"},
                        {dVessel.aux_engine_type ?? " -"},
                        {dVessel.aux_engine_hp ?? " -"}
                      </span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">
                        PASSENGERS
                      </label>
                      <span>{dVessel.passenger ?? "0"} PERSONS</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr]">
                      <label className="text-muted-foreground">VEHICLE</label>
                      <span>{dVessel.car ?? "0"} CARS / TRUCKS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
                    <div>
                      <label className="font-semibold">AVERAGE</label>
                      <div>
                        <div className="grid grid-cols-[150px_1fr]">
                          <label className="text-muted-foreground">
                            SPEED (k/n)
                          </label>
                          <span>{dVessel.speed ?? "0"}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr]">
                          <label className="text-muted-foreground">
                            RPM (r/m)
                          </label>
                          <span>{dVessel.rpm ?? "0"}</span>
                        </div>
                      </div>
                    </div>
                    <Input placeholder="Search here..." className="mt-2" />
                  </div>
                  <div>
                    <div className="grid grid-cols-4 gap-3 font-semibold">
                      <div>ENGINE</div>
                      <div>ME1</div>
                      <div>ME2</div>
                      <div>AE</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>CONS</div>
                      <div>1</div>
                      <div>1</div>
                      <div>1</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>DENS</div>
                      <div>2</div>
                      <div>2</div>
                      <div>2</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>MASS</div>
                      <div>3</div>
                      <div>3</div>
                      <div>3</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>TEMP</div>
                      <div>4</div>
                      <div>4</div>
                      <div>4</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
