import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App() {
  const locations = [
  { longitude: -0.09, latitude: 51.505 },
  { longitude: -0.091, latitude: 51.507 },
  { longitude: -0.092, latitude: 51.506 },
  { longitude: -0.088, latitude: 51.504 },
  { longitude: -0.087, latitude: 51.508 },
  { longitude: -0.093, latitude: 51.509 },
  { longitude: -0.094, latitude: 51.503 },
  { longitude: -0.095, latitude: 51.507 },
  { longitude: -0.089, latitude: 51.506 },
  { longitude: -0.086, latitude: 51.505 }
];

  return (
      <Map
      initialViewState={{
        longitude: -0.09,
        latitude: 51.505,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken="pk.eyJ1IjoiZ2F1cmF2c2Fpbmk5OTk5OSIsImEiOiJjbWZrbDFnN3kxYzRwMmtzYWV2NGdmc3lsIn0.bwJa2GkbSQXiXg1Dlh1Bqg"
    >
      {locations.map((loc, i) => (
        <Marker key={i} longitude={loc.longitude} latitude={loc.latitude} color="red" />
      ))}
    </Map>
  );
}
