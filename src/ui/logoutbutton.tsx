"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { Button } from "./button";

export function LogoutButton() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={handleLogout}
      className="bg-destructive hover:bg-destructive/90 text-white"
    >
      Sair
    </Button>
  );
}
