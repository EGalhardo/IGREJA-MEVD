import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import PhotoComments from './PhotoComments';
import { likeKeyFor, seedLikeCount } from '../data/commentsData';
import { formatCount } from '../utils/comments';
import type { GalleryPhoto } from '../types';

interface GalleryGridProps {
  photos: GalleryPhoto[];
  onOpen: (index: number) => void;
}

/** Grelha de fotografias usada no separador "Galeria" do evento. */
export function GalleryGrid({ photos, onOpen }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-[3px] bg-slate-900">
      {photos.slice(0, 6).map((photo, index) => {
        const isLastVisible = index === 5 && photos.length > 6;

        return (
          <button
            key={photo.id}
            onClick={() => onOpen(index)}
            aria-label={`Ver fotografia ${index + 1} de ${photos.length}: ${photo.caption}`}
            className="group relative aspect-square overflow-hidden cursor-pointer"
          >
            <img
              src={photo.src}
              alt={photo.caption}
              loading={index < 3 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {photo.tag && !isLastVisible && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-slate-950/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {photo.tag}
              </span>
            )}

            {isLastVisible && (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-slate-950/60 text-white">
                <b className="text-lg font-extrabold">+{photos.length - 6}</b>
                <span className="text-[9px] font-bold uppercase tracking-wide opacity-85">fotos</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface GalleryStripProps {
  photos: GalleryPhoto[];
  onOpen: (index: number) => void;
  onSeeAll: () => void;
  /** Quantidade de fotografias apresentadas numa única linha */
  columns?: number;
}

/** Tira de miniaturas (sempre numa só linha) com o atalho "Ver todas". */
export function GalleryStrip({ photos, onOpen, onSeeAll, columns = 4 }: GalleryStripProps) {
  const visible = photos.slice(0, columns);
  const remaining = photos.length - visible.length;

  return (
    <div className="grid gap-1.5 p-4 pt-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {visible.map((photo, index) => {
        const isLast = index === visible.length - 1 && remaining > 0;

        return (
          <figure key={photo.id} className="relative overflow-hidden rounded-xl bg-slate-200">
            <button
              onClick={() => onOpen(index)}
              aria-label={`Ver fotografia ${index + 1}: ${photo.caption}`}
              className="group block h-full w-full cursor-pointer"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isLast && (
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-sm font-extrabold text-white">
                  +{remaining}
                </span>
              )}
            </button>
          </figure>
        );
      })}
    </div>
  );
}

interface GalleryPanelProps {
  photos: GalleryPhoto[];
  eventTitle: string;
  dateLabel: string;
  onOpen: (index: number) => void;
  onSeeAll: () => void;
  /** Quantidade de miniaturas na linha (4 no telemóvel, 6 no desktop) */
  columns?: number;
}

/** Cartão "Galeria do evento" (cabeçalho + miniaturas em linha + rodapé). */
export function GalleryPanel({
  photos,
  eventTitle,
  dateLabel,
  onOpen,
  onSeeAll,
  columns = 4,
}: GalleryPanelProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xs">
      <div className="flex items-center justify-between gap-2 px-4 pb-2.5 pt-3.5">
        <div>
          <h2 className="text-xs font-bold text-slate-900 sm:text-sm">Galeria do evento</h2>
          <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
            {photos.length} foto{photos.length === 1 ? '' : 's'} • {dateLabel}
          </p>
        </div>
        <button
          onClick={onSeeAll}
          className="shrink-0 text-[11px] font-bold text-[#0066cc] hover:underline cursor-pointer"
        >
          Ver todas →
        </button>
      </div>

      <GalleryStrip photos={photos} onOpen={onOpen} onSeeAll={onSeeAll} columns={columns} />

      <button
        onClick={onSeeAll}
        className="flex w-full items-center gap-3 border-t border-[#E2E8F0] bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100 cursor-pointer"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066cc]">
          <Images className="h-4 w-4 stroke-[2.2]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-bold text-slate-900">
            Álbum completo • {eventTitle}
          </span>
          <span className="block text-[10px] font-medium text-slate-500">
            Toque numa foto para ver em ecrã inteiro
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </button>
    </section>
  );
}

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  index: number | null;
  eventTitle: string;
  /** Data curta do evento ("26 Jun") */
  eventDate?: string;
  /** Local do evento, mostrado no cabeçalho */
  eventLocation?: string;
  onClose: () => void;
  onChange: (index: number) => void;
  /** Abre o separador da galeria (botão "Ver álbum completo") */
  onOpenAlbum?: () => void;
}

