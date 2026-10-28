import { useState } from 'react';
import { ArrowLeft, Share2, MapPin, Clock, Users, Mic, Music, UserCheck, Check } from 'lucide-react';
import { ChurchEvent, Screen } from '../../types';
import SafeImage from '../SafeImage';
import { shareOrCopy } from '../../utils/shareUtils';

interface EventDetailScreenProps {
  event: ChurchEvent;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onShowToast: (message: string) => void;
  isDesktopLayout?: boolean;
}

export default function EventDetailScreen({
  event,
  onBack,
  onShowToast,
  isDesktopLayout = false,
}: EventDetailScreenProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleRegister = () => {
    setIsRegistered((prev) => !prev);
    if (!isRegistered) {
      onShowToast('Inscrição confirmada com sucesso!');
    } else {
      onShowToast('Inscrição cancelada.');
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    const shareDescription = `Participe do ${event.title}!\nData: ${event.dateDay} de ${event.dateMonth} • ${event.time}\nLocal: ${event.location}\nIGREJA MEVD - Juntos na fé.`;

    await shareOrCopy(
      {
        title: `${event.title} • IGREJA MEVD`,
        text: shareDescription,
        url: typeof window !== 'undefined' ? window.location.href : '',
      },
      (msg) => {
        onShowToast(msg);
      }
    );

    setIsSharing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-5xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-6">
        {/* Main Event Card Container */}
        <div className="bg-white sm:rounded-3xl shadow-xs border-0 sm:border border-[#E2E8F0] overflow-hidden flex flex-col">
          {/* Top Hero Image Banner */}
          <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-slate-900 shrink-0">
            <SafeImage
              src={event.image}
              alt={event.title}
              fallbackSrc="/assets/aistudio/2_b0dbb042.png"
              fallbackType="event"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Dark gradient for button visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Overlaid Floating Buttons */}
            <div className="absolute inset-x-0 top-0 p-4 sm:p-6 flex items-center justify-between z-10">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                aria-label="Partilhar evento"
                title="Partilhar evento"
              >
                <Share2 className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Floating Date Badge on bottom-left */}
            <div className="absolute left-6 -bottom-6 z-10 bg-white rounded-2xl shadow-lg p-3 min-w-[64px] text-center border border-[#E2E8F0]">
              <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                {event.dateDay}
              </span>
              <span className="block text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                {event.dateMonth}
              </span>
            </div>
          </div>

          {/* Content Body: 1 col on mobile, 2 cols on tablet landscape / desktop */}
          <div className="p-6 sm:p-8 pt-10 sm:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (or Top): Title & Metadata & Inscription */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="inline-block mb-2">
                    {event.statusBadge.variant === 'green' && (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
                        {event.statusBadge.text}
                      </span>
                    )}
                    {event.statusBadge.variant === 'blue' && (
                      <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full border border-sky-100">
                        {event.statusBadge.text}
                      </span>
                    )}
                    {event.statusBadge.variant === 'purple' && (
                      <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full border border-purple-100">
                        {event.statusBadge.text}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {event.title}
                  </h1>
                </div>

                {/* Metadata List */}
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc] shrink-0 stroke-[2.2]" />
                    <span className="font-medium">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc] shrink-0 stroke-[2.2]" />
                    <span className="font-medium">{event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066cc] shrink-0 stroke-[2.2]" />
                    <span className="font-medium">
                      {event.statusBadge.text} ({event.capacity || '250 vagas'})
                    </span>
                  </div>
                </div>

                {/* Inscription Action Button & Secondary Share Action */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRegister}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#0066cc] hover:bg-[#0055aa] text-white shadow-blue-500/20'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        <span>Presença Confirmada • Dentro do Evento</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5 stroke-[2.2]" />
                        <span>Entrar no Evento</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-[#E2E8F0] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                    title="Partilhar evento com amigos"
                  >
                    <Share2 className="w-4 h-4 text-[#0066cc]" />
                    <span>Partilhar</span>
                  </button>
                </div>
              </div>

              {/* Right Column (or Bottom): Description & 3 Highlights */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    Sobre o evento
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {event.description ||
                      'Um encontro especial para jovens que desejam crescer na fé, fazer novas amizades e viver uma experiência única com Deus.'}
                  </p>
                </div>

                {/* 3 Pillars / Feature Highlights Box */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Destaques do programa
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {/* Pillar 1: Palestrantes convidados */}
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[110px] shadow-2xs">
                      <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066cc] stroke-[2.2] mb-1.5" />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">
                        Palestrantes convidados
                      </span>
                    </div>

                    {/* Pillar 2: Louvor e adoração */}
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[110px] shadow-2xs">
                      <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066cc] stroke-[2.2] mb-1.5" />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">
                        Louvor e adoração
                      </span>
                    </div>

                    {/* Pillar 3: Networking e muito mais */}
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[110px] shadow-2xs">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066cc] stroke-[2.2] mb-1.5" />
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">
                        Networking e muito mais
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
