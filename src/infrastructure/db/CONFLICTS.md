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

### C2 · Total de Deudas
- `debts.json` = 5 deudas de `useAudit` (suma **2.600**).
- `pendingItems.json` conserva las 4 deudas de la agenda (Visa 300, Mamá 100, Auto 180, Débito 75 = **655**) porque son compromisos con fecha.
- Son listas DISTINTAS (agenda "Visa 300" vs audit "Visa Platino 400"). **Decisión:** ¿las deudas de la agenda son las mismas que las del breakdown de Revisión? Si sí, hay que fusionarlas a una sola lista.

### C3 · Movimientos que son transferencias (tx18/tx19)
- Sembrados **faithful** como `ingreso`/`gasto` (lo que muestra hoy la pantalla).
- Realmente son transferencia hacia/desde Fondo Seguridad → deberían ser `type:'transferencia'` + `toJarId`.
- **Decisión:** al corregir el tipo, el signo/etiqueta en Movimientos puede cambiar.

### C4 · Balance de jarra: ¿guardado o derivado?
- `jars.json.balance` = valor actual mostrado (p.ej. Libre 1285.50).
- Objetivo del modelo: `jar.balance = SUM(transacciones de la jarra)`. Las transacciones actuales **NO suman** esos balances.
- Suma de balances sembrados = **15.855,50**; `useAudit.patrimonio=7650`. Ninguno deriva del otro.
- **Decisión:** ¿derivamos balance/patrimonio de las transacciones (correcto, pero mueve números) o los dejamos como campo hasta tener transacciones completas?

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