/**
 * Visualizador de fotografia em ecrã inteiro.
 *
 * Estrutura em três zonas: navegação no topo (evento + logomarca + fechar),
 * a fotografia com a sua barra de acções à esquerda e o mural de mensagens à
 * direita — no telemóvel as zonas passam a verticais.
 */
export function GalleryLightbox({
  photos,
  index,
  eventTitle,
  eventDate,
  eventLocation,
  onClose,
  onChange,
  onOpenAlbum,
}: GalleryLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState('');
  const [commentTotal, setCommentTotal] = useState(0);
  const [focusSignal, setFocusSignal] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const photo = index === null ? null : photos[index];

  useEffect(() => {
    if (index === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          void document.exitFullscreen?.();
          return;
        }
        onClose();
      }
      if (event.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length);
      if (event.key === 'ArrowRight') onChange((index + 1) % photos.length);
    };

    document.addEventListener('keydown', handleKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    return () => {
      document.removeEventListener('keydown', handleKey);
      window.clearTimeout(focusTimer);
    };
  }, [index, photos.length, onChange, onClose]);

  // Estado do "gosto" e do ecrã inteiro
  useEffect(() => {
    if (!photo) return;
    try {
      setLiked(window.localStorage.getItem(likeKeyFor(photo.id)) === '1');
    } catch {
      setLiked(false);
    }
  }, [photo]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const togglePhotoLike = useCallback(() => {
    if (!photo) return;
    const next = !liked;
    setLiked(next);
    try {
      window.localStorage.setItem(likeKeyFor(photo.id), next ? '1' : '0');
    } catch {
      // sem armazenamento: o gosto mantém-se apenas nesta sessão
    }
  }, [liked, photo]);

  const share = useCallback(async () => {
    if (!photo) return;
    const url = `${window.location.origin}${window.location.pathname}?evento=${encodeURIComponent(eventTitle)}`;
    const payload = { title: `${eventTitle} — IGREJA MEVD`, text: photo.caption, url };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast('Ligação copiada');
    } catch {
      setToast('Não foi possível partilhar');
    }
  }, [eventTitle, photo]);

  const download = useCallback(() => {
    if (!photo) return;
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = `${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setToast('A transferir a fotografia...');
  }, [photo]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await dialogRef.current?.requestFullscreen();
      }
    } catch {
      setToast('Ecrã inteiro indisponível');
    }
  }, []);

  if (index === null || !photos[index]) return null;

  const current = photos[index];
  const likes = seedLikeCount(current.id) + (liked ? 1 : 0);
  const goTo = (next: number) => onChange((next + photos.length) % photos.length);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[95] flex flex-col bg-white animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de ${eventTitle}`}
    >
      {/* Cabeçalho: evento à esquerda, logomarca + "Evento" + fechar à direita */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Voltar à galeria do evento"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.4]" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-900">{eventTitle}</p>
            <p className="truncate text-[10px] font-semibold text-slate-500">
              {photos.length} foto{photos.length === 1 ? '' : 's'}
              {eventDate ? ` • ${eventDate}` : ''}
              {eventLocation ? <span className="hidden sm:inline">{` • ${eventLocation}`}</span> : null}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] py-0.5 pl-1 pr-2.5">
            <ChurchLogo size="sm" className="!h-6 !w-6 !p-0.5" />
            <span className="text-[10.5px] font-bold text-slate-700">Evento</span>
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar galeria"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-4 w-4 stroke-[2.4]" />
          </button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed left-1/2 top-16 z-[100] -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1.5 text-[10.5px] font-bold text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* Conteúdo: fotografia (esquerda) + mensagens (direita; em baixo no telemóvel) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex flex-col lg:min-h-0 lg:flex-1">
          {/* Fotografia */}
          <div className="flex items-center justify-center overflow-hidden px-4 py-4 sm:px-5 lg:min-h-0 lg:flex-1">
            {/* A moldura acompanha a fotografia: as setas ficam sempre sobre a imagem */}
            <div className="relative inline-flex max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_-18px_rgba(15,23,42,0.45)]">
              <img
                src={current.src}
                alt={current.caption}
                className="block h-auto max-h-[42vh] w-auto max-w-full object-contain lg:max-h-[60vh]"
              />

              <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[9.5px] font-extrabold text-white backdrop-blur-sm">
                {index + 1} / {photos.length}
              </span>
              {current.tag && (
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full border border-[#E2E8F0] bg-white/95 px-2 py-0.5 text-[9.5px] font-extrabold text-slate-900">
                  {current.tag}
                </span>
              )}

              <button
                onClick={() => goTo(index - 1)}
                aria-label="Fotografia anterior"
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0066cc] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.4]" />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                aria-label="Fotografia seguinte"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0066cc] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 stroke-[2.4]" />
              </button>
            </div>
          </div>

          {/* Acções — ícones e texto soltos sobre o fundo, sem caixa */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 px-4 pb-2 pt-3.5 sm:px-5">
            <div className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-auto">
              <ChurchLogo size="sm" className="!h-8 !w-8 !p-1" />
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-bold text-slate-900">{current.caption}</p>
                <p className="truncate text-[9.5px] font-semibold text-slate-500">
                  Fotografia de IGREJA MEVD{eventDate ? ` • ${eventDate}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              <button
                onClick={togglePhotoLike}
                aria-pressed={liked}
                aria-label="Gosto nesta fotografia"
                title="Gosto nesta fotografia"
                className={`flex items-center gap-1.5 text-[10.5px] font-bold transition-colors cursor-pointer hover:text-[#0066cc] ${
                  liked ? 'text-[#0066cc]' : 'text-slate-600'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current stroke-[2.2]' : 'stroke-[2]'}`} />
                {formatCount(likes)}
              </button>

              <button
                onClick={() => setFocusSignal((value) => value + 1)}
                aria-label="Escrever um comentário"
                title="Escrever um comentário"
                className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600 transition-colors hover:text-[#0066cc] cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 stroke-[2]" />
                {formatCount(commentTotal)}
              </button>

              <button
                onClick={share}
                title="Partilhar a fotografia"
                className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600 transition-colors hover:text-[#0066cc] cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5 stroke-[2]" />
                Partilhar
              </button>

              <button
                onClick={download}
                title="Guardar a fotografia"
                className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600 transition-colors hover:text-[#0066cc] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 stroke-[2]" />
                Guardar
              </button>

              <button
                onClick={toggleFullscreen}
                aria-pressed={isFullscreen}
                aria-label={isFullscreen ? 'Sair do ecrã inteiro' : 'Ver em ecrã inteiro'}
                title={isFullscreen ? 'Sair do ecrã inteiro' : 'Ver em ecrã inteiro'}
                className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600 transition-colors hover:text-[#0066cc] cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 stroke-[2]" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Lista de fotografias em linha — sem caixa nem moldura */}
          <div className="flex shrink-0 items-center gap-3 px-4 pb-4 pt-1.5 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              {photos.map((item, itemIndex) => (
                <button
                  key={item.id}
                  onClick={() => onChange(itemIndex)}
                  aria-label={`Ir para fotografia ${itemIndex + 1}`}
                  className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer ${
                    itemIndex === index
                      ? 'opacity-100 ring-2 ring-[#0066cc] ring-offset-2'
                      : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <img src={item.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            {onOpenAlbum && (
              <button
                onClick={onOpenAlbum}
                className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-[#0066cc] hover:underline cursor-pointer"
              >
                <span className="hidden sm:inline">Ver álbum completo</span>
                <span className="sm:hidden">Álbum</span>
                <ChevronRight className="h-3 w-3 stroke-[2.6]" />
              </button>
            )}
          </div>
        </div>

        {/* Mensagens da fotografia */}
        <aside className="flex min-h-0 flex-col border-t border-[#E2E8F0] lg:w-[372px] lg:shrink-0 lg:border-l lg:border-t-0">
          <PhotoComments
            photoId={current.id}
            eventTitle={eventTitle}
            focusSignal={focusSignal}
            onTotalChange={setCommentTotal}
          />
        </aside>
      </div>
    </div>
  );
}
