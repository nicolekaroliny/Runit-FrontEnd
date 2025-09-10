export type UserType = "user" | "admin";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  user_type: UserType;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    user_type: UserType;
  };
}

export const authService = {
  async signup(data: SignUpData): Promise<AuthResponse> {
    const response = await fetch(`/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao cadastrar.");
    }

    const result: AuthResponse = await response.json();
    return result;
  },

  async signin(data: SignInData): Promise<AuthResponse> {
    const response = await fetch(`/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Credenciais inválidas.");
    }

    const result: AuthResponse = await response.json();
    return result;
  },
};