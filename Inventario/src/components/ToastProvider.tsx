import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ToastContext, type ToastData, type ToastTipo } from '../context/toastContext';

interface ToastItem extends ToastData {
  id: number;
  saliendo: boolean;
}

const DURACION_MS = 4000;

const ICONOS: Record<ToastTipo, ReactNode> = {
  exito: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  editado: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  eliminado: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  aviso: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v5M12 17h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
};

let contador = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const cerrar = useCallback((id: number) => {
    // Primero animamos la salida, luego lo quitamos del DOM
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, saliendo: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  }, []);

  const notificar = useCallback((toast: ToastData) => {
    const id = ++contador;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id, saliendo: false }]);
  }, []);

  const valor = useMemo(() => ({ notificar }), [notificar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast--${t.tipo} ${t.saliendo ? 'toast--out' : ''}`}
            role="status"
          >
            <div className="toast__icon">{ICONOS[t.tipo]}</div>
            <div className="toast__body">
              <strong className="toast__title">{t.titulo}</strong>
              {t.mensaje && <span className="toast__msg">{t.mensaje}</span>}
            </div>
            <button className="toast__close" onClick={() => cerrar(t.id)} aria-label="Cerrar notificación">
              ×
            </button>
            <span
              className="toast__progress"
              style={{ animationDuration: `${DURACION_MS}ms` }}
              onAnimationEnd={() => cerrar(t.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
