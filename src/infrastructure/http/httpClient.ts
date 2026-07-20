/**
 * httpClient — Infra (HTTP)
 *
 * @what     Único punto por donde mobile habla con la API. Pone el token y traduce los errores.
 * @receives path: string · opciones de fetch
 * @processes Añade `Authorization: Bearer <token>` si hay sesión, serializa el cuerpo a JSON y
 *           convierte una respuesta no-OK en un `HttpError` con el mensaje que mandó el servidor —
 *           el de la API está en español y pensado para leerse ("Esa cuota ya está pagada").
 * @returns  Promise<T> con el JSON de la respuesta.
 *
 * **El `workspaceId` no se manda nunca**: viaja dentro del token. Si aparece un `?workspaceId=` en
 * alguna llamada, es un resto de antes de F5 y hay que quitarlo — que el cliente elija el workspace
 * era exactamente el agujero que se cerró.
 */
import { API_URL } from './config';
import { tokenStore } from './tokenStore';

/** Error con el código HTTP a la vista, para que quien llama pueda distinguir un 401 de un 409. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Login y registro: todavía no hay token y mandar el header vacío no aporta nada. */
  anonymous?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, anonymous = false } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (!anonymous && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // `fetch` solo lanza si no hubo respuesta: sin red, o la API apagada. Un 500 NO pasa por acá.
    throw new HttpError(0, 'No se pudo conectar con el servidor');
  }

  if (!response.ok) {
    throw new HttpError(response.status, await messageFrom(response));
  }

  // 204 y familia no traen cuerpo: `.json()` reventaría con "Unexpected end of input".
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

/**
 * Saca el mensaje del cuerpo de error de la API. `message` puede ser texto o un array: el
 * ValidationPipe de Nest devuelve una lista cuando fallan varios campos a la vez.
 */
async function messageFrom(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join('. ');
    if (typeof body.message === 'string') return body.message;
  } catch {
    // Cuerpo vacío o que no es JSON — se cae al mensaje genérico.
  }
  return `Error del servidor (${response.status})`;
}
