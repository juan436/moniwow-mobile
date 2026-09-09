# MoniWow — App móvil

App de finanzas personales/hogar basada en el método de jarras (envelope budgeting). **React Native + Expo**, `StyleSheet.create()` puro (sin NativeWind/Tailwind).

El backend está en [`api-moniwow`](https://github.com/juan436/api-moniwow).

---

## Arquitectura

Clean Architecture por capas, espejada con el backend. La regla de dependencia: `src/core/` es **TypeScript puro, sin React** — entidades, casos de uso y puertos que no saben que existe una UI.

```
src/
  app/         Expo Router — solo navegación y layouts ((tabs), (modals), rutas de detalle)
  core/        entities + use-cases + ports + utils — TS puro, sin React
  features/    un módulo por dominio: dashboard, jars, transactions, goals, planner,
               auth, profile, settings, audit, feedback
  infrastructure/http/   adaptadores que implementan los ports contra la API real
  shared/      components, hooks, context, styles, utils reutilizables
```

Los **ports** del `core` son el contrato con el backend: cambiar de fuente de datos es reescribir `infrastructure/http/`, sin tocar `core/` ni las features.

### Decisiones que definen la app

- **Nunca se almacena lo que se puede calcular.** Saldo de jarra, patrimonio, progreso de meta: todo se deriva del libro de movimientos, no se guarda como estado.
- **Capacidades como fuente única.** Los permisos por tipo de jarra (eliminar, renombrar, editar presupuesto, blindar) son una función pura consultada por dos lados: la UI la usa para deshabilitar controles (buena UX) y el caso de uso la usa para rechazar la operación si igual llega (seguridad real). Un solo lugar para cambiar la matriz.
- **Gestos sobre el hilo nativo.** El visor de comprobantes con zoom/pan usa `react-native-gesture-handler` + `react-native-reanimated`, tras descartar `PanResponder` y el manejo manual de eventos táctiles — decisión de rendimiento.
- **Estado con Zustand**, navegación con **Expo Router**, tokens en **`expo-secure-store`**.

---

## Requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Node.js | 20.x LTS | El SDK de Expo del proyecto no soporta versiones más nuevas todavía |
| pnpm | última | Gestor del proyecto — **no usar npm/yarn** |
| Expo Go o Development Build | — | Para probar en el celular |

---

## Instalación y desarrollo

```bash
pnpm install
pnpm expo start
```

Escaneá el QR con **Expo Go** (Android/iOS) desde un celular en la misma red WiFi. Los cambios de JS se reflejan al instante.

```bash
pnpm android   # emulador/dispositivo Android
pnpm ios       # simulador/dispositivo iOS (requiere macOS)
pnpm web       # navegador (experimental)
```

### ¿Cuándo hace falta un build nativo (EAS)?

Expo Go solo corre JS puro.

| Cambio | ¿EAS Build? |
|---|---|
| Pantalla, componente, estilo, lógica | ❌ No — `pnpm expo start` alcanza |
| Librería nueva con código nativo | ✅ Sí |
| `app.json` (plugins, permisos, nombre) | ✅ Sí |
| Actualizar el SDK de Expo | ✅ Sí |

```bash
eas build --profile development --platform android
```

Entrega un APK que se instala **una vez**; de ahí en adelante `pnpm expo start` normal.

### Actualizar dependencias

Nunca a mano:

```bash
pnpm exec expo install --fix
```

Resuelve las versiones compatibles con el SDK de Expo del proyecto.

---

## Forma de trabajo

- **Contrato con el backend definido antes de construir**: ambos lados espejan Clean Architecture; las entidades del `core` están **duplicadas** entre este repo y `api-moniwow` (se descartó monorepo) — se modifican en ambos lados en el **mismo commit**.
- Commits en Conventional Commits con scope (`feat(feedback):`, `fix:`, `chore(infrastructure):`). Rama `main`.
- Las decisiones de arquitectura y los patrones probados (modal vs. page, teclado, status bar, gestos) viven en el vault de Obsidian del proyecto (`moniwow/`) como ADRs, no en el repo.
