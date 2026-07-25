/**
 * config — Infra (HTTP)
 *
 * @what     Dónde vive la API.
 * @receives —
 * @processes Lee `EXPO_PUBLIC_API_URL` del `.env`; si no está, cae a la IP de la PC en la red local.
 * @returns  API_URL
 *
 * **No puede ser `localhost`.** Para el teléfono, `localhost` es el teléfono mismo — la petición
 * nunca sale del aparato. Tiene que ser la IP de la PC dentro de la red, y las dos en el mismo WiFi.
 *
 * Por eso la API escucha en `0.0.0.0` y no en `127.0.0.1`.
 *
 * ⚠️ Una VPN activa en la PC (ProtonVPN, por ejemplo) puede impedir que el teléfono la alcance,
 * aunque estén en la misma red. Si nada responde, es lo primero que hay que descartar.
 *
 * Cuando la API se despliegue de verdad, esto pasa a ser su dominio — y el `.env` es el único
 * archivo que cambia.
 */

/** IP de la PC en la red local. Cambia si el router reparte otra: verificar con `ipconfig`. */
const LAN_FALLBACK = 'http://192.168.1.2:3000';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? LAN_FALLBACK;
