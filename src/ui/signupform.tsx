'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authcontext"; 
import type { SignUpData } from '../lib/api/authservice'; 

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 mt-1" />
);
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className="text-sm font-medium text-gray-700 block mb-1" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 mt-1 appearance-none bg-white h-10" />
);
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { className, ...rest } = props;
    return (
        <button 
            {...rest} 
            className={`transition-colors py-3 text-lg font-semibold rounded-lg ${className || 'bg-yellow-500 hover:bg-yellow-600'}`}
        >
            {props.children}
        </button>
    );
};



const DEFAULT_USER_TYPE = "user"; 
const DEFAULT_TIMEZONE = "America/Sao_Paulo"; 
const DEFAULT_LOCALE = "pt-BR"; 

export function SignupForm() {
  const router = useRouter();
  const { register } = useAuth(); 
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "", 
    gender: "",    
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async () => {
    const { name, lastName, email, password, confirmPassword, birthDate, gender } = formData;

    
    if (!name || !lastName || !email || !password || !confirmPassword || !birthDate || !gender) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    const dataToSend: SignUpData = {
      name,
      lastName,
      email,
      password,
      birthDate,
      gender: gender as 'M' | 'F' | 'O', 
      user_type: DEFAULT_USER_TYPE,
      timezone: DEFAULT_TIMEZONE,
      locale: DEFAULT_LOCALE,
    };
    
    setLoading(true);
    setError(null);

    try {
      await register(dataToSend);
      router.push("/dashboard"); 

    } catch (err: any) {
      console.error("Erro na tentativa de cadastro:", err);
      setError(err.message || "Erro desconhecido ao cadastrar. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-yellow-600 text-center">
        Crie sua conta Runit
      </h2>

      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 font-medium" role="alert">
          {error}
        </p>
      )}
      
      {/* Nome e Sobrenome em uma linha */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" type="text" placeholder="Seu nome" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input id="lastName" type="text" placeholder="Seu sobrenome" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>
      
      {/* Email */}
      <div className="mb-5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="seuemail@exemplo.com" value={formData.email} onChange={handleChange} required />
      </div>

      {/* Data de Nascimento e Gênero */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="gender">Gênero</Label>
          <Select id="gender" value={formData.gender} onChange={handleChange} required className="h-10">
            <option value="">Selecione...</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </Select>
        </div>
      </div>

      {/* Senhas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="********" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirme a Senha</Label>
          <Input id="confirmPassword" type="password" placeholder="********" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
      </div>

      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-600 transition-colors py-3 text-lg font-semibold"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Cadastrar"}
      </Button>

      <p className="mt-6 text-center text-gray-600">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-yellow-600 font-semibold hover:underline transition-colors"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}