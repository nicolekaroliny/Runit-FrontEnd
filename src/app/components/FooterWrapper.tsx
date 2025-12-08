"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  const hiddenExact = [
    "/signup",
    "/signin",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/settings",
  ];

  const hiddenPrefix = ["/dashboard"];

  const hide =
    hiddenExact.includes(pathname) ||
    hiddenPrefix.some((p) => pathname.startsWith(p));

  if (hide) return null;

  return <Footer />;
}
