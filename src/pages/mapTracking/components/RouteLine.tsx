// RouteLog.tsx
import { getLogByIdApiLogsIdVesselGet } from "@/api/base/sdk.gen";

declare global {
  interface Window {
    L: any;
  }
}

export const RouteLine = async (
  map: any,
  vesselId: number,
  routeLayerRef: React.MutableRefObject<any | null>,
) => {
  try {
    const res = await getLogByIdApiLogsIdVesselGet({
      path: { id_vessel: vesselId },
    });

    const logs: any[] = ((res as any)?.data?.data?.data as any[]) ?? [];

    if (!map) return;

    // 🧹 Hapus route lama
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // ✅ Pastikan pane ada
    if (!map.getPane("routePane")) {
      map.createPane("routePane");
      map.getPane("routePane").style.zIndex = "400";
    }

    if (!map.getPane("logMarkerPane")) {
      map.createPane("logMarkerPane");
      map.getPane("logMarkerPane").style.zIndex = "500";
    }

    const layerGroup = window.L.layerGroup();
    const latLngs: [number, number][] = [];

    // 1️⃣ Kumpulkan titik
    logs.forEach((p) => {
      if (!p.lat || !p.long) return;
      latLngs.push([Number(p.lat), Number(p.long)]);
    });

    if (latLngs.length < 2) return;

    // 2️⃣ Polyline (di bawah)
    const routeLine = window.L.polyline(latLngs, {
      color: "#22c55e",
      weight: 2,
      dashArray: "8 8",
      pane: "routePane",
    });

    layerGroup.addLayer(routeLine);

    // 3️⃣ Marker log (di atas)
    logs.forEach((p) => {
      if (!p.lat || !p.long) return;

      const lat = Number(p.lat);
      const lng = Number(p.long);

      const logMarker = window.L.circleMarker([lat, lng], {
        radius: 5,
        color: "#16a34a",
        fillColor: "yellow",
        fillOpacity: 1,
        pane: "logMarkerPane",
      });

      const popupContent = `
        <div class="bg-[var(--navbar)] rounded-md p-4 text-[var(--text-primary)]">
            <table>
                <tbody>
                    <tr>
                    <td colspan="1" class="border border-[var(--border-color)] px-2 py-1 font-semibold">Time</td>
                    <td colspan="3" class="border border-[var(--border-color)] px-2 py-1">${p.timelog ?? "-"}</td>
                    </tr>

                    <tr>
                    <td colspan="1" class="border border-[var(--border-color)] px-2 py-1 font-semibold">Lat</td>
                    <td colspan="3" class="border border-[var(--border-color)] px-2 py-1">${p.lat ?? "-"}</td>
                    </tr>

                    <tr>
                    <td colspan="1" class="border border-[var(--border-color)] px-2 py-1 font-semibold">Long</td>
                    <td colspan="3" class="border border-[var(--border-color)] px-2 py-1">${p.long ?? "-"}</td>
                    </tr>

                    <tr>
                    <td colspan="1" class="border border-[var(--border-color)] px-2 py-1 font-semibold">Heading</td>
                    <td colspan="3" class="border border-[var(--border-color)] px-2 py-1">${p.heading ?? "-"}°</td>
                    </tr>

                    <tr>
                    <td colspan="1" class="border border-[var(--border-color)] px-2 py-1 font-semibold">Speed</td>
                    <td colspan="3" class="border border-[var(--border-color)] px-2 py-1">${p.speed ?? "-"}kn</td>
                    </tr>
                    <tr>
                    <td colspan=1 class="font-semibold">RPM</td>
                    <td colspan=3>${p.rmp ?? "-"}</td>
                    </tr>
                    <tr>
                    <td colspan=1 class="font-semibold">BATT</td>
                    <td colspan=3>${p.battery ?? "-"}</td>
                    </tr>
                    <tr>
                    <td></td>
                    <td class="font-semibold">ME1</td>
                    <td class="font-semibold">ME2</td>
                    <td class="font-semibold">AE</td>
                    </tr>
                    <tr>
                    <td class="font-semibold">CONS</td>
                    <td>${p.me1_cons ?? "-"}</td>
                    <td>${p.me2_cons ?? "-"}</td>
                    <td>${p.ae_cons ?? "-"}</td>
                    </tr>
                    <tr>
                    <td class="font-semibold">DENS</td>
                    <td>${p.me1_dens ?? "-"}</td>
                    <td>${p.me2_dens ?? "-"}</td>
                    <td>${p.ae_dens ?? "-"}</td>
                    </tr>
                    <tr>
                    <td class="font-semibold">MASS</td>
                    <td>${p.me1_mass ?? "-"}</td>
                    <td>${p.me2_mass ?? "-"}</td>
                    <td>${p.ae_mass ?? "-"}</td>
                    </tr>
                    <tr>
                    <td class="font-semibold>TEMP</td>
                    <td>${p.me1_vol ?? "-"}</td>
                    <td>${p.me2_vol ?? "-"}</td>
                    <td>${p.ae_vol ?? "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      `;

      logMarker.bindPopup(popupContent, {
        closeButton: false,
      });

      logMarker.on("mouseover", () => {
        logMarker.setStyle({ radius: 10 });
      });

      logMarker.on("mouseout", () => {
        logMarker.setStyle({ radius: 5 });
      });

      layerGroup.addLayer(logMarker);
    });

    // 4️⃣ Tambahkan ke map
    routeLayerRef.current = layerGroup.addTo(map);

    // 🎯 Auto zoom
    // map.fitBounds(routeLine.getBounds(), {
    //   padding: [50, 50],
    // });
  } catch (err) {
    console.error("Failed to fetch route:", err);
  }
};
