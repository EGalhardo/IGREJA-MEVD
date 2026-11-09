import { useState } from 'react';
import { Share2, MapPin, Clock, Users, Mic, Music, UserCheck, Check, Images, Play } from 'lucide-react';
import { ChurchEvent } from '../../types';
import { shareOrCopy } from '../../utils/shareUtils';
import { GalleryGrid, GalleryPanel, GalleryLightbox } from '../EventGallery';
import SafeImage from '../SafeImage';


interface EventDetailScreenProps {
  event: ChurchEvent;
  isRegistered: boolean;
  onToggleRegistration: (eventId: string) => void;
  onShowToast: (message: string) => void;
}

export default function EventDetailScreen({
  event,
  isRegistered,
  onToggleRegistration,
  onShowToast,
}: EventDetailScreenProps) {
  const [isSharing, setIsSharing] = useState(false);
  // Separador do topo do evento: transmissão (ao vivo) ou álbum de fotografias
  const [activeTab, setActiveTab] = useState<'live' | 'gallery'>('live');
  // Índice da fotografia aberta em ecrã inteiro (null = fechado)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallery = event.gallery ?? [];
  const hasGallery = gallery.length > 0;
  const dateLabel = `${event.dateDay} ${event.dateMonth}`;

  const openGalleryTab = () => {
    setActiveTab('gallery');
    scrollToEventTop();
  };

  const scrollToEventTop = () => {
    const container = document.getElementById('event-detail-scroll');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = () => {
    onToggleRegistration(event.id);
    onShowToast(
      isRegistered
        ? 'Marcação removida nesta sessão.'
        : 'Presença marcada nesta sessão. Esta é uma simulação.'
    );
  };

  // O Play não tem uma emissão real nesta versão: confirma o estado com uma mensagem.
  const handlePlayLive = () => {
    onShowToast('A transmissão em directo vai começar em breve.');
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
    <div id="event-detail-scroll" className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-6">
        {/* Main Event Card Container */}
        <div className="bg-white sm:rounded-3xl shadow-xs border-0 sm:border border-[#E2E8F0] overflow-hidden flex flex-col">
          {/* Separadores: transmissão ao vivo / galeria do evento */}
          {hasGallery && (
            <div className="flex shrink-0 gap-1.5 border-b border-[#E2E8F0] bg-slate-50 p-2">
              <button
                onClick={() => setActiveTab('live')}
                aria-pressed={activeTab === 'live'}
                className={`flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  activeTab === 'live'
                    ? 'border-[#dbe7f6] bg-white text-[#0066cc] shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${activeTab === 'live' ? 'bg-rose-500' : 'bg-rose-400'}`} />
                Ao vivo
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                aria-pressed={activeTab === 'gallery'}
                className={`flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  activeTab === 'gallery'
                    ? 'border-[#dbe7f6] bg-white text-[#0066cc] shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Images className="h-3.5 w-3.5 stroke-[2.2]" />
                Galeria
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    activeTab === 'gallery' ? 'bg-[#0066cc] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {gallery.length}
                </span>
              </button>
            </div>
          )}

          {/* Topo: moldura da transmissão ou grelha do álbum do evento */}
          <div className="relative w-full shrink-0 bg-slate-900">
            {activeTab === 'live' || !hasGallery ? (
              <>
                {/* A imagem é exactamente a do cartão clicado na página Início (event.image) */}
                <div className="relative aspect-[160/117] max-h-[26rem] w-full overflow-hidden bg-slate-900">
                  <SafeImage
                    src={event.image}
                    alt={event.title}
                    fallbackSrc="/assets/aistudio/2_b0dbb042.webp"
                    fallbackType="event"
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Véu escuro: garante o contraste do Play e dos textos sobre a fotografia */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/65 to-slate-950/35" />

                  {/* Estado da transmissão */}
                  <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-rose-400/50 bg-rose-500/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-50 backdrop-blur-sm sm:left-4 sm:top-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    Ao vivo
                  </span>

                  {/* Play + textos da transmissão */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 px-5 text-center">
                    <button
                      type="button"
                      onClick={handlePlayLive}
                      aria-label={`Reproduzir a transmissão do evento ${event.title}`}
                      className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#0066cc] transition-transform duration-200 hover:scale-105 hover:bg-white active:scale-95 sm:h-14 sm:w-14"
                    >
                      <Play className="ml-0.5 h-5 w-5 fill-current stroke-[0] sm:h-6 sm:w-6" aria-hidden="true" />
                    </button>
                    <h2 className="mt-1 text-sm font-extrabold text-white sm:text-base">
                      Transmissão do evento
                    </h2>
                    <p className="max-w-[22rem] text-[11px] font-medium leading-snug text-slate-200 sm:text-xs">
                      Este espaço vai apresentar a transmissão em directo.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <GalleryGrid photos={gallery} onOpen={(index) => setLightboxIndex(index)} />
            )}

            {/* Data flutuante (apenas no separador "Ao vivo": sobre a galeria tapava fotos) */}
            {(activeTab === 'live' || !hasGallery) && (
              <div className="absolute left-6 -bottom-6 z-10 bg-white rounded-2xl shadow-lg p-3 min-w-[64px] text-center border border-[#E2E8F0]">
                <span className="block text-2xl font-extrabold text-slate-900 leading-none">
                  {event.dateDay}
                </span>
                <span className="block text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {event.dateMonth}
                </span>
              </div>
            )}
          </div>

          {/* Content Body: 1 col on mobile, 2 cols on tablet landscape / desktop */}
          <div className="p-6 sm:p-8 pt-10 sm:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (or Top): Title & Metadata & Inscription */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {hasGallery && activeTab === 'gallery' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-bold text-slate-700">
                        {dateLabel}
                      </span>
                    )}
                    <div className="inline-block">
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
                  <p className="text-xs xl:text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 xl:mb-3">
                    Destaques do programa
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3 xl:gap-4">
                    {(event.highlights ?? [
                      { icon: 'mic' as const, title: 'Palestrantes convidados' },
                      { icon: 'music' as const, title: 'Louvor e adoração' },
                      { icon: 'users' as const, title: 'Networking e muito mais' },
                    ]).map((highlight, index) => {
                      const Icon = { mic: Mic, music: Music, users: Users }[highlight.icon];
                      return (
                        <div key={`${highlight.icon}-${index}`} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 xl:p-[18px] flex flex-col items-center justify-center text-center min-h-[96px] sm:min-h-[110px] xl:min-h-[118px] shadow-2xs">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 text-[#0066cc] stroke-[2.2] mb-1.5 xl:mb-2" />
                          <span className="text-[10px] sm:text-xs xl:text-[13px] font-bold text-slate-800 leading-tight">
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

        {/* Galeria do evento: fotografias sempre numa linha (4 no telemóvel, 6 no desktop) */}
        {hasGallery && (
          <div className="mt-4 px-3 pb-6 sm:px-0">
            <div className="lg:hidden">
              <GalleryPanel
                photos={gallery}
                eventTitle={event.title}
                dateLabel={dateLabel}
                onOpen={(index) => setLightboxIndex(index)}
                onSeeAll={openGalleryTab}
                columns={4}
              />
            </div>
            <div className="hidden lg:block">
              <GalleryPanel
                photos={gallery}
                eventTitle={event.title}
                dateLabel={dateLabel}
                onOpen={(index) => setLightboxIndex(index)}
                onSeeAll={openGalleryTab}
                columns={6}
              />
            </div>
          </div>
        )}
      </div>

      {/* Ecrã inteiro da fotografia */}
      <GalleryLightbox
        photos={gallery}
        index={lightboxIndex}
        eventTitle={event.title}
        eventDate={dateLabel}
        eventLocation={event.location}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
        onOpenAlbum={() => {
          setLightboxIndex(null);
          setActiveTab('gallery');
        }}
      />
    </div>
  );
}
