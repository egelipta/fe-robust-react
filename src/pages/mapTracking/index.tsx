import { useEffect, useRef, useState } from "react";
import { getAllVesselsApiVesselAllGet } from "@/api/base/sdk.gen";
import VesselOverlay from "@/components/VesselOverlay";
import { RouteLine } from "./components/RouteLine";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterVessel from "./components/FilterStatus";
import FilterSearch from "./components/FilterSearch";

declare global {
  interface Window {
    windyInit: any;
    L: any;
  }
}

interface MarkerData {
  id: number;
  name: string;
  lat: number;
  long: number;
  status: "0" | "1" | "2" | "unknown";
  heading: number;
}

export default function MapTrackingPage() {
  const initialized = useRef(false);
  const windyRef = useRef<any | null>(null);
  const activeMarkerRef = useRef<any | null>(null);
  const routeLayerRef = useRef<any | null>(null);
  const reloadMarkersRef = useRef<
    ((opts?: { status?: MarkerData["status"] | "all" }) => Promise<void>) | null
  >(null);
  const markersRequestSeqRef = useRef(0);
  const invalidateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [selectedShip, setSelectedShip] = useState<MarkerData | null>(null);

  const [openPanel, setOpenPanel] = useState<"search" | "status" | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    MarkerData["status"] | "all"
  >("all");
  const statusFilterRef = useRef<MarkerData["status"] | "all">("all");

  useEffect(() => {
    statusFilterRef.current = statusFilter;
  }, [statusFilter]);

  // =========================
  // WINDY INIT
  // =========================
  useEffect(() => {
    if (!window.windyInit || initialized.current) return;

    const container = document.getElementById("windy");
    if (container) container.innerHTML = "";

    try {
      const prevMap = windyRef.current?.map;
      if (prevMap && typeof prevMap.remove === "function") prevMap.remove();
    } catch {}

    initialized.current = true;

    window.windyInit(
      {
        key: "gUOhUQB6gvqbGhlGh8rcxifcO04kgAw2",
        lat: -1.75,
        lon: 117.5,
        zoom: 5,
      },
      async (windyAPI: any) => {
        const { map } = windyAPI;
        windyRef.current = windyAPI;

        const createVesselIcon = (
          fillColor: string,
          heading: number,
          active = false,
        ) => {
          const ring = active
            ? `<circle cx="25" cy="25" r="22" fill="none"
                 stroke="#00eaff" stroke-width="3"
                 style="filter: drop-shadow(0 0 6px #00eaff)
                 drop-shadow(0 0 12px #00eaff);" />`
            : "";

          return window.L.divIcon({
            className: "",
            html: `
              <div style="transform: rotate(${heading}deg); transform-origin: center;">
                <svg width="30" height="30" viewBox="0 0 50 50">
                  ${ring}
                  <path d="M34 14.9277V42.0859L25 33.0859L16 42.0859V14.9277L25 6.37793L34 14.9277Z"
                    fill="${fillColor}"
                    stroke="#ECB536"
                    stroke-width="2"/>
                </svg>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });
        };
        const markersLayer = window.L.layerGroup().addTo(map);
        windyRef.current.markersLayer = markersLayer;

        const loadMarkers = async (opts?: {
          status?: MarkerData["status"] | "all";
        }) => {
          const effectiveStatus = opts?.status ?? "all";
          const requestSeq = ++markersRequestSeqRef.current;

          if (activeMarkerRef.current) {
            activeMarkerRef.current.setIcon(
              activeMarkerRef.current.__normalIcon,
            );
            activeMarkerRef.current = null;
          }
          if (routeLayerRef.current) {
            map?.removeLayer?.(routeLayerRef.current);
            routeLayerRef.current = null;
          }
          setSelectedShip(null);

          markersLayer.clearLayers();

          let items: any[] = [];
          try {
            const resp = await getAllVesselsApiVesselAllGet({
              query:
                effectiveStatus === "all"
                  ? {}
                  : effectiveStatus === "unknown"
                    ? { status: "" }
                    : { status: String(effectiveStatus) },
            });
            const r = (resp as any)?.data ?? resp;
            if (Array.isArray(r?.data)) items = r.data;
            else if (Array.isArray(r)) items = r;
            else if (Array.isArray(r?.items)) items = r.items;
          } catch (e) {
            console.error("Failed to fetch vessels:", e);
          }

          if (requestSeq !== markersRequestSeqRef.current) return;

          items.forEach((v: any, idx: number) => {
            const lat = v.lat ?? v.latitude ?? null;
            const lon = v.long ?? v.longitude ?? v.longt ?? null;
            if (lat == null || lon == null) return;

            const rawStatus = String(v.status ?? "").trim();
            const status: MarkerData["status"] =
              rawStatus === "0" || rawStatus === "1" || rawStatus === "2"
                ? rawStatus
                : "unknown";

            if (effectiveStatus !== "all" && status !== effectiveStatus) return;

            const fillColor =
              status === "0"
                ? "#022661"
                : status === "1"
                  ? "#eab308"
                  : status === "2"
                    ? "#dc2626"
                    : "#6b7280";

            const m: MarkerData = {
              id: v.id_vessel ?? v.id ?? idx,
              name: v.vessel_name ?? v.name ?? `Vessel ${idx}`,
              lat: Number(lat),
              long: Number(lon),
              status,
              heading: v.heading ?? 0,
            };

            const normalIcon = createVesselIcon(fillColor, m.heading, false);
            const activeIcon = createVesselIcon(fillColor, m.heading, true);

            const marker = window.L.marker([m.lat, m.long], {
              icon: normalIcon,
            }).addTo(markersLayer);
            marker.__normalIcon = normalIcon;
            marker.__activeIcon = activeIcon;

            marker.on("click", () => {
              if (activeMarkerRef.current) {
                activeMarkerRef.current.setIcon(
                  activeMarkerRef.current.__normalIcon,
                );
              }

              marker.setIcon(activeIcon);
              activeMarkerRef.current = marker;

              map.flyTo([m.lat, m.long], 7, { animate: true, duration: 0.8 });

              RouteLine(map, m.id, routeLayerRef);

              setSelectedShip(m);
            });
          });
        };

        reloadMarkersRef.current = loadMarkers;
        await loadMarkers({ status: statusFilterRef.current });
        map.invalidateSize(true);
        if (invalidateTimeoutRef.current)
          clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = setTimeout(
          () => map.invalidateSize(true),
          200,
        );
      },
    );

    return () => {
      initialized.current = false;
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = null;
      }
      try {
        const map = windyRef.current?.map;
        windyRef.current?.markersLayer?.clearLayers?.();
        if (routeLayerRef.current) {
          try {
            map?.removeLayer?.(routeLayerRef.current);
          } catch {}
          routeLayerRef.current = null;
        }
        windyRef.current?.map?.remove?.();
      } catch {}
      windyRef.current = null;

      try {
        const container = document.getElementById("windy");
        if (container) container.innerHTML = "";
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    reloadMarkersRef.current?.({ status: statusFilter });
  }, [statusFilter]);

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* LEFT CONTROL */}
      <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-2">
        {/* SEARCH */}
        <FilterSearch
          statusFilter={statusFilter}
          open={openPanel === "search"}
          onOpenChange={(open) => setOpenPanel(open ? "search" : null)}
          onSelect={(item) => {
            const map = windyRef.current?.map;
            const markersLayer = windyRef.current?.markersLayer;
            if (!map || !markersLayer) return;

            let clickedMarker: any = null;
            markersLayer.eachLayer((layer: any) => {
              if (layer.getLatLng) {
                const { lat, lng } = layer.getLatLng();
                if (lat === item.lat && lng === item.long)
                  clickedMarker = layer;
              }
            });

            if (clickedMarker) {
              if (activeMarkerRef.current) {
                activeMarkerRef.current.setIcon(
                  activeMarkerRef.current.__normalIcon,
                );
              }

              clickedMarker.setIcon(
                clickedMarker.__activeIcon ?? clickedMarker.__normalIcon,
              );
              activeMarkerRef.current = clickedMarker;

              map.flyTo([item.lat, item.long], 7, {
                animate: true,
                duration: 0.8,
              });
              RouteLine(map, item.id, routeLayerRef);
              setSelectedShip(item as any);
            }
          }}
        />

        {/* SETTINGS */}
        <FilterVessel
          value={statusFilter}
          onChange={setStatusFilter}
          open={openPanel === "status"}
          onOpenChange={(open) => setOpenPanel(open ? "status" : null)}
        />

        {/* BOOKMARK */}
        <Button className="w-10 h-10 rounded-full bg-[var(--navbar)] text-[var(--text-primary)] shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200">
          <Bookmark size={20} />
        </Button>
      </div>

      {/* MAP */}
      <div id="windy" className="flex-1 relative" />

      {/* OVERLAY */}
      {selectedShip && (
        <VesselOverlay
          vesselId={selectedShip.id}
          onClose={() => {
            if (activeMarkerRef.current) {
              activeMarkerRef.current.setIcon(
                activeMarkerRef.current.__normalIcon,
              );
              activeMarkerRef.current = null;
            }
            if (routeLayerRef.current) {
              windyRef.current?.map?.removeLayer(routeLayerRef.current);
              routeLayerRef.current = null;
            }
            setSelectedShip(null);
          }}
        />
      )}
    </div>
  );
}
