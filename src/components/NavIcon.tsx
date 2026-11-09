import UseAnimations, { type Animation } from 'react-useanimations';
import homeAnimation from 'react-useanimations/lib/home';
import calendarAnimation from 'react-useanimations/lib/calendar';
import bookOpenAnimation from 'react-useanimations/lib/bookOpen';
import userAnimation from 'react-useanimations/lib/user';

/**
 * Ícones animados da navegação (Lottie, só traço — licença MIT: useAnimations).
 *
 * Comportamento:
 *  - separador ACTIVO   → anima em ciclo contínuo (`interaction="loop"`)
 *  - separador INACTIVO → fica parado no primeiro frame e toca uma vez ao clique
 *  - `prefers-reduced-motion` → fica sempre estático (tratado pela biblioteca)
 *
 * A cor vem de `currentColor`, por isso acompanha o azul do separador activo
 * e a variante clara do tema escuro sem ficheiros adicionais.
 */

export type NavIconName = 'home' | 'events' | 'bible' | 'profile';

const ANIMACOES: Record<NavIconName, Animation> = {
  home: homeAnimation,
  events: calendarAnimation,
  bible: bookOpenAnimation,
  profile: userAnimation,
};

interface NavIconProps {
  name: NavIconName;
  /** Lado do ícone em px — 20 no navbar do telemóvel, 16 na navegação lateral. */
  size?: number;
  /** `true` quando a página deste separador está aberta (anima em ciclo). */
  active?: boolean;
  className?: string;
}

export default function NavIcon({ name, size = 20, active = false, className = '' }: NavIconProps) {
  return (
    <UseAnimations
      animation={ANIMACOES[name]}
      size={size}
      interaction={active ? 'loop' : 'click-replay'}
      className={`nav-icon shrink-0 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
