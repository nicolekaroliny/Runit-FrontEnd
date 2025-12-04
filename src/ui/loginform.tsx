"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/ui/input";
import { Button } from "./button";
import { Label } from "./label";

const API_BASE_URL = "http://localhost:3000/api";

interface User {
  email: string;
  role: "owner" | "user" | "admin";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Erro ao fazer login.");
        setLoading(false);
        return;
      }

      const { token, user } = (await response.json()) as {
        token: string;
        user: User;
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          router.push("/home page/admin");
          break;
        case "user":
          router.push("/home page/user_type");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-background p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-secondary text-center">
        Entrar no Runit
      </h2>

      <div className="mb-5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          required
        />
      </div>

      {error && (
        <p className="text-destructive text-center mb-4" role="alert">
          {error}
        </p>
      )}

      <Button
        className="w-full bg-secondary hover:bg-yellow-600"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Entrar"}
      </Button>

      <p className="mt-6 text-center">
        Não tem conta?{" "}
        <Link
          href="/signup"
          className="text-secondary font-semibold hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}