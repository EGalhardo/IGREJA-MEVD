import { Signal, Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  variant?: 'light' | 'dark';
  forceVisible?: boolean;
}

export default function StatusBar({ variant = 'dark', forceVisible = false }: StatusBarProps) {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-slate-900';

  return (
    <div
      className={`w-full ${
        forceVisible ? 'flex' : 'flex md:hidden'
      } items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold ${textColor} select-none transition-colors`}
    >
      {/* Time */}
      <span className="font-semibold tracking-tight text-[13px]">9:41</span>

      {/* Dynamic island / notch subtle spacing */}
      <div className="w-20 h-4 bg-transparent" />

      {/* System Icons (100% Lucide Icons) */}
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <Battery className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
}
