import "./globals.css";
import "leaflet/dist/leaflet.css"; // se você usa Leaflet nas outras páginas
import Header from "./components/Header";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Runit",
  description: "Frontend",
};

// carrega Poppins 700 como você fazia no <Head>
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} min-h-screen bg-white flex flex-col`}>
        {/* aplica a fonte no site todo */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              `body, h1, h2, h3, h4, h5, h6, p, a, span, label, input, button, div { font-family: var(--font-poppins), sans-serif; font-weight: 700; }`,
          }}
        />
        {/* header global */}
                <Header />
        {/* conteúdo da página */}
        {children}
      </body>
    </html>
  );
}
