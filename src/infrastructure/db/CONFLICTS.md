# Seeds JSON — Conflictos y valores sintetizados

> **DECISIÓN 2026-07-09 (usuario):** los datos actuales son de PRUEBA, no reales. No hay versión
> "correcta" que preservar. Regla: **una colección por concepto; Revisión/Dashboard/totales se
> DERIVAN de ella; cero listas paralelas.** C1–C6 dejan de ser decisiones → se resuelven derivando
> de la fuente única. El contenido exacto de los seeds es placeholder; se unifica con criterio libre.
> Nota deudas: "cuota del mes" (agenda 655) y "saldo total" (revisión 2.600) son dos VISTAS de la
> misma colección `debts` (`Debt.cuotaAmount()` vs `remainingAmount()`), no un conflicto.


> BD simulada = fuente de verdad. Estos seeds se sembraron con los valores **actuales de cada
> pantalla**. Donde dos pantallas mostraban lo mismo con datos distintos, hubo que **elegir uno**;
> ese es un conflicto que necesita tu decisión ANTES de wirear la pantalla afectada (paso 6).
> Nada aquí toca la app todavía — los JSON no se importan aún.

---

## Conflictos que requieren decisión (reconciliación)

### C1 · Total de Metas (el del mapa) — ✅ RESUELTO 2026-07-09
- **Estructura:** `poolTotal` = `jar('goals').balance` (GUARDADO) · `asignado` = Σ `goal.currentAmount` (GUARDADO) · `disponible` = pool − asignado (DERIVADO). El pozo sin asignar es concepto real. Seed: jarra `goals` balance → 50000 (el 3000 era placeholder). Wireado en `useGoals` (paso 6b).

- `goals.json` = 8 metas de `useGoals` (tab Metas). Suma de `currentAmount` = **41.600**.
- Descartado: `useAudit` tenía **6 metas distintas** (Honda Civic, AWS…) con total `goalsTotal=39.800`.
- Además: jarra `goals` tiene `balance=3000` y `useGoals.poolTotal=50000`.
- **Decisión:** ¿el total de Metas es la suma de las metas (41.600), el pozo (50.000) o el balance de la jarra (3.000)? Al derivar, Revisión y Dashboard mostrarán el MISMO número → cambia lo que hoy ves en alguna de las dos.

### C2 · Total de Deudas — ✅ RESUELTO 2026-07-14
- **Una sola colección: `debts`.** Una deuda con cuotas pendientes YA ES el compromiso mensual de la agenda: su `cuotaAmount()` en su `dueDate`. No se siembra dos veces.
- Las 4 deudas de `pendingItems.json` (d1..d4) **borradas**. La agenda las deriva de `debts` vía `toDebtAgendaItem`.
- Pagar una cuota escribe el `gasto` **y** sube `paidCuotas` (`PayDebtCuota`) → la barra de Revisión avanza sola.

### C3 · Movimientos que son transferencias — ✅ RESUELTO 2026-07-14
- Una transferencia es **UNA** fila: `type:'transferencia'` + `jarId` (origen) + `toJarId` (destino). Nunca dos.
- `TransferFunds` creaba dos (una por jarra): con el balance derivado habría restado de ambas y el dinero se evaporaba. Corregido.
- Los seeds se rehicieron enteros (ver C4), así que ya nacen bien: el reparto mensual del sueldo son transferencias reales.

### C4 · Balance de jarra: ¿guardado o derivado? — ✅ RESUELTO 2026-07-14: **DERIVADO**
- `jars.json` **pierde el campo `balance`**. `jar.balance = Σ transacciones de la jarra` (`core/use-cases/ComputeJarBalances`).
- La derivación vive en `JsonJarRepository` (recibe `ITransactionRepository`): así TODO el que lee jarras hereda el número bueno. En Mongo esto es un `$group` sobre `transactions`.
- Ningún use-case escribe balance ya. `WithdrawFromGoal` ni siquiera creaba transacción → el dinero se habría evaporado. Corregido.
- **Los seeds no respaldaban nada**: al derivar salían 9 jarras a 0, Hogar −985, Metas 0, patrimonio 62.855 → 1.592. Se rehizo `transactions.json`: **173 tx, 6 meses reales (feb–jul 2026)**, asiento de apertura incluido.
- Resultado: ninguna jarra negativa · Metas = 50.000 (respeta C1) · **patrimonio 59.564,62 = ingresos − gastos**. Cuadra solo — si no cuadrara, el libro mentiría.

### C5 · Próximos vencimientos del Dashboard
- `useDashboard.MOCK_UPCOMING` era lista **aparte** (6 ítems: "Electricidad CFE Bimestral", "Renta Departamento"…), distinta de la agenda.
- No se sembró: debe **derivarse de `pendingItems`**. Al wirear, el Dashboard mostrará los compromisos de la agenda, no esos 6 nombres. **Decisión:** confirmar que es correcto.

### C6 · Fugas / Distribución / totales de Revisión
- `useAudit` fugas (6 categorías), distribution, barChart, `deudaPagada`, `goalProgress`, `metaGlobal=82500` siguen **hardcodeados**, no sembrados.
- Objetivo: fugas = derivar de transacciones con `isHormiga`; totales = derivar. **Decisión posterior** (feature Revisión, paso 6 tardío).

---

## Valores sintetizados (no existían en el mock, inventados para completar la entidad)

- **`pendingItems.jarId`**: la agenda no tenía jarId. Asignado por heurística (Alquiler→hogar, Netflix→ocio, ingresos→libre…). **Revisar antes de confiar en él.**
- **Fechas**: el mock usaba etiquetas relativas (`"Hace 2h"`, `"Ayer 14:30"`) y `day:number`. Convertidas a `Date` ISO:
  - relativas → ancladas a 2026-07-08/09; explícitas ("24 May") → 2026; agenda `day N` → `2026-07-N`.
- **`debts`**: el breakdown solo traía label/amount/progress. `cuotas`/`paidCuotas`/`dueDate`/`createdAt`/`origin` sintetizados. `progress` descartado (se deriva de cuotas).
- **`workspaceId="ws1"` / `userId="u1"`**: no existían en los mocks; un solo workspace/usuario sembrado.

---

## Duplicados eliminados al normalizar

- `INITIAL_RECURRENTES` (8) duplicaba un subconjunto de la agenda → `pendingItems` es la única fuente (con `isRecurring:true`). Divergencias menores descartadas (r6 Bono 625 vs agenda 625.50; r3 "Suscripción Comida" no estaba en agenda).
- Colores/`iconBg`/`iconColor`/`iconName`/`emoji` NO se sembraron: son presentación. El mapper (paso 5) recalcula ícono y color desde el theme según jarra/tipo.
- Totales precalculados de la agenda (`totalGastos`/`totalIngresos`/`totalDeudas`) descartados: se derivan de `pendingItems`.

---

*Fuente: [[planes/consolidacion-modelo-datos]] · paso 3 · 2026-07-09*
