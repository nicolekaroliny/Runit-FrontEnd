"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/ui/input";
import { Button } from "./button";
import { Label } from "./label";
import { useAuth } from "@/context/authcontext";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor, digite um email válido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📝 Tentando login com email:", email);
      await login(email, password);
      console.log("✅ Login bem-sucedido! Token persistido. Redirecionando...");
      
      // Sem delay - redireciona direto
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login.";
      console.error("❌ Erro ao fazer login:", errorMessage);
      
      // Tratamento de erro específico conforme o backend
      if (errorMessage.includes("Email ou senha inválidos")) {
        setError("Email ou senha inválidos. Tente novamente.");
      } else if (errorMessage.includes("não foi possível conectar")) {
        setError("Servidor não está disponível. Tente mais tarde.");
      } else if (errorMessage.includes("Usuário não encontrado")) {
        setError("Usuário não encontrado. Verifique o email.");
      } else if (errorMessage.includes("validação")) {
        setError("Dados inválidos. Verifique e tente novamente.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          required
        />
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium" role="alert">
          {error}
        </p>
      )}

      <Button
        className="w-full bg-secondary hover:bg-secondary/90 text-foreground"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Entrar"}
      </Button>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="text-secondary font-semibold hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}