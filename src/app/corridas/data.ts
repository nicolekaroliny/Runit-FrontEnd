// app/corridas/data.ts

//relação de corridas

export type Corrida = {
  id: string;
  titulo: string;
  dataHora: string;
  distancias: string;
  local: string;
  lat: number;
  lng: number;
  link?: string;
  status?: "abertas" | "encerradas";
};

export const corridas: Corrida[] = [
  {
    id: "oab",
    titulo: "Corrida da OAB",
    dataHora: "09/11/2025 às 06:00",
    distancias: "5k, 10k",
    local: "Recife - Largada no Shopping Recife",
    lat: -8.11962,
    lng: -34.90864,
    link: "https://soucorredor.com.br/evento/view/5813",
    status: "abertas",
  },
  {
    id: "boa-viagem-2",
    titulo: "2ª Corrida da Av. Boa Viagem",
    dataHora: "26/10/2025 às 05:30",
    distancias: "5k, 10k, 15k",
    local: "Recife - Largada na Av. Boa Viagem",
    // no seu HTML tinha "-8.13216," com vírgula sobrando; corrigido:
    lat: -8.13216,
    lng: -34.90014,
    link: "https://www.ticketsports.com.br/e/2%C2%AA%20CORRIDA%20DA%20AV.%20BOA%20VIAGEM-72397",
    status: "abertas",
  },
  {
    id: "fogo-xxi",
    titulo: "XXI Corrida do Fogo",
    dataHora: "12/10/2025 às 05:50",
    distancias: "5k, 10k",
    local: "Recife - Av. João de Barros, 399, PE",
    lat: -8.049848,
    lng: -34.890043,
    link: "https://www.ticketsports.com.br/e/XXI%20CORRIDA%20DO%20FOGO%20-%20CBMPE%20138%20ANOS%20-72909",
    status: "abertas",
  },
  {
    id: "mauricio-nassau-xiv",
    titulo: "XIV MARATONA INTERNACIONAL MAURICIO DE NASSAU",
    dataHora: "07/10/2025 (5k/10k 05:30 • 21k 05:00 • 42k 04:00)",
    distancias: "5k, 10k, 21k, 42k",
    local: "Recife - Largada no Forte do Brum",
    lat: -8.052873,
    lng: -34.870939,
    link: "https://www.ticketsports.com.br/e/XIV%20MARATONA%20INTERNACIONAL%20MAURICIO%20DE%20NASSAU%202025-73313",
    status: "abertas",
  },
  {
    id: "meia-praias-iii",
    titulo: "III MEIA MARATONA DAS PRAIAS DO RECIFE",
    dataHora: "30/11/2025 às 05:00",
    distancias: "5k, 10k, 15k",
    local: "Recife - Parque Dona Lindu",
    lat: -8.14152,
    lng: -34.90386,
    link: "https://www.ticketsports.com.br/e/III%20MEIA%20MARATONA%20DAS%20PRAIAS%20DO%20RECIFE-73842",
    status: "abertas",
  },
  {
    id: "scge-integridade-1",
    titulo: "1ª CORRIDA DA INTEGRIDADE SCGE-PE",
    dataHora: "14/12/2025 às 06:30",
    distancias: "5k, 10k, infantil",
    local: "Recife - Rua Santa Elias",
    lat: -8.04827,
    lng: -34.90116,
    link: "https://www.ticketsports.com.br/e/1%C2%AA%20CORRIDA%20DA%20INTEGRIDADE%20SCGE-PE-73814",
    status: "abertas",
  },
  {
    id: "eu-amo-recife-xii",
    titulo: "MEIA MARATONA EU AMO RECIFE - 12ª EDIÇÃO",
    dataHora: "27/09/2025 às 18:00",
    distancias: "5k, 10k, 21k",
    local: "Recife - Marco Zero",
    lat: -8.06472,
    lng: -34.87444,
    link: "",
    status: "encerradas",
  },
];
