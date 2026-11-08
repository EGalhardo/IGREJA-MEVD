import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
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
  onClose: () => void;
  onChange: (index: number) => void;
}

/** Visualizador de fotografia em ecrã inteiro (setas, contador e miniaturas). */
export function GalleryLightbox({ photos, index, eventTitle, onClose, onChange }: GalleryLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (index === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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

  if (index === null || !photos[index]) return null;

  const photo = photos[index];
  const goTo = (next: number) => onChange((next + photos.length) % photos.length);

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col bg-[#04070f] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de ${eventTitle}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-white">{eventTitle}</p>
          <p className="text-[10px] font-semibold text-slate-400">
            Foto {index + 1} de {photos.length}
            {photo.tag ? ` • ${photo.tag}` : ''}
          </p>
        </div>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fechar galeria"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[2.4]" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-2">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl">
          <img src={photo.src} alt={photo.caption} className="block max-h-[70vh] w-full object-contain" />

          <button
            onClick={() => goTo(index - 1)}
            aria-label="Fotografia anterior"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white transition-colors hover:bg-slate-950/80 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Fotografia seguinte"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-slate-950/55 text-white transition-colors hover:bg-slate-950/80 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.4]" />
          </button>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-1 pt-3">
        <p className="text-xs font-bold text-white">{photo.caption}</p>
        <p className="text-[10px] font-medium text-slate-400">Galeria • {eventTitle}</p>
      </div>

      <div className="flex shrink-0 gap-1.5 overflow-x-auto px-4 pb-4 pt-2">
        {photos.map((item, itemIndex) => (
          <button
            key={item.id}
            onClick={() => onChange(itemIndex)}
            aria-label={`Ir para fotografia ${itemIndex + 1}`}
            className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg transition-opacity cursor-pointer ${
              itemIndex === index ? 'opacity-100 ring-2 ring-[#0066cc]' : 'opacity-50 hover:opacity-80'
            }`}
          >
            <img src={item.src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
