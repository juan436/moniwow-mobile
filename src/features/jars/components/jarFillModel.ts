/**
 * jarFillModel — Utilidad
 *
 * @what     Genera el relleno de monedas y billetes del frasco de una jarra, **ya serializado como
 *           cadenas `d` de `Path`**: una por color, no un nodo por moneda (FB-012).
 * @receives seedStr: string (el `jar.id`) · level: number 0..1 (progreso hacia la meta).
 * @processes **Estratos alternos**: el frasco se llena por capas, como un ahorro real hecho en el
 *           tiempo — monedas, encima billetes, encima monedas… Cada capa se apoya en la de abajo, así
 *           que hay verde y oro a CUALQUIER nivel y el reparto queda ~50/50 en área. Los billetes van
 *           de a pares lado a lado (uno solo no cubre el ancho) y casi horizontales; las filas de
 *           monedas se escalonan y curvan para no leer como rejilla. Cerca de la superficie las capas
 *           se acortan en vez de cortarse en seco.
 *           **Rendimiento**: RNG sembrado por hash del id → determinista (no parpadea entre renders).
 *           Cada pieza es un trazo dentro de una cadena compartida: el `M` salta sin pintar, así que
 *           figuras sueltas caben en un solo nodo. Eran ~222 nodos por jarra (8 jarras ≈ 1.800); ahora
 *           5. El `level` se **cuantiza a pasos del 2%** y se **cachea** por `id:nivel`.
 * @returns  JarFill — 5 cadenas `d` (monedas, brillos, billetes claros/oscuros, marco interior).
 */
export type JarFill = {
  coinsD: string;
  shinesD: string;
  billsLightD: string;
  billsDarkD: string;
  billsInnerD: string;
};

/** Cuerpo del frasco en coordenadas del viewBox (compartido con JarVessel). */
export const JAR_GEO = {
  viewW: 140,
  viewH: 176,
  body: { x: 22, y: 34, w: 96, h: 126, rx: 28 },
} as const;

const CX = 70; // eje del frasco
const WALL_L = 25;
const WALL_R = 115;
const COIN_RX = 9; // radios de la moneda en la vista
const COIN_RY = 6.2;
const COIN_ROWS = 2; // filas por estrato de monedas
const COIN_STEP = 7.5; // se solapan: sin solape se ve el vidrio entre filas
const BILL_HW = 19;
const BILL_HH = 9.5;
const BILL_STEP = 11;
const SHORT_BAND = 26; // queda poco sitio → el estrato se acorta a una fila
const CURVE = 2.5; // las filas de monedas ceden hacia las paredes (no son reglas rectas)
const LEVEL_STEPS = 50; // cuantización: 1/50 = pasos del 2%
const CACHE_MAX = 400;
const cache = new Map<string, JarFill>(); // memoria por `id:nivel`

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

/** 2 decimales: la cadena `d` se serializa a nativo, cada carácter de más se paga. */
function r2(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

/** Elipse suelta como trazo: dos semiarcos y cierre. */
function ellipseD(cx: number, cy: number, rx: number, ry: number): string {
  return `M${r2(cx - rx)} ${r2(cy)}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
}

/** Rectángulo YA rotado: se calculan las 4 esquinas, no se delega en `rotation` (un nodo menos). */
function rectD(cx: number, cy: number, hw: number, hh: number, rot: number): string {
  const rad = (rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const pt = (x: number, y: number) => `${r2(cx + x * cos - y * sin)} ${r2(cy + x * sin + y * cos)}`;
  return `M${pt(-hw, -hh)}L${pt(hw, -hh)}L${pt(hw, hh)}L${pt(-hw, hh)}Z`;
}

function compute(seedStr: string, lvl: number): JarFill {
  const { body } = JAR_GEO;
  const bottom = body.y + body.h;
  const fillTop = bottom - lvl * body.h;
  const r = rng(hashSeed(seedStr));

  let coinsD = '';
  let shinesD = '';
  let billsLightD = '';
  let billsDarkD = '';
  let billsInnerD = '';
  let y = bottom - 5; // cursor: sube desde el fondo del frasco
  let band = 0;
  let row = 0;

  while (y > fillTop + COIN_RY) {
    if (band % 2 === 0) {
      // Estrato de monedas. Si queda poco espacio se acorta a una fila en vez de desbordar.
      const rows = y - fillTop < SHORT_BAND ? 1 : COIN_ROWS;
      for (let k = 0; k < rows && y > fillTop + COIN_RY; k += 1, y -= COIN_STEP, row += 1) {
        const off = (row % 2) * 10.5; // filas escalonadas: tapan los huecos de la de abajo
        for (let c = 0; c < 5; c += 1) {
          const cx = WALL_L + off + c * 21 + (r() - 0.5) * 4;
          if (cx < WALL_L || cx > WALL_R) continue;
          const t = (cx - CX) / 48;
          const cy = y + CURVE * t * t - (r() - 0.5) * 2;
          if (cy - COIN_RY < fillTop) continue;
          coinsD += ellipseD(cx, cy, COIN_RX, COIN_RY);
          shinesD += ellipseD(cx, cy, 5.5, 3.4);
        }
      }
    } else {
      // Estrato de billetes: un par lado a lado, uno solo no cubre el ancho del frasco.
      if (y - 4 - BILL_HH - 2 < fillTop) break; // no cabe entero → la pila termina en monedas
      for (let s = -1; s <= 1; s += 2) {
        const bx = CX + s * BILL_HW + (r() - 0.5) * 8;
        const by = y - 4 + (r() - 0.5) * 3;
        const rot = -9 + r() * 18; // reposan planos, no clavados de canto
        const d = rectD(bx, by, BILL_HW, BILL_HH, rot);
        if (r() > 0.5) billsDarkD += d;
        else billsLightD += d;
        billsInnerD += rectD(bx, by, 15, 6, rot);
      }
      y -= BILL_STEP;
    }
    band += 1;
  }

  return { coinsD, shinesD, billsLightD, billsDarkD, billsInnerD };
}

export function buildJarFill(seedStr: string, level: number): JarFill {
  const clamped = Math.max(0, Math.min(1, level));
  const lvl = Math.round(clamped * LEVEL_STEPS) / LEVEL_STEPS;
  const key = `${seedStr}:${lvl}`;

  const hit = cache.get(key);
  if (hit) return hit;

  const fill = compute(seedStr, lvl);
  // Tope simple: pocas jarras × 51 niveles no llega ni cerca, pero un Map que solo crece es una fuga.
  if (cache.size >= CACHE_MAX) cache.clear();
  cache.set(key, fill);
  return fill;
}
