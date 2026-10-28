import { Bell, Calendar, Pin } from 'lucide-react';
import { Screen } from '../../types';

interface ComunicadosScreenProps {
  onNavigate: (screen: Screen) => void;
  isDesktopLayout?: boolean;
}

const ANNOUNCEMENTS = [
  {
    id: '1',
    isPinned: true,
    title: 'Inscrições para o Congresso de Jovens 2027 abertas!',
    date: 'Hoje, 09:30',
    category: 'Jovens',
    content: 'Já se encontram abertas as inscrições oficiais para o maior encontro de jovens do ano. Garanta a sua vaga através da secção de eventos.',
  },
  {
    id: '2',
    isPinned: true,
    title: 'Horário do Culto de Santa Ceia',
    date: 'Ontem, 18:00',
    category: 'Geral',
    content: 'Lembramos a todos os membros e congregados que o próximo Culto de Santa Ceia terá início pontualmente às 18:00 na Sede da Igreja.',
  },
  {
    id: '3',
    isPinned: false,
    title: 'Campanha do Quilo: Doações de Alimentos',
    date: '24 Out, 14:15',
    category: 'Acção Social',
    content: 'O departamento de assistência social convida todos a contribuírem com alimentos não perecíveis para cestas básicas de apoio comunitário.',
  },
];

export default function ComunicadosScreen({ onNavigate, isDesktopLayout = false }: ComunicadosScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Header Intro Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Avisos & Comunicados Oficiais
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fique informado sobre os avisos pastorais e programações da igreja
            </p>
          </div>
          <div className="p-3 text-blue-600 bg-blue-50 rounded-2xl shrink-0">
            <Bell className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Announcements List - 1 col on mobile, 2 cols on tablet / desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {ANNOUNCEMENTS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E2E8F0] space-y-2.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {item.isPinned && <Pin className="w-3.5 h-3.5 fill-blue-600 text-blue-600 rotate-45" />}
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-1.5">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
