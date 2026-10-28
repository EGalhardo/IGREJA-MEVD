import { Home, Calendar, BookOpen, Megaphone, User, LogOut } from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import { Screen, UserProfile } from '../types';
import { CHURCH_EVENTS } from '../data/mockData';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user?: UserProfile;
  onLogout: () => void;
  unreadCount?: number;
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  onLogout,
  unreadCount = 3,
}: SidebarProps) {
  const navItems = [
    {
      id: 'home' as Screen,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'events' as Screen,
      label: 'Eventos',
      icon: Calendar,
      badge: String(CHURCH_EVENTS.length),
    },
    {
      id: 'bible' as Screen,
      label: 'Bíblia',
      icon: BookOpen,
    },
    {
      id: 'announcements' as Screen,
      label: 'Comunicados',
      icon: Megaphone,
      badge: unreadCount > 0 ? String(unreadCount) : undefined,
    },
    {
      id: 'profile' as Screen,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <aside className="w-64 xl:w-72 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-full select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3.5">
          <ChurchLogo />
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              IGREJA MEVD
            </h1>
            <p className="text-xs text-blue-600 font-semibold">Juntos na fé</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Navegação Principal
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentScreen === item.id ||
                (item.id === 'events' && currentScreen === 'event-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#0066cc] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 stroke-[2.2] ${
                        isActive ? 'text-[#0066cc]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#0066cc] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Harmonious Bottom Section with Sign Out Button */}
      <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/40 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-red-500" />
          <span>Terminar sessão</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 font-medium">
          IGREJA MEVD • Luanda, Angola
        </p>
      </div>
    </aside>
  );
}
