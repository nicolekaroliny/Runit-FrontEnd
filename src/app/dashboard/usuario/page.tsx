'use client';

import { useEffect, useMemo, useState } from "react";
import ConquistasSection from "./ConquistasSection";
import "./dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFavorites } from "@/context/FavoritesContext";

/* Registro */
type Registro = {
  id: string;
  titulo: string;
  data: string | null; // ISO or dd/mm/yyyy
  distanciaKm: number;
  tempoSegundos: number;
  contarNasMetricas: boolean;
  colocacao?: number | null;
  createdAt?: string | null;
};

type Fav = {
  corridaId: string;
  titulo: string;
  data: string;
  hora?: string;
  local: string;
  distancias: string;
  link?: string;
};

/* --- utilitários simples --- */
const parseISO = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

function formatDateLabel(dateValue?: string | null) {
  if (!dateValue) return "—";
  const d = parseISO(dateValue);
  if (d) return d.toLocaleDateString("pt-BR");
  return dateValue;
}

/* --- componente principal --- */
export default function DashboardPage() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [favorites, setFavorites] = useState<Fav[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const { favorites: favsContext, removeFavorite: removeFavContext } = useFavorites();

  // Registros mockados
  useEffect(() => {
    const registrosMock: Registro[] = [
      {
        id: "r1",
        titulo: "Longão dom",
        data: new Date().toISOString(),
        distanciaKm: 12.5,
        tempoSegundos: 12_500,
        contarNasMetricas: true,
      },
      {
        id: "r2",
        titulo: "Trote",
        data: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
        distanciaKm: 5,
        tempoSegundos: 28 * 60,
        contarNasMetricas: true,
      },
    ];

    setRegistros(registrosMock);
    setLoading(false);
  }, []);

  // Sincroniza favoritos
  useEffect(() => {
    setFavorites(favsContext);
    setLoadingFavs(false);
  }, [favsContext]);

  /* --- Métricas derivadas --- */
  const metrics = useMemo(() => {
    const metricRegs = registros.filter((r) => r.contarNasMetricas);
    const kmUltimos30 = metricRegs.reduce((s, r) => s + (r.distanciaKm || 0), 0);
    const qtdUltimos30 = metricRegs.length;
    const maiorDistancia =
      metricRegs.reduce((m, r) => (r.distanciaKm > m ? r.distanciaKm : m), 0) || 0;

    const last10 = metricRegs.slice(0, 10);
    const somaTempo = last10.reduce((s, r) => s + (r.tempoSegundos || 0), 0);
    const somaDist = last10.reduce((s, r) => s + (r.distanciaKm || 0), 0);
    const paceMedio = somaDist > 0 ? somaTempo / somaDist : 0;

    const chartDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;
      return { label, value: 0 };
    });

    const now = Date.now();
    const msPerDay = 24 * 3600_000;
    metricRegs.forEach((r) => {
      const d = parseISO(r.data) || new Date(r.createdAt || "");
      if (!d) return;
      const diff = Math.floor((now - d.getTime()) / msPerDay);
      if (diff >= 0 && diff < 7) {
        const idx = 6 - diff;
        chartDays[idx].value += r.distanciaKm;
      }
    });

    const chartMax = chartDays.reduce((m, c) => Math.max(m, c.value), 0);

    return {
      kmUltimos30,
      qtdUltimos30,
      maiorDistancia,
      paceMedio,
      chartDays,
      chartMax,
    };
  }, [registros]);

  /* --- actions placeholders --- */
  const handleSelectRegistro = (id: string) => console.log("select", id);
  const handleDeleteRegistro = (id: string) => setRegistros((p) => p.filter((r) => r.id !== id));
  function removeFavorite(corridaId: string): void {
    return setFavorites((p) => p.filter((f) => f.corridaId !== corridaId));
  }


  /* ---------------- JSX ---------------- */
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <header className="mb-8">
          <p className="uppercase tracking-wider text-xs font-semibold text-primary">Agenda</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">Dashboard</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Acompanhe métricas, conquistas e suas corridas favoritas.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <CardMetric title="Km (últ. 30 dias)" value={`${metrics.kmUltimos30.toFixed(1)} km`} caption={`${metrics.qtdUltimos30} atividades`} />
          <CardMetric title="Maior distância" value={metrics.maiorDistancia > 0 ? `${metrics.maiorDistancia.toFixed(1)} km` : "—"} caption="Seu longão" />
          <CardMetric title="Pace médio (últ.10)" value={metrics.paceMedio > 0 ? `${Math.floor(metrics.paceMedio / 60)}:${String(Math.round(metrics.paceMedio % 60)).padStart(2, "0")} /km` : "—"} caption="Apenas registros contados" />
        </section>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-5">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm h-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Registros recentes</h2>
                  <p className="text-sm text-muted-foreground">Edite ou exclua seus registros</p>
                </div>
              </div>
              <div className="dashboard-table-wrapper">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="py-2">Data</th>
                      <th className="py-2">Título</th>
                      <th className="py-2">Distância</th>
                      <th className="py-2">Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.length === 0 && !loading ? (
                      <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Nenhum registro</td></tr>
                    ) : (
                      registros.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                          <td className="py-2">{formatDateLabel(r.data)}</td>
                          <td className="py-2">{r.titulo}</td>
                          <td className="py-2">{r.distanciaKm.toFixed(2)} km</td>
                          <td className="py-2">{formatTempo(r.tempoSegundos)}</td>
                          <td className="py-2 whitespace-nowrap">
                            <button onClick={() => handleSelectRegistro(r.id)} className="text-sm mr-2 text-primary">Abrir</button>
                            <button onClick={() => handleDeleteRegistro(r.id)} className="text-sm text-destructive">Excluir</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-foreground mb-3">Distância por dia (últimos 7 dias)</h3>

              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={metrics.chartDays}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)} km`} />
                    <Bar dataKey="value" fill="#4f46e5" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-end gap-3 h-40">
                {metrics.chartDays.map((c, i) => {
                  const height = metrics.chartMax > 0 ? (c.value / metrics.chartMax) * 100 : 4;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full dashboard-chart-bar" title={`${c.value.toFixed(1)} km`} style={{ height: `${Math.max(height, 4)}%` }} />
                      <div className="text-xs mt-2 text-muted-foreground">{c.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Corridas favoritadas</h3>
                <p className="text-sm text-muted-foreground">{loadingFavs ? "Carregando..." : `${favorites.length} favoritas`}</p>
              </div>
              {favorites.length === 0 ? (
                <p className="text-muted-foreground">Você não possui corridas favoritadas.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {favorites.map((f) => (
                    <article key={f.corridaId} className="p-3 rounded-lg bg-background border border-border flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{f.titulo}</div>
                        <div className="text-sm text-muted-foreground">{f.local} • {formatDateLabel(f.data)}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {f.link ? <a href={f.link} target="_blank" rel="noreferrer" className="text-sm text-primary">Inscrição</a> : <span className="text-xs text-muted-foreground">Sem link</span>}
                        <button onClick={() => removeFavContext(f.corridaId)} className="text-xs text-destructive">Remover</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <ConquistasSection registros={registros} />
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- small helpers / subcomponents ---------------- */
function CardMetric({ title, value, caption }: { title: string; value: string; caption?: string }) {
  return (
    <div className="p-4 rounded-xl bg-navbar-primary border border-border shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-2 flex items-baseline justify-between gap-4">
        <strong className="text-2xl text-foreground">{value}</strong>
      </div>
      {caption && <p className="text-xs text-muted-foreground mt-2">{caption}</p>}
    </div>
  );
}

function formatTempo(seg: number) {
  if (!seg || seg <= 0) return "—";
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
