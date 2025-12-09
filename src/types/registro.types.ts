export type Registro = {
  id: string;
  titulo: string;
  data: string | null;
  distanciaKm: number;
  tempoSegundos: number;
  contarNasMetricas: boolean;
  colocacao: number | null;
  createdAt?: string | null;
};

export type Fav = {
  corridaId: string;
  titulo: string;
  data: string;
  hora?: string;
  local: string;
  distancias: string;
  link?: string;
};
