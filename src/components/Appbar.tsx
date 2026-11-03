import { ArrowLeft } from 'lucide-react';
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

        {/* Right: saudação + foto de perfil com badge de notificações */}
        <div className="flex shrink-0 items-center">
          <button
            onClick={onOpenProfile}
            aria-label={`Perfil — Oi, ${firstName}`}
            title="Ver Perfil"
            className="flex flex-col items-center gap-1 rounded-xl px-1.5 py-0.5 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <span className="relative block shrink-0">
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
            </span>
            <span className="whitespace-nowrap text-[10px] font-semibold leading-none text-slate-900">
              Oi, {firstName}
            </span>
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
          // Mobile: apenas a logomarca (sem o nome "IGREJA MEVD" nem "Juntos na fé")
          <ChurchLogo size="sm" />
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

      {/* Right section: foto de perfil com badge de notificações */}
      <div className="flex shrink-0 items-center">
        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-0.5 transition-colors hover:bg-slate-100 cursor-pointer"
          aria-label={`Perfil — Oi, ${firstName}`}
          title="Ver Perfil"
        >
          <span className="relative block shrink-0">
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
          </span>
          <span className="max-w-16 truncate whitespace-nowrap text-[9px] font-semibold leading-none text-slate-900">
            Oi, {firstName}
          </span>
        </button>
      </div>
    </header>
  );
}
