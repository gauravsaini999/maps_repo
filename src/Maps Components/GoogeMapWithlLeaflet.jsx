import React, { useEffect, useState } from "react";
import { MapContainer, Tooltip, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Define colors for stats (consistent legend) ---
const statColors = {
  population: "#FFD700", // Gold
  revenue: "#1E90FF",    // DodgerBlue
  growth: "#32CD32",     // LimeGreen
};

// --- Utility: Generate SVG donut pie chart ---
const generateDonutSVG = (stats, radius = 20, thickness = 8) => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  let cumulative = 0;
  const cx = radius;
  const cy = radius;
  const r = radius - thickness / 2;

  const paths = Object.entries(stats).map(([key, value]) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += value;
    const endAngle = (cumulative / total) * 2 * Math.PI;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
      <path
        d="M ${x1} ${y1}
           A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}"
        stroke="${statColors[key] || "gray"}"
        stroke-width="${thickness}"
        fill="none"
      />
    `;
  });

  return `
    <svg width="${radius * 2}" height="${radius * 2}" viewBox="0 0 ${radius * 2} ${radius * 2}">
      ${paths.join("\n")}
    </svg>
  `;
};

// --- Google Maps Tile Layer component ---
const GoogleMapsTileLayer = ({ apiKey }) => {
  const map = useMap();

  useEffect(() => {
    const tileLayer = L.tileLayer(
      `https://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${apiKey}`,
      {
        attribution: '&copy; <a href="https://maps.google.com/">Google Maps</a>',
        maxZoom: 20,
      }
    );
    tileLayer.addTo(map);
    return () => {
      map.removeLayer(tileLayer);
    };
  }, [apiKey, map]);

  return null;
};

// --- Donut Marker component with zoom scaling ---
const DonutMarker = ({ position, stats }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  // scale radius with zoom
  const baseRadius = 18;
  const scaledRadius = Math.max(8, baseRadius * (zoom / 10));

  const icon = L.divIcon({
    html: generateDonutSVG(stats, scaledRadius, 8),
    className: "",
    iconSize: [scaledRadius * 2, scaledRadius * 2],
    iconAnchor: [scaledRadius, scaledRadius],
  });

  return (
    <Marker position={position} icon={icon}>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div style={{ fontSize: "0.8rem" }}>
          <strong>Stats</strong>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {Object.entries(stats).map(([key, val]) => (
              <li key={key} style={{ color: statColors[key], marginBottom: 2 }}>
                ● {key}: {val}
              </li>
            ))}
          </ul>
        </div>
      </Tooltip>
    </Marker>
  );
};

// --- Main Component ---
const MapWithDonutMarkers = () => {
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // replace with your key

  // Base location: New Delhi
  const baseLat = 28.6139;
  const baseLng = 77.2090;

  // Generate 10 nearby markers
  const markers = Array.from({ length: 10 }, (_, i) => {
    const latOffset = (Math.random() - 0.5) * 0.05; // small random offset
    const lngOffset = (Math.random() - 0.5) * 0.05;

    return {
      id: i + 1,
      position: [baseLat + latOffset, baseLng + lngOffset],
      stats: {
        population: Math.floor(Math.random() * 2000 + 500),
        revenue: Math.floor(Math.random() * 1000 + 200),
        growth: Math.floor(Math.random() * 800 + 100),
      },
    };
  });

  return (
    <MapContainer
      center={[baseLat, baseLng]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <GoogleMapsTileLayer apiKey={googleApiKey} />

      {markers.map((m) => (
        <DonutMarker key={m.id} position={m.position} stats={m.stats} />
      ))}
    </MapContainer>
  );
};

export default MapWithDonutMarkers;
