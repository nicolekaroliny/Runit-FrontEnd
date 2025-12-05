'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authcontext"; 
import type { SignUpData } from '../lib/api/authservice'; 

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-2 border border-border rounded-lg focus:ring-secondary focus:border-secondary mt-1 bg-background text-foreground" />
);
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label {...props} className="text-sm font-medium text-foreground block mb-1" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full p-2 border border-border rounded-lg focus:ring-secondary focus:border-secondary mt-1 appearance-none bg-background text-foreground h-10" />
);
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { className, ...rest } = props;
    return (
        <button 
            {...rest} 
            className={`transition-colors py-3 text-lg font-semibold rounded-lg ${className || 'bg-secondary hover:bg-secondary/50'}`}
        >
            {props.children}
        </button>
    );
};

const DEFAULT_TIMEZONE = "America/Sao_Paulo"; 
const DEFAULT_LOCALE = "pt-BR"; 

export function SignupForm() {
  const router = useRouter();
  const { register } = useAuth(); 
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "", 
    gender: "",
    timezone: DEFAULT_TIMEZONE,
    locale: DEFAULT_LOCALE,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Validação Passo 1
  const validateStep1 = (): boolean => {
    if (!formData.name.trim() || !formData.lastName.trim()) {
      setError("Por favor, preencha nome e sobrenome.");
      return false;
    }

    if (formData.name.length > 100) {
      setError("Nome não pode ter mais de 100 caracteres.");
      return false;
    }

    if (formData.lastName.length > 150) {
      setError("Sobrenome não pode ter mais de 150 caracteres.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Por favor, preencha o email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido. Use um formato válido (ex: user@example.com).");
      return false;
    }

    return true;
  };

  // Validação Passo 2
  const validateStep2 = (): boolean => {
    if (!formData.birthDate) {
      setError("Por favor, selecione sua data de nascimento.");
      return false;
    }

    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    if (birthDate >= today) {
      setError("Data de nascimento deve ser no passado.");
      return false;
    }

    if (!formData.gender) {
      setError("Por favor, selecione seu gênero.");
      return false;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Por favor, preencha ambas as senhas.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Senha deve ter pelo menos 8 caracteres.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setError(null);
    setStep(1);
  };

  const handleSignup = async () => {
    if (!validateStep2()) {
      return;
    }

    const dataToSend: SignUpData = {
      name: formData.name,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      gender: formData.gender as 'M' | 'F', 
      timezone: formData.timezone || null,
      locale: formData.locale || null,
      email: formData.email,
      password: formData.password,
    };
    
    setLoading(true);
    setError(null);

    try {
      await register(dataToSend);
      router.push("/dashboard"); 

    } catch (err) {
      console.error("Erro na tentativa de cadastro:", err);
      const error = err as Error;
      setError(error.message || "Erro desconhecido ao cadastrar. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background p-4 rounded-xl shadow-lg border border-border">
      <div className="w-full">
      {/* Indicador de Passo - Melhorado */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          {/* Passo 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base transition-all ${
              step === 1 ? 'bg-secondary ring-4 ring-yellow-600 animate-pulse scale-110' : step > 1 ? 'bg-green-500' : 'bg-muted-foreground'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`text-xs font-semibold mt-1 ${step === 1 ? 'text-secondary' : 'text-muted-foreground'}`}>
              Informações Pessoais
            </span>
          </div>

          {/* Linha de progresso */}
          <div className="flex-1 h-1 mx-3 mb-6">
            <div className={`h-full rounded transition-all ${step >= 2 ? 'bg-secondary' : 'bg-muted-foreground'}`}></div>
          </div>

          {/* Passo 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base transition-all ${
              step === 2 ? 'bg-secondary ring-4 ring-yellow-600 animate-pulse scale-110' : step > 2 ? 'bg-green-500' : 'bg-muted-foreground'
            }`}>
              2
            </div>
            <span className={`text-xs font-semibold mt-1 ${step === 2 ? 'text-secondary' : 'text-muted-foreground'}`}>
              Segurança & Localização
            </span>
          </div>
        </div>
        
        {/* Barra de progresso percentual */}
        <div className="w-full bg-muted-foreground h-2 rounded-full overflow-hidden">
          <div className={`h-full bg-secondary transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>
      </div>

      <h2 className="text-xl font-extrabold mb-1 text-secondary text-center">
        {step === 1 ? "Crie sua conta Runit" : "Defina sua senha e localização"}
      </h2>
      <p className="text-center text-muted-foreground mb-3 text-xs">
        {step === 1 ? "Etapa 1 de 2" : "Etapa 2 de 2"}
      </p>

      {error && (
        <p className="text-destructive bg-card border-b-4 border-border p-2 rounded-lg mb-3 text-sm font-medium" role="alert">
          {error}
        </p>
      )}
      
      {/* PASSO 1: Informações Pessoais */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <div className="bg-card border-l-4 border-secondary p-2 mb-3 rounded">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Etapa 1:</span> Comece fornecendo seus dados pessoais e email
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome" 
                maxLength={100}
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <span className="text-xs text-foreground">Máx 100 caracteres</span>
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input 
                id="lastName" 
                type="text" 
                placeholder="Seu sobrenome" 
                maxLength={150}
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
              <span className="text-xs text-foreground">Máx 150 caracteres</span>
            </div>
          </div>
          
          {/* Email */}
          <div className="mb-3">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Botão Próximo */}
          <Button
            className="w-full bg-secondary hover:bg-yellow-600 transition-colors py-2 text-base font-semibold"
            onClick={handleNextStep}
          >
            Próximo
          </Button>

          <p className="mt-3 text-center text-muted-foreground text-sm">
            Já tem conta?{" "}
            <Link
              href="/signin"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      )}

      {/* PASSO 2: Dados de Segurança */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <div className="bg-card border-l-4 border-secondary p-2 mb-3 rounded">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Etapa 2:</span> Agora configure sua senha e localização
            </p>
          </div>
          {/* Data de Nascimento e Gênero */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="birthDate">Data de Nascimento *</Label>
              <Input 
                id="birthDate" 
                type="date" 
                value={formData.birthDate} 
                onChange={handleChange} 
                required 
              />
              <span className="text-xs text-foreground">Formato: YYYY-MM-DD</span>
            </div>
            <div>
              <Label htmlFor="gender">Gênero *</Label>
              <Select 
                id="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                required 
                className="h-10"
              >
                <option value="">Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </Select>
            </div>
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Mín 8 caracteres" 
                minLength={8}
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <span className="text-xs text-foreground">Mín 8 caracteres</span>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirme a Senha *</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirme" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
              <span className="text-xs text-foreground">Mín 8 caracteres</span>
            </div>
          </div>

          {/* Timezone e Locale (Opcionais) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select 
                id="timezone" 
                value={formData.timezone} 
                onChange={handleChange}
                className="h-10"
              >
                <option value="America/Sao_Paulo">Brasil - São Paulo (GMT-3)</option>
                <option value="America/Manaus">Brasil - Manaus (GMT-4)</option>
                <option value="America/Recife">Brasil - Recife (GMT-3)</option>
                <option value="America/Rio_Branco">Brasil - Rio Branco (GMT-5)</option>
                <option value="America/Noronha">Brasil - Fernando de Noronha (GMT-2)</option>
                <option value="America/New_York">EUA - New York (GMT-5)</option>
                <option value="America/Los_Angeles">EUA - Los Angeles (GMT-8)</option>
                <option value="America/Chicago">EUA - Chicago (GMT-6)</option>
                <option value="Europe/London">Europa - Londres (GMT+0)</option>
                <option value="Europe/Paris">Europa - Paris (GMT+1)</option>
                <option value="Europe/Berlin">Europa - Berlim (GMT+1)</option>
                <option value="Asia/Tokyo">Ásia - Tóquio (GMT+9)</option>
                <option value="Asia/Shanghai">Ásia - Xangai (GMT+8)</option>
                <option value="Australia/Sydney">Oceania - Sydney (GMT+11)</option>
              </Select>
              <span className="text-xs text-foreground">Opcional</span>
            </div>
            <div>
              <Label htmlFor="locale">Idioma/Região</Label>
              <Select 
                id="locale" 
                value={formData.locale} 
                onChange={handleChange}
                className="h-10"
              >
                <option value="pt_BR">Português (Brasil)</option>
                <option value="pt_PT">Português (Portugal)</option>
                <option value="en_US">English (US)</option>
                <option value="en_GB">English (UK)</option>
                <option value="es_ES">Español (España)</option>
                <option value="es_MX">Español (México)</option>
                <option value="fr_FR">Français (France)</option>
                <option value="de_DE">Deutsch (Deutschland)</option>
                <option value="it_IT">Italiano (Italia)</option>
                <option value="ja_JP">日本語 (日本)</option>
                <option value="zh_CN">中文 (中国)</option>
              </Select>
              <span className="text-xs text-foreground">Opcional</span>
            </div>
          </div>

          {/* Botões Voltar e Cadastrar */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-destructive hover:bg-destructive/50 transition-colors py-2 text-base text-foreground font-semibold"
              onClick={handlePreviousStep}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button
              className="bg-secondary hover:bg-secondary/50 transition-colors py-2 text-base font-semibold text-foreground"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Cadastrar"}
            </Button>
          </div>

          <p className="mt-3 text-center text-muted-foreground text-sm">
            Já tem conta?{" "}
            <Link
              href="/signin"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      )}
      </div>
    </div>
  );
}