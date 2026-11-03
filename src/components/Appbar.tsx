import { ArrowLeft, Bell } from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import SafeImage from './SafeImage';
import { Screen, UserProfile } from '../types';

interface AppbarProps {
  currentScreen: Screen;
  isDesktopLayout: boolean;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  user: UserProfile;
  unreadCount?: number;
}

export default function Appbar({
  currentScreen,
  isDesktopLayout,
  onNavigate,
  onBack,
  onOpenNotifications,
  onOpenProfile,
  user,
  unreadCount = 3,
}: AppbarProps) {
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
      <header className="h-[var(--desktop-header-height)] w-full bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
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

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Notificações"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Summary */}
          <button
            onClick={onOpenProfile}
            aria-label="Perfil"
            title="Ver Perfil"
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1.5 pr-2.5 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <SafeImage
                src={user.avatar}
                alt={user.name}
                fallbackSrc="/assets/aistudio/Foto_de_Perfil__1__bd7124df.png"
                fallbackType="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden lg:block max-w-40">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate">{user.name}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {user.status}
              </span>
            </div>
          </button>
        </div>
      </header>
    );
  }

  // Mobile & Tablet Vertical Mode Appbar
  return (
    <header className="w-full bg-white text-slate-900 border-b border-[#E2E8F0] px-3 min-[320px]:px-4 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Left section: Logo on Home, or Back button + Title on other pages */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {currentScreen === 'home' ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <ChurchLogo size="sm" />
            <div>
              <h1 className="text-sm min-[320px]:text-base font-bold text-slate-900 tracking-tight leading-none">
                IGREJA MEVD
              </h1>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Juntos na fé</p>
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

      {/* Right section: Sino de Notificações + Avatar de Perfil */}
      <div className="flex shrink-0 items-center gap-1 min-[320px]:gap-1.5">
        {/* Sino de Notificações */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 min-[320px]:p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors cursor-pointer"
          aria-label="Notificações"
          title="Notificações"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Avatar de Perfil */}
        <button
          onClick={onOpenProfile}
          className="ml-0.5 rounded-full p-0.5 transition-all hover:bg-slate-100 cursor-pointer min-[320px]:ml-1"
          aria-label="Perfil"
          title="Ver Perfil"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden">
            <SafeImage
              src={user.avatar}
              alt={user.name}
              fallbackSrc="/assets/aistudio/Foto_de_Perfil__1__bd7124df.png"
              fallbackType="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </header>
  );
}
