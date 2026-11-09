import { BibleBook } from './bibleData';

/**
 * Ilustração bíblica que abre cada capítulo, no topo do mesmo cartão do texto.
 *
 * A escolha é feita por três níveis, do mais específico para o mais geral:
 *   1. capítulo  (ex.: Génesis 1, Mateus 27, Salmos 23)
 *   2. livro     (ex.: Salmos → o bom pastor)
 *   3. grupo/categoria do livro (ex.: Evangelhos → Jesus a ensinar)
 *
 * As imagens estão em `public/assets/biblia` (1280×560, JPEG), por isso
 * aparecem também sem ligação à Internet.
 */

interface ChapterImage {
  /** Caminho final da imagem. */
  src: string;
  /** Legenda curta mostrada sobre a imagem. */
  caption: string;
  /** Texto alternativo (acessibilidade). */
  alt: string;
}

type ImageArt = Omit<ChapterImage, 'src'> & { file: string };

const ART: Record<string, ImageArt> = {
  criacao: {
    file: 'criacao',
    caption: 'A criação do mundo',
    alt: 'Ilustração da criação: luz divina sobre as águas primitivas e a terra a surgir',
  },
  exodo: {
    file: 'exodo',
    caption: 'O êxodo do povo de Israel',
    alt: 'Ilustração do êxodo: caminho aberto entre paredes de água e o povo de Israel a atravessar',
  },
  'tabuas-lei': {
    file: 'tabuas-lei',
    caption: 'As tábuas da Lei no Sinai',
    alt: 'Ilustração das tábuas da Lei sobre o monte Sinai, entre nuvens e relâmpagos',
  },
  reino: {
    file: 'reino',
    caption: 'Jerusalém e o reino de Israel',
    alt: 'Ilustração das muralhas de Jerusalém ao pôr do sol, com harpa e coroa em primeiro plano',
  },
  pastor: {
    file: 'pastor',
    caption: 'O bom pastor e o seu rebanho',
    alt: 'Ilustração de um pastor de robes antigas a conduzir ovelhas junto a águas tranquilas',
  },
  sabedoria: {
    file: 'sabedoria',
    caption: 'A Palavra e a sabedoria',
    alt: 'Ilustração de um rolo antigo aberto e de uma candeia de azeite a iluminar uma mesa de pedra',
  },
  profetas: {
    file: 'profetas',
    caption: 'O profeta anuncia a Palavra',
    alt: 'Ilustração de um profeta com um rolo na mão, sob um céu de brasas e nuvens de tempestade',
  },
  nascimento: {
    file: 'nascimento',
    caption: 'O nascimento de Jesus',
    alt: 'Ilustração do nascimento de Jesus numa manjedoura, sob a luz de uma estrela',
  },
  'jesus-ensina': {
    file: 'jesus-ensina',
    caption: 'Jesus Cristo a ensinar',
    alt: 'Ilustração de Jesus Cristo a ensinar uma multidão sentada numa colina da Galileia',
  },
  cruz: {
    file: 'cruz',
    caption: 'A crucificação no Calvário',
    alt: 'Ilustração reverente das três cruzes no Calvário, sob nuvens de tempestade e um raio de luz',
  },

  /* As entradas seguintes reaproveitam uma arte já existente com a legenda
     própria do contexto, até existir uma ilustração dedicada. */
  ressurreição: {
    file: 'jesus-ensina',
    caption: 'Jesus Cristo, vivo depois da ressurreição',
    alt: 'Ilustração de Jesus Cristo vivo, a falar com os seus discípulos',
  },
  pentecostes: {
    file: 'profetas',
    caption: 'O fogo do Espírito Santo',
    alt: 'Ilustração de fogo e brasas no céu, evocando o dia de Pentecostes',
  },
  cartas: {
    file: 'sabedoria',
    caption: 'As cartas aos primeiros cristãos',
    alt: 'Ilustração de um rolo e de uma candeia, evocando as cartas apostólicas',
  },
  'novo-ceu': {
    file: 'criacao',
    caption: 'Novo céu e nova terra',
    alt: 'Ilustração de luz divina sobre a terra renovada, evocando a nova criação',
  },
};

/** Capítulos com ilustração própria (os mais conhecidos). */
const BY_CHAPTER: Record<string, string> = {
  'genesis-1': 'criacao',
  'genesis-2': 'criacao',
  'exodo-20': 'tabuas-lei',
  'deuteronomio-5': 'tabuas-lei',
  'salmos-23': 'pastor',
  'salmos-91': 'pastor',
  'salmos-121': 'pastor',
  'mateus-1': 'nascimento',
  'mateus-2': 'nascimento',
  'lucas-1': 'nascimento',
  'lucas-2': 'nascimento',
  'mateus-5': 'jesus-ensina',
  'mateus-6': 'jesus-ensina',
  'mateus-7': 'jesus-ensina',
  'joao-3': 'jesus-ensina',
  'mateus-27': 'cruz',
  'marcos-15': 'cruz',
  'lucas-23': 'cruz',
  'joao-19': 'cruz',
  'isaias-53': 'cruz',
  'mateus-28': 'ressurreição',
  'marcos-16': 'ressurreição',
  'lucas-24': 'ressurreição',
  'joao-20': 'ressurreição',
  'joao-21': 'ressurreição',
  'atos-1': 'ressurreição',
  'atos-2': 'pentecostes',
  'apocalipse-21': 'novo-ceu',
  'apocalipse-22': 'novo-ceu',
};

/** Livros com ilustração própria. */
const BY_BOOK: Record<string, string> = {
  genesis: 'criacao',
  salmos: 'pastor',
  proverbios: 'sabedoria',
  eclesiastes: 'sabedoria',
  canticos: 'sabedoria',
  job: 'profetas',
  atos: 'pentecostes',
  apocalipse: 'novo-ceu',
};

/** Ilustração de base de cada grupo de livros. */
const BY_CATEGORY: Record<string, string> = {
  Pentateuco: 'exodo',
  Históricos: 'reino',
  Poéticos: 'pastor',
  'Profetas Maiores': 'profetas',
  'Profetas Menores': 'profetas',
  Evangelhos: 'jesus-ensina',
  Histórico: 'pentecostes',
  'Cartas Paulinas': 'cartas',
  'Cartas Gerais': 'cartas',
  Profecia: 'novo-ceu',
};

const FALLBACK = 'criacao';

/** Devolve a ilustração que representa o capítulo aberto. */
export function getChapterImage(book: BibleBook, chapter: number): ChapterImage {
  const key =
    BY_CHAPTER[`${book.id}-${chapter}`] ??
    BY_BOOK[book.id] ??
    BY_CATEGORY[book.category] ??
    FALLBACK;

  const art = ART[key] ?? ART[FALLBACK];
  const base = import.meta.env.BASE_URL || '/';

  return {
    src: `${base}assets/biblia/${art.file}.jpg`,
    caption: art.caption,
    alt: art.alt,
  };
}
