import { useState } from 'react';
import { Church, Music, BookOpen, Users, User } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'church' | 'concert' | 'prayer' | 'nature' | 'avatar' | 'crowd';
}

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackType = 'church',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${
          fallbackType === 'avatar'
            ? 'from-blue-600 to-indigo-700 text-white'
            : fallbackType === 'concert'
            ? 'from-indigo-900 via-blue-800 to-purple-900 text-white'
            : fallbackType === 'prayer'
            ? 'from-amber-900 via-yellow-800 to-amber-950 text-amber-200'
            : fallbackType === 'nature'
            ? 'from-emerald-800 via-teal-700 to-sky-800 text-emerald-200'
            : 'from-blue-900 to-slate-900 text-blue-200'
        } ${className}`}
      >
        {fallbackType === 'avatar' && <User className="w-1/2 h-1/2 stroke-[2]" />}
        {fallbackType === 'concert' && <Music className="w-1/3 h-1/3 stroke-[2]" />}
        {fallbackType === 'prayer' && <BookOpen className="w-1/3 h-1/3 stroke-[2]" />}
        {fallbackType === 'nature' && <BookOpen className="w-1/3 h-1/3 stroke-[2]" />}
        {fallbackType === 'church' && <Church className="w-1/3 h-1/3 stroke-[2]" />}
        {fallbackType === 'crowd' && <Users className="w-1/3 h-1/3 stroke-[2]" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
