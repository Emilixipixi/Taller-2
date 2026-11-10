import { createContext } from 'react';

export type ToastTipo = 'exito' | 'editado' | 'eliminado' | 'error' | 'aviso';

export interface ToastData {
  tipo: ToastTipo;
  titulo: string;
  mensaje?: string;
}

export interface ToastContextValue {
  notificar: (toast: ToastData) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
