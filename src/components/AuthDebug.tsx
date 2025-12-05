"use client";

import { useAuth } from "@/context/authcontext";
import { useEffect, useState } from "react";

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded shadow-lg text-xs max-w-xs z-50">
      <div className="space-y-1 font-mono">
        <div>
          <span className="text-yellow-400">isLoading:</span> {String(isLoading)}
        </div>
        <div>
          <span className="text-yellow-400">isAuthenticated:</span>{" "}
          {String(isAuthenticated)}
        </div>
        <div>
          <span className="text-yellow-400">user:</span>{" "}
          {user ? `${user.name} (${user.email})` : "null"}
        </div>
        <div>
          <span className="text-yellow-400">token:</span>{" "}
          {token ? token.substring(0, 20) + "..." : "none"}
        </div>
      </div>
    </div>
  );
}
