"use client";

import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Bem-vindo ao Dashboard, {user.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Informações do Usuário */}
          <div className="bg-card border border-border rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Informações do Perfil
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="text-lg font-medium text-foreground">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-lg font-medium text-foreground">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Usuário</p>
                <p className="text-lg font-medium text-foreground capitalize">
                  {user.user_type === "user" ? "Usuário" : "Administrador"}
                </p>
              </div>
            </div>
          </div>

          {/* Card de Ações */}
          <div className="bg-card border border-border rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Próximas Etapas
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <div>
                  <p className="font-medium text-foreground">Login Bem-sucedido</p>
                  <p className="text-sm text-muted-foreground">
                    Você foi autenticado com sucesso
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">→</span>
                <div>
                  <p className="font-medium text-foreground">
                    Explorar Funcionalidades
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique o menu principal
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Token Info (para debug) */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Informações Técnicas (Debug)
          </h2>
          <div className="bg-background p-4 rounded border border-border overflow-auto">
            <p className="text-xs font-mono text-muted-foreground break-all">
              Token: {localStorage.getItem("token")?.substring(0, 50)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
