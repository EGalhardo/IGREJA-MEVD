interface ChurchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'appbar';
}

export default function ChurchLogo({ className = '', size = 'md' }: ChurchLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-1.5',
    lg: 'w-12 h-12 p-2',
    // Appbar mobile: caixa 40px com 4px de margem -> imagem 32px
    // (a arte tem 6% de respiro, logo a chama visivel fica ~28px,
    // igual ao diametro da foto de perfil no appbar mobile)
    appbar: 'w-10 h-10 p-1',
  }[size];

  return (
    <div
      className={`rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden ${sizeClasses} ${className}`}
    >
      <img
        src="/assets/aistudio/MEVD_LOGO_02.webp"
        alt="Logomarca Igreja mevd."
        className="w-full h-full object-contain select-none"
      />
    </div>
  );
}
