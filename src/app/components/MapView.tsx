"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

export type RacePoint = {
  id: string;
  title: string;
  dateLabel?: string;
  distanceLabel?: string;
  locationLabel?: string;
  lat: number;
  lng: number;
  link?: string;
  status?: string;
};

// NÃO precisamos mais do mergeOptions com imports de PNG
// L.Icon.Default.mergeOptions({ ... });

/** Dois ícones: normal x ativo (mesma imagem, classes diferentes para CSS) */
const baseIconOpts: L.IconOptions = {
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
};

const normalIcon = L.icon({ ...baseIconOpts, className: "marker--normal" });
const activeIcon = L.icon({ ...baseIconOpts, className: "marker--active" });

function FlyTo({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 0.6 });
  }, [center, map]);
  return null;
}

export default function MapView({
  points,
  selectedId,
  onSelect,
  height = "78vh",
}: {
  points: RacePoint[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  height?: string | number;
}) {
  const center = useMemo(() => {
    const sel = points.find((c) => c.id === selectedId);
    return sel ? ([sel.lat, sel.lng] as [number, number]) : undefined;
  }, [selectedId, points]);

  const bounds = useMemo(() => {
    const b = L.latLngBounds([]);
    points.forEach((c) => b.extend([c.lat, c.lng]));
    return b;
  }, [points]);

  return (
    <MapContainer
      center={bounds.isValid() ? bounds.getCenter() : [-8.0476, -34.877]}
      zoom={12}
      style={{ width: "100%", height: typeof height === "number" ? `${height}px` : height }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {center && <FlyTo center={center} />}

      {points.map((c) => {
        const isActive = c.id === selectedId;
        return (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={isActive ? activeIcon : normalIcon}
            zIndexOffset={isActive ? 1000 : 0}
            eventHandlers={{ click: () => onSelect?.(c.id) }}
          >
            <Popup>
              <strong>{c.title}</strong>
              <br />
              {c.locationLabel}
            </Popup>
          </Marker>
        );
      })}

      <FitBoundsOnce bounds={bounds} />
    </MapContainer>
  );
}

function FitBoundsOnce({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);
  return null;
}
