/**
 * jarFillModel — Utilidad
 *
 * @what     Genera la posición de monedas y billetes que llenan el frasco de una jarra hasta su
 *           nivel. Puro y determinista: mismo `seedStr` → mismo relleno (no parpadea entre renders).
 * @receives seedStr: string (el `jar.id`) · level: number 0..1 (progreso hacia la meta).
 * @processes RNG sembrado por hash del id. Base densa de monedas en filas escalonadas que tapan el
 *           vidrio, y billetes encima repartidos por toda la altura del relleno. Geometría en
 *           coordenadas del viewBox de `JarVessel` (`JAR_GEO`).
 * @returns  JarFill — { coins: Coin[]; bills: Bill[] }.
 */
export type Coin = { cx: number; cy: number };
export type Bill = { x: number; y: number; rot: number; dark: boolean };
export type JarFill = { coins: Coin[]; bills: Bill[] };

/** Cuerpo del frasco en coordenadas del viewBox (compartido con JarVessel). */
export const JAR_GEO = {
  viewW: 140,
  viewH: 176,
  body: { x: 22, y: 34, w: 96, h: 126, rx: 28 },
} as const;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildJarFill(seedStr: string, level: number): JarFill {
  const { body } = JAR_GEO;
  const bottom = body.y + body.h;
  const lvl = Math.max(0, Math.min(1, level));
  const fillTop = bottom - lvl * body.h;
  const fillH = bottom - fillTop;
  const r = rng(hashSeed(seedStr));

  // Base de monedas: filas escalonadas que tapan los huecos entre billetes. Densidad moderada
  // (una elipse por moneda en la vista) — cada nodo SVG cuesta, y los billetes cubren casi todo.
  const coins: Coin[] = [];
  let row = 0;
  for (let y = bottom - 6; y > fillTop + 3; y -= 9.5, row += 1) {
    const off = (row % 2) * 13;
    for (let c = 0; c < 4; c += 1) {
      const cx = 26 + off + c * 26 + (r() - 0.5) * 5;
      const cy = y - (r() - 0.5) * 2.6;
      if (cx < 25 || cx > 115 || cy < fillTop + 3) continue;
      coins.push({ cx, cy });
    }
  }

  // Billetes verdes: encima de las monedas, apilados por toda la altura del relleno.
  const bills: Bill[] = [];
  const nbills = Math.max(5, Math.round(lvl * 18));
  const step = Math.max(5, (fillH - 8) / nbills);
  for (let k = 0; k < nbills; k += 1) {
    const by = bottom - 11 - k * step - r() * 3;
    if (by < fillTop + 8) break;
    bills.push({ x: 28 + r() * 54, y: by, rot: -22 + r() * 44, dark: r() > 0.5 });
  }

  return { coins, bills };
}
