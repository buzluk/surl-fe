import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const icons: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export default function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.exiting ? ' exiting' : ''}`}
          role="alert"
        >
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
