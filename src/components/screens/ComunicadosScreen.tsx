import { useEffect, useRef, useState } from 'react';
import { Bell, Calendar, Pin, X } from 'lucide-react';

export interface Announcement {
  id: string;
  isPinned: boolean;
  title: string;
  date: string;
  category: string;
  content: string;
}

const ANNOUNCEMENTS: Announcement[] = [
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

/** Popup do comunicado — mesma estrutura, medidas e comportamento dos restantes modais. */
function AnnouncementModal({
  announcement,
  onClose,
}: {
  announcement: Announcement;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Foco no fechar + ESC, tal como nos outros popups
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="anuncio-modal-title"
        className="flex w-full max-w-[26rem] flex-col overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl sm:max-w-md max-h-[min(86vh,44rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] px-5 pb-3 pt-4">
          <h2 id="anuncio-modal-title" className="text-base font-bold text-slate-900">
            Comunicado
          </h2>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com scroll próprio, para o popup nunca esticar */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 pb-5 pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {announcement.isPinned && <Pin className="w-3.5 h-3.5 fill-blue-600 text-blue-600 rotate-45" />}
              {announcement.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>{announcement.date}</span>
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {announcement.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">{announcement.content}</p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#0066cc] hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs cursor-pointer mt-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComunicadosScreen() {
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement | null>(null);

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
        <div className="grid grid-cols-1 @min-[40rem]:grid-cols-2 gap-3.5 sm:gap-4">
          {ANNOUNCEMENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenAnnouncement(item)}
              aria-haspopup="dialog"
              aria-label={`Abrir comunicado: ${item.title}`}
              className="w-full text-left bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E2E8F0] space-y-2.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066cc]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {item.isPinned && <Pin className="w-3.5 h-3.5 fill-blue-600 text-blue-600 rotate-45" />}
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
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
            </button>
          ))}
        </div>
      </div>

      {openAnnouncement && (
        <AnnouncementModal
          announcement={openAnnouncement}
          onClose={() => setOpenAnnouncement(null)}
        />
      )}
    </div>
  );
}
