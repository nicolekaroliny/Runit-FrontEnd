"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Race } from "@/types/race.types";
import { RaceService } from "@/lib/api/raceservice";
import { corridas as staticCorridas } from "./data";
import type { Corrida } from "./data";
import type { RacePoint } from "../components/MapView";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

const monthAbbr = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

function getDateParts(dateValue?: string) {
  if (!dateValue) return { day: "--", mon: "--" };

  const isoCandidate = new Date(dateValue);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return {
      day: isoCandidate.getDate().toString().padStart(2, "0"),
      mon: monthAbbr[isoCandidate.getMonth()] || "--",
    };
  }

  const match = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [, day, month] = match;
    return { day, mon: monthAbbr[parseInt(month, 10) - 1] || "--" };
  }

  return { day: "--", mon: "--" };
}

function formatDateLabel(dateValue?: string) {
  if (!dateValue) return "Data não informada";

  const parsed = new Date(dateValue);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }

  const match = dateValue.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) return match[0];

  return dateValue;
}

function mapApiRaceToPoint(race: Race): RacePoint {
  return {
    id: race.id.toString(),
    title: race.name,
    dateLabel: formatDateLabel(race.raceDate),
    distanceLabel: `${race.raceDistanceKm} km`,
    locationLabel: `${race.city}, ${race.state}`,
    lat: race.latitude,
    lng: race.longitude,
    link: race.registrationUrl || undefined,
    status: race.status,
  };
}

function mapStaticToPoint(race: Corrida): RacePoint {
  return {
    id: race.id,
    title: race.titulo,
    dateLabel: race.dataHora,
    distanceLabel: race.distancias,
    locationLabel: race.local,
    lat: race.lat,
    lng: race.lng,
    link: race.link || undefined,
    status: race.status,
  };
}

export default function CorridasPage() {
  const [points, setPoints] = useState<RacePoint[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const hydrateFromStatic = useCallback(() => {
    const fallback = staticCorridas.map(mapStaticToPoint);
    setPoints(fallback);
    setSelectedId(fallback[0]?.id);
    setUsingFallback(true);
  }, []);

  const loadRaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      const data = await RaceService.getAllRaces();
      const mapped = (data || [])
        .map(mapApiRaceToPoint)
        .filter((race) => Number.isFinite(race.lat) && Number.isFinite(race.lng));

      if (mapped.length > 0) {
        setPoints(mapped);
        setSelectedId(mapped[0]?.id);
        return;
      }

      setError("Nenhuma corrida encontrada. Exibindo dados locais.");
      hydrateFromStatic();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar corridas";
      setError(message);
      hydrateFromStatic();
    } finally {
      setLoading(false);
    }
  }, [hydrateFromStatic]);

  useEffect(() => {
    loadRaces();
  }, [loadRaces]);

  const selected = useMemo(() => points.find((race) => race.id === selectedId), [points, selectedId]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="mb-10">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-primary">Agenda</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mt-1">Corridas</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">
            Encontre provas próximas, visualize no mapa e acesse links de inscrição em tempo real.
          </p>

          <div className="flex flex-wrap gap-3 mt-4 items-center">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-3 w-3 rounded-full bg-primary animate-pulse" />
                Atualizando corridas...
              </div>
            )}

            {usingFallback && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                Modo offline (dados locais)
              </span>
            )}

            {error && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30">
                {error}
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Próximas provas</h2>
                  <p className="text-sm text-muted-foreground">Selecione para ver no mapa</p>
                </div>
                <button
                  onClick={loadRaces}
                  className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                  disabled={loading}
                >
                  Atualizar
                </button>
              </div>

              <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                {points.map((race) => {
                  const { day, mon } = getDateParts(race.dateLabel);
                  const active = race.id === selectedId;

                  return (
                    <button
                      key={race.id}
                      onClick={() => setSelectedId(race.id)}
                      className={[
                        "group w-full rounded-xl border transition",
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-muted text-foreground border-border hover:border-primary/60 hover:shadow-sm",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3 px-3 py-3">
                        <div
                          className={[
                            "w-14 h-14 rounded-lg flex flex-col items-center justify-center leading-none font-extrabold",
                            active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-background text-foreground border border-border",
                          ].join(" ")}
                        >
                          <span className="text-xl">{day}</span>
                          <span className="text-[11px] tracking-wide">{mon}</span>
                        </div>

                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base leading-tight line-clamp-2">
                            {race.title}
                          </div>
                          <div
                            className={[
                              "text-sm leading-tight",
                              active ? "text-primary-foreground/80" : "text-muted-foreground",
                            ].join(" ")}
                          >
                            {race.locationLabel || "Local a definir"}
                          </div>
                          <div
                            className={[
                              "text-xs mt-1",
                              active ? "text-primary-foreground/75" : "text-muted-foreground",
                            ].join(" ")}
                          >
                            {race.distanceLabel || "Distância a definir"}
                          </div>
                        </div>

                        {race.status && (
                          <span
                            className={[
                              "text-[11px] px-2 py-1 rounded-full font-semibold",
                              active
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-background text-primary border border-primary/30",
                            ].join(" ")}
                          >
                            {race.status}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {!loading && points.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Nenhuma corrida para exibir.
                  </p>
                )}
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-8">
            <div className="relative bg-card border border-border rounded-2xl p-3 shadow-sm min-h-[400px]">
              <div className="overflow-hidden rounded-xl border border-border/60">
                <MapView points={points} selectedId={selectedId} onSelect={setSelectedId} height="72vh" />
              </div>

              {selected && (
                <div className="absolute top-5 left-5 z-[1000] w-full max-w-md">
                  <div className="rounded-xl overflow-hidden shadow-xl border border-border bg-card">
                    <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide opacity-80">Corrida selecionada</p>
                        <h3 className="text-xl font-bold leading-tight">{selected.title}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedId(undefined)}
                        className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="Fechar detalhes"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-5 space-y-4 bg-card">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">Data</p>
                          <p className="text-sm font-semibold text-foreground">
                            {selected.dateLabel || "A definir"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">Local</p>
                          <p className="text-sm font-semibold text-foreground">
                            {selected.locationLabel || "A definir"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Distâncias</p>
                        <p className="text-sm font-semibold text-foreground">
                          {selected.distanceLabel || "Consultar organização"}
                        </p>
                      </div>

                      {selected.link ? (
                        <a
                          href={selected.link}
                          target="_blank"
                          rel="noreferrer"
                          className="block w-full text-center rounded-lg py-3 font-semibold text-primary-foreground bg-primary hover:opacity-90 transition"
                        >
                          Acessar inscrição
                        </a>
                      ) : (
                        <span className="block w-full text-center rounded-lg py-3 font-semibold text-muted-foreground bg-muted border border-border">
                          Link de inscrição indisponível
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
