import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

declare global {
  interface Window {
    windyInit: any;
    L: any; // Leaflet global
  }
}

interface MarkerData {
  id: number;
  name: string;
  lat: number;
  long: number;
  status: "operational" | "docking" | "damaged";
  heading: number;
}

export default function MapTrackingPage() {
  const initialized = useRef(false);
  const [selectedShip, setSelectedShip] = useState<MarkerData | null>(null);

  useEffect(() => {
    if (!window.windyInit) return;

    const container = document.getElementById("windy");
    if (container) container.innerHTML = ""; // bersihkan container sebelum init

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
        console.log("✅ Windy loaded");

        const markersData: MarkerData[] = [
          {
            id: 1,
            name: "Marker 1",
            lat: 4.205075284,
            long: 96.040041932,
            status: "operational",
            heading: 45,
          },
          {
            id: 2,
            name: "Marker 2",
            lat: -4.2357333,
            long: 102.24415,
            status: "docking",
            heading: 90,
          },
          {
            id: 3,
            name: "Marker 3",
            lat: 0.8147166,
            long: 106.62345,
            status: "damaged",
            heading: 261,
          },
          {
            id: 4,
            name: "Marker 4",
            lat: -1.76,
            long: 117.55,
            status: "operational",
            heading: 0,
          },
          {
            id: 5,
            name: "Marker 5",
            lat: -5.8545440847222,
            long: 112.64722726944,
            status: "operational",
            heading: 287,
          },
          {
            id: 6,
            name: "Marker 6",
            lat: -1.9872166,
            long: 125.95065,
            status: "operational",
            heading: 26,
          },
          {
            id: 7,
            name: "Marker 7",
            lat: -6.0477999,
            long: 138.24555,
            status: "operational",
            heading: 8,
          },
        ];

        markersData.forEach((m) => {
          let fillColor = "#022661"; // default operational
          if (m.status === "docking") fillColor = "#fabd07";
          else if (m.status === "damaged") fillColor = "#ab1a03";

          const svgIcon = `
            <svg width="25" height="25" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 14.9277V42.0859L25 33.0859L16 42.0859V14.9277L25 6.37793L34 14.9277Z" fill="${fillColor}" stroke="#ECB536" stroke-width="2"/>
            </svg>
          `;

          const customIcon = window.L.divIcon({
            className: "",
            html: `<div style="transform: rotate(${m.heading}deg); transform-origin: center;">${svgIcon}</div>`,
          });

          const marker = window.L.marker([m.lat, m.long], {
            icon: customIcon,
          }).addTo(map);

          marker.on("click", () => {
            setSelectedShip(m);
          });
        });
      },
    );

    return () => {
      initialized.current = false;
      const container = document.getElementById("windy");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Peta */}
      <div id="windy" className="flex-1 relative" />

      {/* Overlay info kapal */}
      {selectedShip && (
        <div className="bg-[var(--navbar)] p-4 shadow-md relative h-52">
          {/* Tombol Close kanan atas */}
          <button
            onClick={() => setSelectedShip(null)}
            className="absolute top-2 right-2 p-1 cursor-pointer"
          >
            <X size={18} />
          </button>

          <h3 className="font-bold text-lg">{selectedShip.name}</h3>
          <p>
            Status:{" "}
            <span
              className={`font-semibold ${
                selectedShip.status === "operational"
                  ? "text-green-600"
                  : selectedShip.status === "docking"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {selectedShip.status}
            </span>
          </p>
          <p>Heading: {selectedShip.heading}°</p>
          <p>
            Lat: {selectedShip.lat}, Lon: {selectedShip.long}
          </p>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useRef } from "react";

// declare global {
//   interface Window {
//     windyInit: any;
//   }
// }

// export default function MapTrackingPage() {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (!window.windyInit || initialized.current) return;

//     initialized.current = true;

//     window.windyInit(
//       {
//         key: "gUOhUQB6gvqbGhlGh8rcxifcO04kgAw2",
//         lat: -1.75,
//         lon: 117.5,
//         zoom: 5,
//         overlay: "rain", // 🔥 langsung set rain saat init
//       },
//       (windyAPI: any) => {
//         const { store } = windyAPI;

//         console.log("✅ Windy loaded");

//         // Force set rain overlay
//         store.set("overlay", "rain");
//       },
//     );
//   }, []);

//   return <div id="windy" className="absolute inset-0 h-full w-full" />;
// }
