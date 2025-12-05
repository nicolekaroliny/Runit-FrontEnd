import { getAuthToken } from './auth';

/**
 * Faz uma requisição HTTP com token JWT automaticamente incluído no header
 * @param url URL completa da requisição
 * @param options Opções do fetch
 * @returns Response do fetch
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Se receber 401, token expirou - fazer logout
    if (response.status === 401) {
      console.warn('⚠️ Token expirado (401) - pode ser necessário fazer login novamente');
      // Aqui você pode disparar um evento global de logout se necessário
    }

    return response;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
}

/**
 * Faz uma requisição GET com token automático
 */
export async function apiGet(url: string): Promise<any> {
  const response = await apiRequest(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Faz uma requisição POST com token automático
 */
export async function apiPost(url: string, data: any): Promise<any> {
  const response = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `POST ${url} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Faz uma requisição PUT com token automático
 */
export async function apiPut(url: string, data: any): Promise<any> {
  const response = await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `PUT ${url} failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Faz uma requisição DELETE com token automático
 */
export async function apiDelete(url: string): Promise<any> {
  const response = await apiRequest(url, { method: 'DELETE' });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `DELETE ${url} failed with status ${response.status}`);
  }

  return response.json();
}
