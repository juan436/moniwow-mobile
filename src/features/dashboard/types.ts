/**
 * types — Dashboard Feature
 *
 * @what Tipos de presentación internos del dashboard central. No son entidades de dominio.
 */
import type { ComponentProps } from 'react';
import type { MaterialIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

/** Un compromiso próximo: dinero que se mueve en una fecha. Puede entrar (`isIncome`) o salir. */
export type UpcomingExpense = {
  id: string;
  name: string;
  /** Frase para leer ("En 5 días"). NO se parsea: para saber si urge está `isUrgent`. */
  urgency: string;
  /** Solo lo que DEBES puede urgir. Un ingreso que llega mañana no es una alerta. */
  isUrgent: boolean;
  isIncome: boolean;
  amount: number;
  iconName: IconName;
};

export type GoalHighlight = {
  id: string;
  name: string;
  emoji: string;
  progress: number;
  current: number;
  target: number;
};
