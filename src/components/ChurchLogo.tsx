interface ChurchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ChurchLogo({ className = '', size = 'md' }: ChurchLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-1.5',
    lg: 'w-12 h-12 p-2',
  }[size];

  return (
    <div
      className={`rounded-2xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-[#E2E8F0] overflow-hidden ${sizeClasses} ${className}`}
    >
      <img
        src="/assets/aistudio/MEVD_LOGO_850e0f87.png"
        alt="Logomarca IGREJA MEVD"
        className="w-full h-full object-contain select-none"
      />
    </div>
  );
}
