import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import SafeImage from './SafeImage';
import NotificationMenu from './NotificationMenu';
import type { AppNotification } from '../data/notificationsData';
import { Screen, UserProfile } from '../types';

interface AppbarProps {
  currentScreen: Screen;
  isDesktopLayout: boolean;
  onBack: () => void;
  onOpenProfile: () => void;
  user: UserProfile;
  unreadCount?: number;
  notifications?: AppNotification[];
  onSelectNotification?: (notification: AppNotification) => void;
}

export default function Appbar({
  currentScreen,
  isDesktopLayout,
  onBack,
  onOpenProfile,
  user,
  unreadCount = 3,
  notifications = [],
  onSelectNotification,
}: AppbarProps) {
  // Menu dropdown das notificações (abre ao clicar na foto de perfil)
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [notifMenuPosition, setNotifMenuPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 16,
  });
  const notifWrapperRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Abre/fecha o menu, ancorando-o por baixo da foto de perfil
  const toggleNotificationMenu = () => {
    if (isNotifMenuOpen) {
      setIsNotifMenuOpen(false);
      return;
    }

    const avatarRect = avatarButtonRef.current?.getBoundingClientRect();
    if (!avatarRect) return;

    const headerRect = headerRef.current?.getBoundingClientRect();
    const panelWidth = Math.min(320, window.innerWidth - 32);
    const right = Math.max(
      8,
      Math.min(window.innerWidth - avatarRect.right, window.innerWidth - 8 - panelWidth)
    );
    // O menu abre imediatamente abaixo do appbar (nunca por cima da foto)
    const anchorBottom = Math.max(headerRect?.bottom ?? 0, avatarRect.bottom);

    setNotifMenuPosition({ top: Math.round(anchorBottom + 8), right: Math.round(right) });
    setIsNotifMenuOpen(true);
  };

  useEffect(() => {
    if (!isNotifMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      // Cliques na foto/saudação ou dentro do menu (renderizado em portal) não fecham
      if (notifWrapperRef.current?.contains(target)) return;
      if (target.closest('[data-notification-menu="true"]')) return;
      setIsNotifMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotifMenuOpen(false);
    };

    const closeMenu = () => setIsNotifMenuOpen(false);

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, [isNotifMenuOpen]);

  const handleSelectNotification = (notification: AppNotification) => {
    setIsNotifMenuOpen(false);
    onSelectNotification?.(notification);
  };
  // Saudação curta: primeiro nome do utilizador (ex.: "Oi, Edlásio")
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Início';
      case 'events':
        return 'Eventos';
      case 'event-detail':
        return 'Detalhes do Evento';
      case 'bible':
        return 'Bíblia Sagrada';
      case 'profile':
        return 'Perfil do Membro';
      case 'announcements':
        return 'Comunicados';
      default:
        return 'IGREJA MEVD';
    }
  };

  // If in desktop/tablet-landscape mode:
  if (isDesktopLayout) {
    return (
      <header ref={headerRef} className="h-[var(--desktop-header-height)] w-full bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
        {/* Left: Breadcrumbs & Current Page Title */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'home' && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              <span>Voltar</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>IGREJA MEVD</span>
              <span>/</span>
              <span className="text-slate-700 font-semibold">{getScreenTitle()}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none mt-0.5">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        {/* Right: foto de perfil (abre as notificações) + saudação (abre o perfil) */}
        <div ref={notifWrapperRef} className="relative flex shrink-0 items-center">
          <div className="flex flex-col items-center gap-1">
            <button
              ref={avatarButtonRef}
              onClick={toggleNotificationMenu}
              aria-label={`Notificações — Oi, ${firstName}`}
              aria-haspopup="menu"
              aria-expanded={isNotifMenuOpen}
              title="Ver notificações"
              className="relative block shrink-0 rounded-full transition-transform hover:scale-105 cursor-pointer"
            >
              <span className="block h-8 w-8 overflow-hidden rounded-full">
                <SafeImage
                  src={user.avatar}
                  alt={user.name}
                  fallbackSrc="/assets/aistudio/Foto_de_Perfil__1__bd7124df.png"
                  fallbackType="avatar"
                  className="w-full h-full object-cover"
                />
              </span>
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  title={`${unreadCount} notificações não lidas`}
                  className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
                >
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenProfile}
              aria-label={`Perfil — Oi, ${firstName}`}
              title="Ver Perfil"
              className="whitespace-nowrap rounded-md px-1 text-[10px] font-semibold leading-none text-slate-900 transition-colors hover:text-[#0066cc] cursor-pointer"
            >
              Oi, {firstName}
            </button>
          </div>

          {isNotifMenuOpen && (
            <NotificationMenu
              notifications={notifications}
              onSelect={handleSelectNotification}
              onClose={() => setIsNotifMenuOpen(false)}
              style={{ top: notifMenuPosition.top, right: notifMenuPosition.right }}
            />
          )}
        </div>
      </header>
    );
  }

  // Mobile & Tablet Vertical Mode Appbar
  return (
    <header ref={headerRef} className="w-full bg-white text-slate-900 border-b border-[#E2E8F0] px-3 min-[320px]:px-4 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Left section: Logo on Home, or Back button + Title on other pages */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {currentScreen === 'home' ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <ChurchLogo size="appbar" />
            <div className="min-w-0">
              <h1 className="text-sm min-[320px]:text-base font-bold text-slate-900 tracking-tight leading-none">
                Igreja mevd.
              </h1>
              <p className="mt-0.5 text-[11px] font-semibold leading-none text-blue-600">Juntos na fé</p>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={onBack}
              className="shrink-0 p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <h1 className="min-w-0 text-base min-[320px]:text-lg font-bold text-slate-900 tracking-tight leading-none break-words">
              {getScreenTitle()}
            </h1>
          </div>
        )}
      </div>

      {/* Right section: foto de perfil (abre as notificações) + saudação (abre o perfil) */}
      <div ref={notifWrapperRef} className="relative flex shrink-0 items-center">
        <div className="flex flex-col items-center gap-0.5">
          <button
            ref={avatarButtonRef}
            onClick={toggleNotificationMenu}
            aria-label={`Notificações — Oi, ${firstName}`}
            aria-haspopup="menu"
            aria-expanded={isNotifMenuOpen}
            title="Ver notificações"
            className="relative block shrink-0 rounded-full transition-transform active:scale-95 cursor-pointer"
          >
            <span className="block h-7 w-7 overflow-hidden rounded-full">
              <SafeImage
                src={user.avatar}
                alt={user.name}
                fallbackSrc="/assets/aistudio/Foto_de_Perfil__1__bd7124df.png"
                fallbackType="avatar"
                className="w-full h-full object-cover"
              />
            </span>
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                title={`${unreadCount} notificações não lidas`}
                className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenProfile}
            aria-label={`Perfil — Oi, ${firstName}`}
            title="Ver Perfil"
            className="max-w-16 truncate whitespace-nowrap rounded-md px-1 text-[9px] font-semibold leading-none text-slate-900 transition-colors hover:text-[#0066cc] cursor-pointer"
          >
            Oi, {firstName}
          </button>
        </div>

        {isNotifMenuOpen && (
          <NotificationMenu
            notifications={notifications}
            onSelect={handleSelectNotification}
            onClose={() => setIsNotifMenuOpen(false)}
            style={{ top: notifMenuPosition.top, right: notifMenuPosition.right }}
          />
        )}
      </div>
    </header>
  );
}
