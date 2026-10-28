import { useState, useEffect } from 'react';
import { Church, Music, BookOpen, Users, User, Calendar, Image as ImageIcon } from 'lucide-react';

export interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackType?: 'church' | 'concert' | 'prayer' | 'nature' | 'avatar' | 'crowd' | 'event';
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackSrc,
  fallbackType = 'church',
  loading = 'lazy',
  onClick,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [triedFallbackSrc, setTriedFallbackSrc] = useState(false);

  // Sync state if src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setTriedFallbackSrc(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && !triedFallbackSrc && fallbackSrc !== currentSrc) {
      setTriedFallbackSrc(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center select-none overflow-hidden ${
          fallbackType === 'avatar'
            ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white'
            : fallbackType === 'concert'
            ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-purple-200'
            : fallbackType === 'prayer'
            ? 'bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900 text-amber-200'
            : fallbackType === 'nature'
            ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-emerald-200'
            : fallbackType === 'event'
            ? 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-blue-200'
            : 'bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900 text-blue-200'
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackType === 'avatar' && <User className="w-1/2 h-1/2 stroke-[2] opacity-85" />}
        {fallbackType === 'concert' && <Music className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
        {fallbackType === 'prayer' && <BookOpen className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
        {fallbackType === 'nature' && <BookOpen className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
        {fallbackType === 'church' && <Church className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
        {fallbackType === 'crowd' && <Users className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
        {fallbackType === 'event' && <Calendar className="w-1/3 h-1/3 stroke-[2] opacity-85" />}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={loading}
      onClick={onClick}
    />
  );
}
