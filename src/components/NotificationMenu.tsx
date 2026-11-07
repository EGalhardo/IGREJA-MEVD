import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CalendarDays, Church, Megaphone, BellRing, X } from 'lucide-react';
import type { AppNotification, NotificationKind } from '../data/notificationsData';

interface NotificationMenuProps {
  notifications: AppNotification[];
  onSelect: (notification: AppNotification) => void;
  onClose: () => void;
  /** Posição (fixed) calculada a partir da foto de perfil */
  style?: CSSProperties;
}

/** Ícone + cores por tipo de notificação */
const KIND_STYLES: Record<NotificationKind, { icon: typeof Bell; box: string }> = {
  evento: { icon: CalendarDays, box: 'bg-blue-50 text-[#0066cc]' },
  culto: { icon: Church, box: 'bg-amber-50 text-amber-600' },
  aviso: { icon: BellRing, box: 'bg-rose-50 text-rose-600' },
  comunicado: { icon: Megaphone, box: 'bg-emerald-50 text-emerald-600' },
};

export default function NotificationMenu({ notifications, onSelect, onClose, style }: NotificationMenuProps) {
  const unread = notifications.filter((notification) => !notification.read).length;

  const content = (
    <div
      data-notification-menu="true"
      role="menu"
      aria-label="Lista de notificações"
      style={style}
      className="fixed z-[80] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Cabeçalho do menu */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#0066cc] stroke-[2.2]" />
          <h3 className="text-xs font-bold text-slate-900">Notificações</h3>
          {/* Mesmo número do badge da foto de perfil (apenas não lidas) */}
          {unread > 0 && (
            <span
              title={`${unread} notificações não lidas`}
              className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
            >
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar notificações"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
        >
          <X className="h-3.5 w-3.5 stroke-[2.2]" />
        </button>
      </div>

      {/* Lista de todas as notificações */}
      <div className="max-h-[min(58vh,24rem)] overflow-y-auto overscroll-contain divide-y divide-slate-100">
        {notifications.map((notification) => {
          const style = KIND_STYLES[notification.kind];
          const Icon = style.icon;

          return (
            <button
              key={notification.id}
              role="menuitem"
              onClick={() => onSelect(notification)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 active:bg-slate-100 cursor-pointer ${
                notification.read ? '' : 'bg-blue-50/40'
              }`}
            >
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.box}`}>
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold leading-snug text-slate-900">
                  {notification.title}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                  {notification.message}
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {notification.time}
                </span>
              </span>

              {!notification.read && (
                <span aria-label="Não lida" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Rodapé informativo */}
      <p className="border-t border-[#E2E8F0] bg-slate-50/80 px-4 py-2 text-[10px] font-semibold text-slate-500">
        {unread > 0
          ? `${unread} não lida(s) de ${notifications.length} • toque para ver os detalhes`
          : `Todas as ${notifications.length} notificações lidas`}
      </p>
    </div>
  );

  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}
