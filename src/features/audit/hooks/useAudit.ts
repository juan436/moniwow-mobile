/**
 * useAudit — Hook
 *
 * @what     Provee datos de presentación para el tab Revisión (carrusel 4 páginas). Mock hasta backend.
 * @receives Ninguno.
 * @processes Retorna datos estáticos para Auditoría, Mundo Paralelo y Mis Metas y Objetivos.
 * @returns  Datos para las 4 páginas del carrusel + isLoading + error.
 */
import { colors } from '@shared/styles';
import type {
  BarChartEntry, LeakDisplay, LeakItem,
  GoalDisplay, DebtBreakdown, DistributionEntry,
} from '../types';

const MOCK_BAR_CHART: BarChartEntry[] = [
  { month: 'Ene', amount: 1200 },
  { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 1400 },
  { month: 'Abr', amount: 2100 },
  { month: 'May', amount: 1650 },
  { month: 'Jun', amount: 950 },
];

const MOCK_FUGAS: LeakDisplay[] = [
  {
    id: 'f1', iconName: 'local-cafe', name: 'Café y Bebidas Fuera de Casa', amount: 120,
    items: [
      { description: 'Starbucks Oat Latte', amount: 4.50, date: '14 Jun' },
      { description: 'Costa Coffee Frappuccino', amount: 5.80, date: '13 Jun' },
      { description: 'Café del Centro', amount: 3.20, date: '11 Jun' },
      { description: 'Té Chai Cafetería Norte', amount: 2.90, date: '09 Jun' },
      { description: 'Starbucks Cold Brew', amount: 5.10, date: '08 Jun' },
      { description: 'Café Americano aeropuerto', amount: 4.00, date: '06 Jun' },
      { description: 'Jugo natural esquina', amount: 2.50, date: '04 Jun' },
      { description: 'Café Illy oficina externa', amount: 3.80, date: '02 Jun' },
    ] satisfies LeakItem[],
  },
  {
    id: 'f2', iconName: 'directions-car', name: 'Uber y Transporte Privado', amount: 85,
    items: [
      { description: 'Uber aeropuerto → casa', amount: 22.00, date: '13 Jun' },
      { description: 'Bolt centro → trabajo', amount: 8.50, date: '11 Jun' },
      { description: 'Uber salida nocturna', amount: 14.00, date: '09 Jun' },
      { description: 'Cabify reunión cliente', amount: 11.00, date: '07 Jun' },
      { description: 'Bolt regreso tarde', amount: 9.20, date: '05 Jun' },
      { description: 'Uber médico urgente', amount: 18.00, date: '03 Jun' },
    ] satisfies LeakItem[],
  },
  {
    id: 'f3', iconName: 'fastfood', name: 'Comida Rápida y Delivery', amount: 200,
    items: [
      { description: 'Uber Eats Thai Express', amount: 24.00, date: '14 Jun' },
      { description: 'Pizza Hut Familiar', amount: 32.00, date: '11 Jun' },
      { description: "McDonald's Delivery", amount: 18.90, date: '09 Jun' },
      { description: 'KFC Combo Familiar', amount: 12.50, date: '05 Jun' },
    ] satisfies LeakItem[],
  },
  {
    id: 'f4', iconName: 'receipt', name: 'Propinas y Comisiones', amount: 40,
    items: [
      { description: 'Propina restaurante', amount: 8.00, date: '13 Jun' },
      { description: 'Comisión transferencia banco', amount: 5.50, date: '10 Jun' },
      { description: 'Propina delivery', amount: 3.00, date: '08 Jun' },
    ] satisfies LeakItem[],
  },
  {
    id: 'f5', iconName: 'cookie', name: 'Snacks y Golosinas', amount: 55,
    items: [
      { description: 'Snacks noche Oxxo', amount: 6.30, date: '14 Jun' },
      { description: 'Chocolates supermercado', amount: 4.80, date: '12 Jun' },
      { description: 'Pringles kiosco', amount: 3.50, date: '09 Jun' },
    ] satisfies LeakItem[],
  },
  {
    id: 'f6', iconName: 'sports-bar', name: 'Salidas Nocturnas', amount: 90,
    items: [
      { description: 'Bar La Zona — copas', amount: 28.00, date: '14 Jun' },
      { description: 'Club Rooftop entrada', amount: 15.00, date: '07 Jun' },
      { description: 'Uber de regreso', amount: 12.00, date: '07 Jun' },
    ] satisfies LeakItem[],
  },
];

const MOCK_DEBT_BREAKDOWN: DebtBreakdown[] = [
  { id: 'd1', label: 'Tarjeta Visa Platino Banco Nacional', amount: 400, progress: 45 },
  { id: 'd2', label: 'Préstamo Personal Banco Central', amount: 1100, progress: 70 },
  { id: 'd3', label: 'Deuda Familiar Préstamo Mamá', amount: 300, progress: 25 },
  { id: 'd4', label: 'Tarjeta MasterCard Black', amount: 620, progress: 15 },
  { id: 'd5', label: 'Cuotas Laptop 12 meses', amount: 180, progress: 58 },
];

const MOCK_GOALS: GoalDisplay[] = [
  { id: 'g1', name: 'Viaje de Ensueño a Japón y Tailandia', emoji: '✈️', current: 1200, target: 5000, progress: 24 },
  { id: 'g2', name: 'Carro Nuevo Honda Civic 2026', emoji: '🚗', current: 8000, target: 15000, progress: 53 },
  { id: 'g3', name: 'Fondo Inicial para Casa Propia', emoji: '🏠', current: 25000, target: 50000, progress: 50 },
  { id: 'g4', name: 'MacBook Pro M4 para Trabajo', emoji: '💻', current: 600, target: 2500, progress: 24 },
  { id: 'g5', name: 'Bicicleta Eléctrica Trek', emoji: '🚲', current: 320, target: 1800, progress: 18 },
  { id: 'g6', name: 'Curso Certificación Cloud AWS', emoji: '📚', current: 150, target: 800, progress: 19 },
];

const MOCK_DISTRIBUTION: DistributionEntry[] = [
  { id: 'dist1', label: 'Hogar', pct: 38, color: colors.emeraldSuccess },
  { id: 'dist2', label: 'Hormiga', pct: 18, color: colors.alertOrange },
  { id: 'dist3', label: 'Deudas', pct: 24, color: colors.tertiary },
  { id: 'dist4', label: 'Ahorro', pct: 12, color: colors.goldDreams },
  { id: 'dist5', label: 'Salud & Médico', pct: 5, color: colors.secondary },
  { id: 'dist6', label: 'Otros', pct: 3, color: colors.slateGray },
];

export function useAudit() {
  return {
    barChart:      MOCK_BAR_CHART,
    fugas:         MOCK_FUGAS,
    distribution:  MOCK_DISTRIBUTION,
    patrimonio:    7650.00,
    deudaTotal:    2600.00,
    deudaPagada:   38,
    deudaBreakdown: MOCK_DEBT_BREAKDOWN,
    goalProgress:  42,
    goalsTotal:    39800,
    metaGlobal:    82500,
    goals:         MOCK_GOALS,
    isLoading: false,
    error: null as string | null,
  };
}
