import { useState } from 'react';
import { ArrowLeft, Share2, MapPin, Clock, Users, Mic, Music, UserCheck, Check } from 'lucide-react';
import { ChurchEvent, Screen } from '../../types';
import SafeImage from '../SafeImage';
import { shareOrCopy } from '../../utils/shareUtils';


/**
 * Moldura genérica da transmissão ao vivo.
 *
 * É um iframe real, mas com conteúdo autónomo (srcdoc), sem qualquer pedido à rede:
 * por isso aparece igual com internet ou offline. Quando a transmissão for
 * implementada, basta substituir `srcDoc={LIVE_PLACEHOLDER_HTML}` por
 * `src="https://www.youtube.com/embed/ID_DO_VIDEO"`.
 */
const LIVE_PLACEHOLDER_HTML = `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; height: 100%; overflow: hidden; }
      body {
        display: flex; align-items: center; justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        background: radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 55%, #020617 100%);
        color: #e2e8f0; text-align: center; padding: 4% 6%;
      }
      .wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5vmin; max-width: 92%; }
      .live {
        display: inline-flex; align-items: center; gap: .6vmin;
        font-size: clamp(7px, 1.9vmin, 10px); font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
        color: #fecdd3; background: rgba(244, 63, 94, .16);
        border: 1px solid rgba(244, 63, 94, .45); border-radius: 999px; padding: .5vmin 1.6vmin;
      }
      .dot { width: 1.2vmin; height: 1.2vmin; min-width: 5px; min-height: 5px; border-radius: 999px; background: #f43f5e; }
      .play {
        width: clamp(30px, 9vmin, 58px); height: clamp(30px, 9vmin, 58px);
        border-radius: 999px; flex: 0 0 auto;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.35);
      }
      .play span {
        width: 0; height: 0; margin-left: 12%;
        border-left: clamp(9px, 2.9vmin, 18px) solid #ffffff;
        border-top: clamp(6px, 1.8vmin, 11px) solid transparent;
        border-bottom: clamp(6px, 1.8vmin, 11px) solid transparent;
      }
      h1 { font-size: clamp(10px, 2.9vmin, 15px); margin: 0; letter-spacing: -.01em; }
      p { font-size: clamp(8px, 2.3vmin, 12px); line-height: 1.4; margin: 0; color: #94a3b8; }
      .brand { font-size: clamp(7px, 1.7vmin, 10px); letter-spacing: .18em; text-transform: uppercase; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="live"><span class="dot"></span> Ao vivo</div>
      <div class="play"><span></span></div>
      <h1>Transmissão do evento</h1>
      <p>Este espaço vai apresentar a transmissão em directo.</p>
      <div class="brand">IGREJA MEVD</div>
    </div>
  </body>
</html>`;

interface EventDetailScreenProps {
  event: ChurchEvent;
  isRegistered: boolean;
  onToggleRegistration: (eventId: string) => void;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onShowToast: (message: string) => void;
  isDesktopLayout?: boolean;
}

export default function EventDetailScreen({
  event,
  isRegistered,
  onToggleRegistration,
  onBack,
  onShowToast,
}: EventDetailScreenProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleRegister = () => {
    onToggleRegistration(event.id);
    onShowToast(
      isRegistered
        ? 'Marcação removida nesta sessão.'
        : 'Presença marcada nesta sessão. Esta é uma simulação.'
    );
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    const shareDescription = `Participe do ${event.title}!\nData: ${event.dateDay} de ${event.dateMonth} • ${event.time}\nLocal: ${event.location}\nIGREJA MEVD - Juntos na fé.`;

    try {
      const eventUrl = new URL(window.location.href);
      eventUrl.searchParams.set('evento', event.id);
      await shareOrCopy(
        {
          title: `${event.title} • IGREJA MEVD`,
          text: shareDescription,
          url: eventUrl.toString(),
        },
        (msg) => onShowToast(msg)
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-5xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-6">
        {/* Main Event Card Container */}
        <div className="bg-white sm:rounded-3xl shadow-xs border-0 sm:border border-[#E2E8F0] overflow-hidden flex flex-col">
          {/* Top Hero Image Banner */}
          <div className="relative w-full shrink-0 bg-slate-900 aspect-[16/10] sm:aspect-auto sm:h-80 lg:h-96">
            <SafeImage
              src={event.image}
              alt={event.title}
              fallbackType="event"
              className="absolute inset-0 h-full w-full object-cover"
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

                {/* Transmissão: moldura genérica do iframe (visível também offline) */}
                <section
                  aria-label="Transmissão do evento"
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                      Transmissão ao vivo
                    </h2>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Em preparação
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-slate-900">
                    <iframe
                      title={`Transmissão do evento ${event.title}`}
                      srcDoc={LIVE_PLACEHOLDER_HTML}
                      loading="lazy"
                      allow="fullscreen; picture-in-picture"
                      className="block aspect-video w-full border-0"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    O vídeo em directo será apresentado nesta moldura assim que a funcionalidade estiver disponível.
                  </p>
                </section>

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
                    aria-pressed={isRegistered}
                    className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#0066cc] hover:bg-[#0055aa] text-white shadow-blue-500/20'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        <span>Presença marcada nesta sessão</span>
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
                    disabled={isSharing}
                    className="py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-[#E2E8F0] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                    title="Partilhar evento com amigos"
                  >
                    <Share2 className="w-4 h-4 text-[#0066cc]" />
                    <span>Partilhar</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  A marcação é apenas uma simulação nesta sessão e não é enviada à igreja.
                </p>
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
                    {(event.highlights ?? [
                      { icon: 'mic' as const, title: 'Palestrantes convidados' },
                      { icon: 'music' as const, title: 'Louvor e adoração' },
                      { icon: 'users' as const, title: 'Networking e muito mais' },
                    ]).map((highlight, index) => {
                      const Icon = { mic: Mic, music: Music, users: Users }[highlight.icon];
                      return (
                        <div key={`${highlight.icon}-${index}`} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[110px] shadow-2xs">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066cc] stroke-[2.2] mb-1.5" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-800 leading-tight">
                            {highlight.title}
                          </span>
                        </div>
                      );
                    })}
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
