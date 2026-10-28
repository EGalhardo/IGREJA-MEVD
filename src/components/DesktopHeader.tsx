import { Bell, Home, Calendar, BookOpen, Megaphone, User, Smartphone, Monitor } from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import { Screen, UserProfile } from '../types';

interface DesktopHeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  user: UserProfile;
  unreadCount?: number;
  onOpenNotifications: () => void;
  isPhonePreview: boolean;
  onTogglePhonePreview: () => void;
}

export default function DesktopHeader({
  currentScreen,
  onNavigate,
  user,
  unreadCount = 3,
  onOpenNotifications,
  isPhonePreview,
  onTogglePhonePreview,
}: DesktopHeaderProps) {
  const navItems: Array<{ screen: Screen; label: string; icon: typeof Home }> = [
    { screen: 'home', label: 'Início', icon: Home },
    { screen: 'events', label: 'Eventos', icon: Calendar },
    { screen: 'bible', label: 'Bíblia', icon: BookOpen },
    { screen: 'announcements', label: 'Comunicados', icon: Megaphone },
    { screen: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <header className="hidden md:block w-full bg-[#0b2246] text-white border-b border-blue-950/50 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Left: Church Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <ChurchLogo />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-blue-200 transition-colors">
                IGREJA MEVD
              </span>
            </div>
            <p className="text-xs text-blue-200 font-medium mt-1">Juntos na fé</p>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentScreen === item.screen ||
              (item.screen === 'events' && currentScreen === 'event-detail');

            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#0066cc] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Notifications & Profile Badge */}
        <div className="flex items-center gap-4">
          {/* Toggle Phone Frame Simulator */}
          <button
            onClick={onTogglePhonePreview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isPhonePreview
                ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                : 'bg-white/10 border-white/15 text-white/80 hover:text-white hover:bg-white/20'
            }`}
            title="Alternar entre modo fluido e simulador móvel"
          >
            {isPhonePreview ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Ecrã Responsivo</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Vista Mobile</span>
              </>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#0b2246]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Mini Badge */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-left"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/30"
            />
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-emerald-300 font-semibold">{user.status}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
