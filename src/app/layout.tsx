import "./globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/authcontext";
import ConditionalNavBar from "@/app/components/ConditionalNavBar";
import FooterWrapper from "@/app/components/FooterWrapper";
import { AuthDebug } from "@/components/AuthDebug";

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
    <html lang="pt-BR" className={poppins.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ConditionalNavBar />

          <div className="w-full min-h-screen bg-background dark:bg-black pt-24">
            {children}
          </div>

          <AuthDebug />

          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
