export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  /** Passagem bíblica base do sermão. */
  reference: string;
  /** Duração do áudio incluído na aplicação. */
  duration: string;
  /** Ficheiro de áudio incluído no projeto (public/assets/audio). */
  audioSrc: string;
}

/**
 * Sermões recentes com áudio incluído na aplicação.
 * Os ficheiros são locais, por isso tocam também sem ligação à internet.
 */
export const RECENT_SERMONS: Sermon[] = [
  {
    id: 'vencendo-gigantes',
    title: 'Vencendo Gigantes pela Fé',
    speaker: 'Pr. Feliz Paulo',
    reference: '1 Samuel 17:45-47',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-01-vencendo-gigantes.mp3',
  },
  {
    id: 'oracao-em-unidade',
    title: 'O Poder da Oração em Unidade',
    speaker: 'Pra. Manuela Paulo',
    reference: 'Atos 12:5-7',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-02-oracao-em-unidade.mp3',
  },
  {
    id: 'fe-que-move-montanhas',
    title: 'A Fé que Move Montanhas',
    speaker: 'Pr. Feliz Paulo',
    reference: 'Marcos 11:22-24',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-03-fe-que-move-montanhas.mp3',
  },
  {
    id: 'restaurados-pela-graca',
    title: 'Restaurados pela Graça',
    speaker: 'Pra. Manuela Paulo',
    reference: 'Lucas 15:17-20',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-04-restaurados-pela-graca.mp3',
  },
  {
    id: 'caminho-da-verdadeira-paz',
    title: 'O Caminho da Verdadeira Paz',
    speaker: 'Pr. Feliz Paulo',
    reference: 'João 14:27',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-05-caminho-da-verdadeira-paz.mp3',
  },
  {
    id: 'forca-na-fraqueza',
    title: 'Força na Fraqueza',
    speaker: 'Pr. Feliz Paulo',
    reference: '2 Coríntios 12:9-10',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-06-forca-na-fraqueza.mp3',
  },
  {
    id: 'amor-que-transforma',
    title: 'O Amor que Transforma',
    speaker: 'Pra. Manuela Paulo',
    reference: '1 Coríntios 13:4-7',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-07-amor-que-transforma.mp3',
  },
  {
    id: 'esperanca-que-nao-decepciona',
    title: 'Esperança que Não Decepciona',
    speaker: 'Pra. Manuela Paulo',
    reference: 'Romanos 5:3-5',
    duration: '1 min',
    audioSrc: '/assets/audio/sermao-08-esperanca-que-nao-decepciona.mp3',
  },
];
