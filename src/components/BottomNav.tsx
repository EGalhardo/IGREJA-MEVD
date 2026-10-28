import { Home, Calendar, BookOpen, Megaphone, User } from 'lucide-react';
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
        className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'home' ? 'text-[#0066cc]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Home className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[11px] font-bold">Início</span>
      </button>

      {/* Eventos */}
      <button
        onClick={() => onNavigate('events')}
        className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'events' || currentScreen === 'event-detail'
            ? 'text-[#0066cc]'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Calendar className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[11px] font-bold">Eventos</span>
      </button>

      {/* Bíblia (Entre Eventos e Comunicados) */}
      <button
        onClick={() => onNavigate('bible')}
        className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'bible' ? 'text-[#0066cc]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <BookOpen className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[11px] font-bold">Bíblia</span>
      </button>

      {/* Comunicados */}
      <button
        onClick={() => onNavigate('announcements')}
        className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 transition-all cursor-pointer ${
          currentScreen === 'announcements' ? 'text-[#0066cc]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Megaphone className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[11px] font-bold">Comunicados</span>
      </button>

      {/* Perfil */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-2 sm:px-3 transition-all cursor-pointer ${
          isProfileActive ? 'text-[#0066cc]' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <User className="w-5 h-5 stroke-[2.2]" />
        <span className="text-[11px] font-bold">Perfil</span>
      </button>
    </nav>
  );
}
