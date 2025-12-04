import "./globals.css";
import "leaflet/dist/leaflet.css"; // se você usa Leaflet nas outras páginas
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NavBar from "./components/navBar/NavBar";
import { AuthProvider } from "@/context/authcontext";

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
    <html lang="pt-BR" className={poppins.className}>
      <body>
        <AuthProvider>
          <NavBar/>
          <div className="pt-24">
            <div className="w-full">
              <div className="min-h-screen bg-background dark:bg-black">
                {children}
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
