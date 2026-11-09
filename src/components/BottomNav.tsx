import { Megaphone } from 'lucide-react';
import NavIcon from './NavIcon';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isDesktopLayout?: boolean;
}

export default function BottomNav({ currentScreen, onNavigate, isDesktopLayout = false }: BottomNavProps) {
  // Never show bottom nav in desktop or tablet horizontal mode (sidebar is used instead)
  if (isDesktopLayout) {
    return null;
  }

  const isProfileActive = currentScreen === 'profile';

  return (
    <nav className="w-full bg-white border-t border-[#E2E8F0] px-2 sm:px-4 py-2 flex items-center justify-around z-30 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {/* Início */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex min-w-10 flex-col items-center gap-1 py-1 px-0.5 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'home' ? 'text-[#0066cc]' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <NavIcon name="home" size={20} active={currentScreen === 'home'} />
        <span className="text-[10px] min-[360px]:text-[11px] font-bold">Início</span>
      </button>

      {/* Eventos */}
      <button
        onClick={() => onNavigate('events')}
        className={`flex min-w-10 flex-col items-center gap-1 py-1 px-0.5 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'events' || currentScreen === 'event-detail'
            ? 'text-[#0066cc]'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <NavIcon name="events" size={20} active={currentScreen === 'events' || currentScreen === 'event-detail'} />
        <span className="text-[10px] min-[360px]:text-[11px] font-bold">Eventos</span>
      </button>

      {/* Bíblia (Entre Eventos e Comunicados) */}
      <button
        onClick={() => onNavigate('bible')}
        className={`flex min-w-10 flex-col items-center gap-1 py-1 px-0.5 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'bible' ? 'text-[#0066cc]' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <NavIcon name="bible" size={20} active={currentScreen === 'bible'} />
        <span className="text-[10px] min-[360px]:text-[11px] font-bold">Bíblia</span>
      </button>

      {/* Comunicados */}
      <button
        onClick={() => onNavigate('announcements')}
        className={`flex min-w-10 flex-col items-center gap-1 py-1 px-0.5 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'announcements' ? 'text-[#0066cc]' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Megaphone
          className={`w-5 h-5 stroke-[2.2] ${
            currentScreen === 'announcements' ? 'megafone-activo' : ''
          }`}
        />
        <span className="text-[10px] min-[360px]:text-[11px] font-bold">Comunicados</span>
      </button>

      {/* Perfil */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex min-w-10 flex-col items-center gap-1 py-1 px-0.5 sm:px-3 transition-all cursor-pointer ${
          isProfileActive ? 'text-[#0066cc]' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <NavIcon name="profile" size={20} active={isProfileActive} />
        <span className="text-[10px] min-[360px]:text-[11px] font-bold">Perfil</span>
      </button>
    </nav>
  );
}
