import { useEffect, useRef } from 'react';
import { Bell, CalendarDays, Church, Megaphone, BellRing, X } from 'lucide-react';
import type { AppNotification, NotificationKind } from '../data/notificationsData';

interface NotificationPopupProps {
  notification: AppNotification | null;
  onClose: () => void;
  onConfirm: () => void;
}

const KIND_STYLES: Record<NotificationKind, { icon: typeof Bell; box: string; label: string }> = {
  evento: { icon: CalendarDays, box: 'bg-blue-50 text-[#0066cc]', label: 'Evento' },
  culto: { icon: Church, box: 'bg-amber-50 text-amber-600', label: 'Culto' },
  aviso: { icon: BellRing, box: 'bg-rose-50 text-rose-600', label: 'Aviso' },
  comunicado: { icon: Megaphone, box: 'bg-emerald-50 text-emerald-600', label: 'Comunicado' },
};

/**
 * Popup com o conteúdo da notificação escolhida no menu dropdown da foto de perfil.
 * Tem os botões "Cancelar" (fecha sem confirmar) e "Ok" (fecha e marca como lida).
 */
export default function NotificationPopup({ notification, onClose, onConfirm }: NotificationPopupProps) {
  const okButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!notification) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => okButtonRef.current?.focus(), 30);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [notification, onClose]);

  if (!notification) return null;

  const style = KIND_STYLES[notification.kind];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-popup-title"
        className="flex w-full max-w-[26rem] flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl sm:max-w-md max-h-[min(86vh,44rem)] animate-in zoom-in-95 duration-200"
      >
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E2E8F0] px-5 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${style.box}`}>
              <Icon className="h-4 w-4 stroke-[2.2]" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{style.label}</p>
              <h3 id="notification-popup-title" className="text-xs font-bold text-slate-900">
                Notificação
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:text-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo da notificação */}
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-5 pb-4 pt-4">
          <h4 className="text-sm font-bold leading-snug text-slate-900">{notification.title}</h4>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{notification.time}</p>
          <p className="text-xs leading-relaxed text-slate-600">{notification.message}</p>
          {notification.read && (
            <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Já lida
            </p>
          )}
        </div>

        {/* Botões: Cancelar e Ok */}
        <div className="flex shrink-0 gap-2.5 border-t border-[#E2E8F0] px-5 py-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            ref={okButtonRef}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#0066cc] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0055aa] cursor-pointer"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
