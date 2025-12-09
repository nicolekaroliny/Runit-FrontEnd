"use client";

import { useMemo } from "react";

type TipoTreino = "corrida" | "treino";

type Registro = {
  distanciaKm: number;
  tempoSegundos: number;
  colocacao?: number | null;
  contarNasMetricas: boolean;
  titulo: string;
};

type Achievement = {
  id: string;
  titulo: string;
  descricao: string;
  unlocked: boolean;
  progress?: number;
};

export default function ConquistasSection({ registros }: { registros: Registro[] }) {
  const achievements = useMemo(() => {
    const validos = registros.filter((r) => r.contarNasMetricas);

    const totalKm = validos.reduce((s, r) => s + r.distanciaKm, 0);
    const totalTreinos = validos.length;

    const longest = validos.sort((a, b) => b.distanciaKm - a.distanciaKm)[0];

    let bestPace: number | null = null;
    validos.forEach((r) => {
      if (r.distanciaKm > 0) {
        const pace = r.tempoSegundos / r.distanciaKm;
        if (bestPace === null || pace < bestPace) bestPace = pace;
      }
    });

    const achievements: Achievement[] = [
      {
        id: "10km",
        titulo: "Primeiros 10 km 🎉",
        descricao: "Corra pelo menos 10 km somados.",
        unlocked: totalKm >= 10,
        progress: Math.min(100, (totalKm / 10) * 100),
      },
      {
        id: "50km",
        titulo: "50 km acumulados 🏅",
        descricao: "50 km no total.",
        unlocked: totalKm >= 50,
        progress: Math.min(100, (totalKm / 50) * 100),
      },
      {
        id: "100km",
        titulo: "100 km no asfalto 💪",
        descricao: "100 km somados.",
        unlocked: totalKm >= 100,
        progress: Math.min(100, (totalKm / 100) * 100),
      },
      {
        id: "5treinos",
        titulo: "Primeiros 5 treinos",
        descricao: "Registre pelo menos 5 atividades.",
        unlocked: totalTreinos >= 5,
        progress: Math.min(100, (totalTreinos / 5) * 100),
      },
      {
        id: "longao",
        titulo: "Longão registrado 🏃‍♂️",
        descricao: longest ? `Maior distância: ${longest.distanciaKm} km` : "Registre um treino.",
        unlocked: !!longest && longest.distanciaKm >= 5,
      },
      {
        id: "paceSub6",
        titulo: "Pace sub 6'00\" 🧨",
        descricao: "Tenha um treino com pace abaixo de 6min/km.",
        unlocked: bestPace !== null && bestPace < 360,
      },
    ];

    return achievements;
  }, [registros]);

  return (
    <section className="mt-10 p-6 bg-navbar-primary border border-border rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-1">Conquistas</h2>
      <p className="text-muted-foreground mb-6">
        Sua evolução como corredor, registrada aqui.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a) => (
          <article
            key={a.id}
            className={`p-4 rounded-xl border shadow-md transition ${
              a.unlocked
                ? "bg-green-100/70 border-green-300"
                : "bg-background border-border"
            }`}
          >
            <span
              className={`text-xs px-2 py-1 rounded-full border ${
                a.unlocked
                  ? "bg-green-200 border-green-400 text-green-800"
                  : "bg-muted border-border text-muted-foreground"
              }`}
            >
              {a.unlocked ? "Conquistado" : "Progresso"}
            </span>

            <h3 className="mt-2 font-bold">{a.titulo}</h3>
            <p className="text-sm text-muted-foreground">{a.descricao}</p>

            {/* Progress bar */}
            {a.progress !== undefined && (
              <div className="mt-3">
                <div className="dashboard-achievement-progress-bar">
                  <div
                    className="dashboard-achievement-progress-fill"
                    style={{ width: `${a.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.progress.toFixed(0)}%
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
