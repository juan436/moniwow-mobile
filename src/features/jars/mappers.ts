/**
 * mappers — Jars Feature
 *
 * @what     Entidad `Jar` (dominio) → `JarDisplay` (presentación). La BD guarda el dato; el balance,
 *           el color y el % se DERIVAN — no se almacenan (C4).
 * @receives jar: Jar · balance: number — la suma del libro para esa jarra, calculada por
 *           `ComputeJarBalances`. Se pasa desde fuera para que haya UNA regla y no dos.
 * @processes Color/ícono vía `toJarPresentation` (shared). `progress` = NIVEL de la jarra
 *           (`balance / targetAmount`): cuánto te QUEDA, no cuánto gastaste — coherente con la
 *           metáfora de la card (FB-011: la jarra se llena con tu dinero). Redondeado aquí: la
 *           entidad devuelve el valor exacto, el redondeo es presentación.
 *           Las jarras sin presupuesto no tienen barra (undefined), no un 0 que miente.
 * @returns  JarDisplay
 */
import { toJarPresentation } from '@shared/styles';
import { Jar } from '@core/entities/Jar';
import type { JarDisplay } from './types';

export function toJarDisplay(jar: Jar, balance: number): JarDisplay {
  const withBalance = new Jar({ ...jar, balance });

  return {
    ...toJarPresentation(jar),
    id: jar.id,
    type: jar.type,
    balance,
    isBlindado: jar.isBlindado,
    targetAmount: jar.targetAmount,
    progress: withBalance.hasBudget() ? Math.round(withBalance.budgetPercent()) : undefined,
  };
}
