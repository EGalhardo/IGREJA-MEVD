import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Images, ThumbsUp, ThumbsDown } from 'lucide-react';
import ChurchLogo from './ChurchLogo';
import PhotoComments from './PhotoComments';
import { reactionKeyFor, seedDislikeCount, seedLikeCount } from '../data/commentsData';
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
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);

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

  // Reacção da fotografia (gosto / não gosto), guardada no browser
  useEffect(() => {
    if (!photo) return;
    try {
      const stored = window.localStorage.getItem(reactionKeyFor(photo.id));
      setReaction(stored === 'like' || stored === 'dislike' ? stored : null);
    } catch {
      setReaction(null);
    }
  }, [photo]);

  const toggleReaction = useCallback(
    (next: 'like' | 'dislike') => {
      if (!photo) return;
      const value = reaction === next ? null : next;
      setReaction(value);
      try {
        if (value) window.localStorage.setItem(reactionKeyFor(photo.id), value);
        else window.localStorage.removeItem(reactionKeyFor(photo.id));
      } catch {
        // sem armazenamento: a reacção mantém-se apenas nesta sessão
      }
    },
    [photo, reaction]
  );

  if (index === null || !photos[index]) return null;

  const current = photos[index];
  const likes = seedLikeCount(current.id) + (reaction === 'like' ? 1 : 0);
  const dislikes = seedDislikeCount(current.id) + (reaction === 'dislike' ? 1 : 0);
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

      {/* Conteúdo: fotografia (esquerda) + mensagens (direita; em baixo no telemóvel) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex flex-col lg:min-h-0 lg:flex-1">
          {/* Fotografia + lista de imagens, num só grupo centrado */}
          <div className="flex flex-col items-center justify-center gap-3 overflow-hidden px-4 py-4 sm:px-5 lg:min-h-0 lg:flex-1">
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

              {/* Like e Dislike soltos sobre a imagem, sem caixa */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-4">
                <button
                  onClick={() => toggleReaction('like')}
                  aria-pressed={reaction === 'like'}
                  aria-label={`Gosto nesta fotografia (${likes})`}
                  title="Gosto"
                  className="flex items-center gap-1 text-[11px] font-extrabold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)] transition-all hover:scale-105 cursor-pointer"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${reaction === 'like' ? 'fill-white stroke-white' : 'stroke-white'}`}
                    strokeWidth={2}
                  />
                  {formatCount(likes)}
                </button>

                <button
                  onClick={() => toggleReaction('dislike')}
                  aria-pressed={reaction === 'dislike'}
                  aria-label={`Não gosto nesta fotografia (${dislikes})`}
                  title="Não gosto"
                  className="flex items-center gap-1 text-[11px] font-extrabold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)] transition-all hover:scale-105 hover:text-white cursor-pointer"
                >
                  <ThumbsDown
                    className={`h-4 w-4 ${reaction === 'dislike' ? 'fill-white stroke-white' : 'stroke-white'}`}
                    strokeWidth={2}
                  />
                  {formatCount(dislikes)}
                </button>
              </div>

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

            {/* Lista de fotografias em linha, encostada à imagem — sem caixa */}
            <div className="flex max-w-full items-center justify-center gap-2 overflow-x-auto">
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
                className="flex items-center gap-0.5 text-[10px] font-bold text-[#0066cc] hover:underline cursor-pointer"
              >
                Ver álbum completo
                <ChevronRight className="h-3 w-3 stroke-[2.6]" />
              </button>
            )}
          </div>
        </div>

        {/* Mensagens da fotografia */}
        <aside className="flex min-h-0 flex-col border-t border-[#E2E8F0] lg:w-[372px] lg:shrink-0 lg:border-l lg:border-t-0">
          <PhotoComments photoId={current.id} eventTitle={eventTitle} />
        </aside>
      </div>
    </div>
  );
}
