import { Registro } from "@/types/registro.types";

export const registrosMock: Registro[] = [
  {
    id: "r1",
    titulo: "Longão dom",
    data: new Date().toISOString(),
    distanciaKm: 12.5,
    tempoSegundos: 12_500,
    contarNasMetricas: true,
    colocacao: null,
  },
  {
    id: "r2",
    titulo: "Trote",
    data: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
    distanciaKm: 5,
    tempoSegundos: 28 * 60,
    contarNasMetricas: true,
    colocacao: null,
  },
];
