# MoniWow — App Móvil

App de administración financiera hogar/personal. React Native + Expo, `StyleSheet.create()` puro (sin NativeWind/Tailwind).

---

## Requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Node.js | 20.x LTS | Expo 54 no soporta SDK 55/56 en Play Store todavía |
| pnpm | última | Gestor de paquetes del proyecto — **no usar npm/yarn** |
| Expo Go o Development Build | — | Para probar en el celular (ver abajo) |

---

## Instalación

```bash
cd dev/mobile
pnpm install
```

pnpm ya viene configurado en este repo (`.npmrc`) para que Metro encuentre todo en un solo `node_modules` — no hace falta tocar nada más.

---

## Correr en local

```bash
pnpm expo start
```

Escaneá el QR con la app **Expo Go** (Android/iOS) desde el celular conectado a la misma red WiFi. Los cambios de código JS se reflejan al instante (live reload).

Otros comandos disponibles:

```bash
pnpm android   # abre en emulador/dispositivo Android
pnpm ios       # abre en simulador/dispositivo iOS (requiere macOS)
pnpm web       # abre en navegador (experimental, no es el target principal)
```

---

## ¿Cuándo hace falta un build nativo (EAS)?

Expo Go solo sirve para JS puro. Si tocás algo nativo, hace falta un build:

| Cambio | ¿EAS Build? |
|---|---|
| Pantalla, componente, estilo, lógica | ❌ No — `pnpm expo start` alcanza |
| Librería nueva con código nativo | ✅ Sí |
| `app.json` (plugins, permisos, nombre) | ✅ Sí |
| Actualizar el SDK de Expo | ✅ Sí |

```bash
eas build --profile development --platform android
```

Tarda ~12 min, entrega un QR/link para descargar el APK. Instalás ese APK una vez en el celular, y de ahí en adelante `pnpm expo start` normal (no hace falta rebuildear por cada cambio de JS).

---

## Actualizar dependencias

Nunca a mano. Siempre:

```bash
pnpm exec expo install --fix
```

Este comando resuelve las versiones compatibles entre sí para el SDK de Expo que usa el proyecto.

---

## Estructura del proyecto

Clean Architecture por capas — ver detalle completo en el vault de Obsidian del proyecto (`arquitectura/clean_architecture.md`, `arquitectura/code_rules.md`):

```
src/
├── app/        Expo Router — solo navegación y layouts
├── features/   Un módulo por dominio (dashboard, transactions, agenda, ...)
├── shared/     Componentes, hooks, estilos y utils reutilizables
└── core/       Entidades + use-cases + ports — TypeScript puro, sin React
```

---

## Documentación y decisiones de arquitectura

Este repo no tiene la fuente de verdad de decisiones de diseño/arquitectura — vive en el vault de Obsidian del proyecto (`moniwow/`). Antes de tocar código, revisar ahí: `arquitectura/`, `dev/` (patrones probados: modal vs page, teclado, status bar, etc.) y `moni-master-planes.md` para el estado actual de cada módulo.
