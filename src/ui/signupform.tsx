"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/ui/input";
import { Button } from "./button";
import { Label } from "./label";

const API_BASE_URL = "http://localhost:3000/api"; 

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Erro ao criar conta.");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
        Crie sua conta na Runit
      </h2>

      <div className="mb-5">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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

      <div className="mb-5">
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

      <div className="mb-6">
        <Label htmlFor="confirmPassword">Confirme a Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4" role="alert">
          {error}
        </p>
      )}

      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-600"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Criando conta..." : "Cadastrar"}
      </Button>

      <p className="mt-6 text-center text-gray-600">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-yellow-600 font-semibold hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}