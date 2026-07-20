/**
 * tokenStore — Infra (sesión)
 *
 * @what     Guarda y recupera el token de sesión del llavero del sistema.
 * @receives token: string
 * @processes `expo-secure-store` cifra con Keystore (Android) / Keychain (iOS). El token **abre la
 *           cuenta durante 30 días**, así que es una credencial: en texto plano, cualquiera con
 *           acceso al teléfono la copia y entra sin saber la contraseña.
 * @returns  —
 *
 * Guarda además una **copia en memoria**: leer del llavero es asíncrono y hay peticiones que salen
 * antes de que termine. La memoria es la fuente rápida; el llavero, la que sobrevive al cierre.
 */
import * as SecureStore from 'expo-secure-store';

const KEY = 'moniwow.session.token';

let cached: string | null = null;

export const tokenStore = {
  /** Token para la petición en curso. Sin `await`: ya está en memoria tras `restore()`. */
  get(): string | null {
    return cached;
  },

  async save(token: string): Promise<void> {
    cached = token;
    await SecureStore.setItemAsync(KEY, token);
  },

  /** Lee el llavero al arrancar la app. Devuelve el token si había sesión guardada. */
  async restore(): Promise<string | null> {
    cached = await SecureStore.getItemAsync(KEY);
    return cached;
  },

  async clear(): Promise<void> {
    cached = null;
    await SecureStore.deleteItemAsync(KEY);
  },
};
