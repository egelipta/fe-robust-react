import { useEffect, useRef, useState } from "react";
import { getAllVesselsApiVesselAllGet } from "@/api/base/sdk.gen";
import VesselOverlay from "@/components/VesselOverlay";

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
  const activeMarkerRef = useRef<any | null>(null); // 🔵 marker aktif
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  // const rafRef = useRef<number | null>(null);
  // const resizeIdleTimeoutRef = useRef<number | null>(null);
  const [selectedShip, setSelectedShip] = useState<MarkerData | null>(null);

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
      (windyAPI: any) => {
        const { map } = windyAPI;
        windyRef.current = windyAPI;
        console.log("✅ Windy loaded");

        // 🔵 Helper buat icon (normal & aktif)
        const createVesselIcon = (
          fillColor: string,
          heading: number,
          active = false,
        ) => {
          const ring = active
            ? `<circle
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke="#00eaff"
                stroke-width="3"
                style="filter: drop-shadow(0 0 6px #00eaff) drop-shadow(0 0 12px #00eaff);"
              />
              `
            : "";

          return window.L.divIcon({
            className: "",
            html: `
              <div style="transform: rotate(${heading}deg); transform-origin: center;">
                <svg width="30" height="30" viewBox="0 0 50 50"
                  xmlns="http://www.w3.org/2000/svg">
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

        (async () => {
          let items: any[] = [];
          try {
            const resp = await getAllVesselsApiVesselAllGet({});
            const r = (resp as any)?.data ?? (resp as any);
            if (Array.isArray(r?.data)) items = r.data;
            else if (Array.isArray(r)) items = r;
            else if (Array.isArray(r?.items)) items = r.items;
          } catch (e) {
            console.error("Failed to fetch vessels:", e);
          }

          let markersLayer: any = null;
          try {
            markersLayer = window.L.layerGroup().addTo(map);
          } catch {
            markersLayer = null;
          }

          items.forEach((v: any, idx: number) => {
            const lat = v.lat ?? v.latitude ?? null;
            const lon = v.long ?? v.longitude ?? v.longt ?? null;
            if (lat == null || lon == null) return;

            let rawStatus: any = v.status;
            if (rawStatus === "" || rawStatus == null) rawStatus = "unknown";
            else rawStatus = String(rawStatus);

            const m: MarkerData = {
              id: v.id_vessel ?? v.id ?? idx,
              name: v.vessel_name ?? v.name ?? `Vessel ${idx}`,
              lat: Number(lat),
              long: Number(lon),
              status:
                rawStatus === "0" || rawStatus === "1" || rawStatus === "2"
                  ? rawStatus
                  : "unknown",
              heading: v.heading ?? 0,
            };

            let fillColor = "#022661";
            if (m.status === "1") fillColor = "#fabd07";
            else if (m.status === "2") fillColor = "#ab1a03";
            else if (m.status === "unknown") fillColor = "#6b7280";

            const normalIcon = createVesselIcon(fillColor, m.heading, false);
            const activeIcon = createVesselIcon(fillColor, m.heading, true);

            const marker = window.L.marker([m.lat, m.long], {
              icon: normalIcon,
            });

            if (markersLayer && typeof markersLayer.addLayer === "function") {
              markersLayer.addLayer(marker);
            } else {
              marker.addTo(map);
            }

            marker.on("click", () => {
              // 🔁 reset marker sebelumnya
              if (activeMarkerRef.current) {
                activeMarkerRef.current.setIcon(
                  activeMarkerRef.current.__normalIcon,
                );
              }

              // 🔵 set marker ini aktif
              marker.setIcon(activeIcon);
              activeMarkerRef.current = marker;
              marker.__normalIcon = normalIcon;

              // 🎯 Fokus ke vessel (smooth animation)
              if (map && typeof map.flyTo === "function") {
                map.flyTo([m.lat, m.long], 7, {
                  animate: true,
                  duration: 0.8, // detik
                });
              }

              setSelectedShip(m);
            });
          });

          windyRef.current.markersLayer = markersLayer;
        })();

        map.invalidateSize(true);
        setTimeout(() => map.invalidateSize(true), 200);
      },
    );

    return () => {
      initialized.current = false;

      try {
        const markersLayer = windyRef.current?.markersLayer;
        if (markersLayer?.clearLayers) markersLayer.clearLayers();

        const m = windyRef.current?.map;
        if (m?.remove) m.remove();
      } catch {}

      windyRef.current = null;

      const container = document.getElementById("windy");
      if (container) container.innerHTML = "";

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col">
      <div id="windy" className="flex-1 relative" />

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
            setSelectedShip(null);
          }}
        />
      )}
    </div>
  );
}
