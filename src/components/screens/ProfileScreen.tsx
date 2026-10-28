import { User, Church, Calendar, Bell, Shield, Headphones, ChevronRight, LogOut, CheckCircle2, UserRoundPen } from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { Screen, UserProfile } from '../../types';

interface ProfileScreenProps {
  user?: UserProfile;
  onNavigate: (screen: Screen) => void;
  onOpenOption: (optionId: string) => void;
  onLogout: () => void;
  isDesktopLayout?: boolean;
}

export default function ProfileScreen({
  user = CURRENT_USER,
  onNavigate,
  onOpenOption,
  onLogout,
  isDesktopLayout = false,
}: ProfileScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* User Card: Avatar, Name & Status */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2E8F0] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 ring-4 ring-blue-50 shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = '/assets/aistudio/Foto_de_Perfil__1__bd7124df.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">Membro da {user.churchName}</p>

              <div className="mt-1.5 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-semibold border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                <span>{user.status}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => onOpenOption('meus-dados')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <UserRoundPen className="w-4 h-4 text-blue-600" />
            <span>Editar perfil</span>
          </button>
        </div>

        {/* Options List - 1 col on mobile, 2 cols on tablet / desktop */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Definições & Actividades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {/* 1. Os meus dados */}
            <button
              onClick={() => onOpenOption('meus-dados')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Os meus dados
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                  {user.civilStatus} • {user.phone}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight truncate">
                  {user.address}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 2. Igreja */}
            <button
              onClick={() => onOpenOption('minha-igreja')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Church className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Igreja
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {user.churchName} • Pr. Feliz Paulo
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 3. As minhas actividades */}
            <button
              onClick={() => onOpenOption('actividades')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  As minhas actividades
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                  Eventos inscritos ({user.activitiesCount.eventsRegistered})
                </p>
                <p className="text-[11px] text-slate-500 leading-tight truncate">
                  Departamentos ({user.activitiesCount.departments})
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 4. Notificações */}
            <button
              onClick={() => onOpenOption('notificacoes')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Bell className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Notificações
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {user.notificationsActive ? 'Notificações activas' : 'Notificações silenciadas'}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 5. Privacidade e segurança */}
            <button
              onClick={() => onOpenOption('privacidade')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Privacidade e segurança
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Protecção de dados e acessos
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 6. Ajuda e suporte */}
            <button
              onClick={() => onOpenOption('ajuda')}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Ajuda e suporte
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Secretaria e apoio espiritual
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </div>

        {/* Terminar Sessão Button - Perfeitamente alinhado com o início de Privacidade e segurança e o final de Ajuda e suporte */}
        <div className="pt-2 w-full">
          <button
            onClick={onLogout}
            className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2.5 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500 stroke-[2.2]" />
            <span>Terminar sessão</span>
          </button>
        </div>
      </div>
    </div>
  );
}
