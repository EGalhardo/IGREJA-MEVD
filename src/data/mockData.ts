import { ChurchEvent, GalleryPhoto, UserProfile } from '../types';

/**
 * Fotografias do álbum dos eventos (galeria).
 * Os ficheiros vivem em `public/assets/events/galeria/`.
 */
const GALLERY_PHOTOS: Array<Omit<GalleryPhoto, 'id'>> = [
  {
    src: '/assets/events/galeria/culto-celebracao.webp',
    caption: 'Igreja reunida em adoração durante o culto',
    tag: 'Adoração',
  },
  {
    src: '/assets/events/galeria/pregacao.webp',
    caption: 'Mensagem ministrada no púlpito',
    tag: 'Pregação',
  },
  {
    src: '/assets/events/galeria/encontro-jovens.webp',
    caption: 'Jovens em comunhão depois do encontro',
    tag: 'Comunhão',
  },
  {
    src: '/assets/events/galeria/louvor.webp',
    caption: 'Ministério de louvor a conduzir a noite',
    tag: 'Louvor',
  },
  {
    src: '/assets/events/galeria/intercessao.webp',
    caption: 'Momento de intercessão pelas famílias',
    tag: 'Intercessão',
  },
  {
    src: '/assets/events/galeria/baptismo.webp',
    caption: 'Baptismo de novas vidas no templo',
    tag: 'Baptismo',
  },
];

/**
 * Constrói o álbum de um evento: a fotografia de destaque do evento abre o
 * álbum e as restantes completam a galeria.
 */
function buildGallery(eventId: string, leadPhotoSrc: string): GalleryPhoto[] {
  const lead = GALLERY_PHOTOS.find((photo) => photo.src === leadPhotoSrc);
  const ordered = lead
    ? [lead, ...GALLERY_PHOTOS.filter((photo) => photo.src !== leadPhotoSrc)]
    : GALLERY_PHOTOS;

  return ordered.map((photo, index) => ({
    id: `${eventId}-foto-${index + 1}`,
    ...photo,
  }));
}

const EVENTOS_BASE: ChurchEvent[] = [
  {
    id: 'congresso-jovens-2027',
    title: 'Congresso de Jovens 2027',
    dateDay: '15',
    dateMonth: 'Mai',
    time: '08:00 - 18:00',
    location: 'Luanda, Angola',
    category: 'Congressos',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/events/maio-intensa-oracao.webp',
    gallery: buildGallery('congresso-jovens-2027', '/assets/events/galeria/encontro-jovens.webp'),
    capacity: '250 vagas',
    description:
      'Um encontro especial para jovens que desejam crescer na fé, fazer novas amizades e viver uma experiência única com Deus.',
    highlights: [
      { icon: 'mic', title: 'Palestrantes convidados' },
      { icon: 'music', title: 'Louvor e adoração' },
      { icon: 'users', title: 'Networking e muito mais' },
    ],
  },
  {
    id: 'vigilia-de-oracao',
    title: 'Vigília de Oração',
    dateDay: '28',
    dateMonth: 'Jun',
    time: '19:00 - 22:00',
    location: 'Sede da Igreja',
    category: 'Vigílias',
    statusBadge: {
      text: 'Pendente',
      variant: 'blue',
    },
    image: '/assets/events/cristo-pascoa.webp',
    capacity: '300 vagas',
    description:
      'Uma noite consagrada à busca espiritual profunda, intercessão pelas famílias, nação e fortalecimento através da palavra e oração conjunta.',
    highlights: [
      { icon: 'mic', title: 'Intercessão guiada' },
      { icon: 'music', title: 'Momentos de clamor' },
      { icon: 'users', title: 'Comunhão fraternal' },
    ],
  },
  {
    id: 'retiro-espiritual',
    title: 'Retiro Espiritual',
    dateDay: '12',
    dateMonth: 'Jul',
    time: '09:00 - 17:00',
    location: 'Província de Talatona',
    category: 'Cultos',
    statusBadge: {
      text: 'Em breve',
      variant: 'purple',
    },
    image: '/assets/events/galeria/encontro-jovens.webp',
    capacity: '120 vagas',
    description:
      'Um tempo de renovação em contacto com a natureza, oficinas temáticas de discipulado e fortalecimento dos laços com o Senhor.',
    highlights: [
      { icon: 'mic', title: 'Estudos bíblicos' },
      { icon: 'music', title: 'Acústico ao ar livre' },
      { icon: 'users', title: 'Dinâmicas em grupo' },
    ],
  },
  {
    id: 'campanha-evangelistica',
    title: 'Campanha Evangelística',
    dateDay: '03',
    dateMonth: 'Ago',
    time: '18:00 - 22:00',
    location: 'Bairro da Samba',
    category: 'Reuniões',
    statusBadge: {
      text: 'Em breve',
      variant: 'purple',
    },
    image: '/assets/events/vasos-disponiveis.webp',
    capacity: '500 vagas',
    description:
      'Cruzada de evangelização e acção social comunitária para levar a mensagem de esperança e fé aos moradores da nossa comunidade.',
    highlights: [
      { icon: 'mic', title: 'Pregação evangelística' },
      { icon: 'music', title: 'Coral da Igreja' },
      { icon: 'users', title: 'Apoio social' },
    ],
  },
  {
    id: 'culto-da-familia-excelente',
    title: 'Culto da Família Excelente',
    dateDay: '07',
    dateMonth: 'Set',
    time: '09:00 - 11:30',
    location: 'Templo Sede MEVD - Luanda',
    category: 'Cultos',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/aistudio/2_edificando_familia_excelente.webp',
    capacity: '600 vagas',
    description:
      'Série especial "Edificando uma Família Excelente" ministrada pelo Pr. Feliz & Pra. Manuela Paulo. Um culto focado nos valores bíblicos do lar, harmonia conjugal e bênção para pais e filhos.',
    highlights: [
      { icon: 'mic', title: 'Pr. Feliz & Pra. Manuela Paulo' },
      { icon: 'music', title: 'Ministério de Louvor MEVD' },
      { icon: 'users', title: 'Unção e Oração pelas Famílias' },
    ],
  },
  {
    id: 'cvd-congresso-jovens-vigilia',
    title: '9º CVD Congresso de Jovens & Vigília',
    dateDay: '17',
    dateMonth: 'Out',
    time: '19:00 - 05:00',
    location: 'Grande Auditório MEVD',
    category: 'Congressos',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/aistudio/3_f31b15f7.webp',
    capacity: '1000 vagas',
    description:
      'Grande Congresso de Jovens e Vigília de Oração com preletores e pastores convidados. Momentos intensos de clamor profético, adoração transformadora e renovo do Espírito Santo.',
    highlights: [
      { icon: 'mic', title: 'Preletores e Pastores Convidados' },
      { icon: 'music', title: 'Vigília de Adoração e Louvor' },
      { icon: 'users', title: 'Juventude MEVD Reunida' },
    ],
  },
  {
    id: 'vigilia-fogo-intercessao',
    title: 'Vigília do Fogo & Intercessão',
    dateDay: '05',
    dateMonth: 'Nov',
    time: '22:00 - 04:30',
    location: 'Templo Sede MEVD',
    category: 'Vigílias',
    statusBadge: {
      text: 'Em breve',
      variant: 'purple',
    },
    image: '/assets/events/tarde-de-louvor.webp',
    capacity: '450 vagas',
    description:
      'Uma noite inteira consagrada à oração fervorosa, intercessão pelas famílias de Angola, libertação de vidas e manifestação do poder de Deus no altar.',
    highlights: [
      { icon: 'mic', title: 'Clamor profético no Altar' },
      { icon: 'music', title: 'Adoração contínua' },
      { icon: 'users', title: 'Comunhão fraternal' },
    ],
  },
  {
    id: 'reuniao-obreiros-discipulado',
    title: 'Reunião Geral de Obreiros & Líderes',
    dateDay: '22',
    dateMonth: 'Nov',
    time: '15:00 - 18:00',
    location: 'Sala de Conferências MEVD',
    category: 'Reuniões',
    statusBadge: {
      text: 'Pendente',
      variant: 'blue',
    },
    image: '/assets/events/galeria/pregacao.webp',
    capacity: '200 vagas',
    description:
      'Treinamento e alinhamento ministerial de líderes de departamentos, diáconos e obreiros da igreja para fortalecimento dos ministérios locais e cuidado das ovelhas.',
    highlights: [
      { icon: 'mic', title: 'Direção Pastoral' },
      { icon: 'users', title: 'Capacitação e Mentoria' },
      { icon: 'music', title: 'Consagração Ministerial' },
    ],
  },
  {
    id: 'culto-celebracao-adorecao',
    title: 'Culto de Celebração e Adoração',
    dateDay: '09',
    dateMonth: 'Mai',
    time: '09:00 - 12:00',
    location: 'Sede Principal • Luanda',
    category: 'Cultos',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/events/galeria/culto-celebracao.webp',
    gallery: buildGallery('culto-celebracao-adorecao', '/assets/events/galeria/culto-celebracao.webp'),
    capacity: '400 lugares',
    description:
      'Manhã de celebração com a igreja reunida em adoração, oração e ministração da Palavra. Traga a sua família e participe deste momento de gratidão a Deus.',
    highlights: [
      { icon: 'music', title: 'Louvor congregacional' },
      { icon: 'mic', title: 'Mensagem pastoral' },
      { icon: 'users', title: 'Oração pelas famílias' },
    ],
  },
  {
    id: 'culto-ensino-pregacao',
    title: 'Culto de Ensino e Pregação',
    dateDay: '20',
    dateMonth: 'Mai',
    time: '18:30 - 20:30',
    location: 'Templo Principal MEVD',
    category: 'Cultos',
    statusBadge: {
      text: 'Em breve',
      variant: 'purple',
    },
    image: '/assets/events/galeria/pregacao.webp',
    gallery: buildGallery('culto-ensino-pregacao', '/assets/events/galeria/pregacao.webp'),
    capacity: '300 lugares',
    description:
      'Noite dedicada ao ensino da Palavra, com exposição bíblica e espaço para perguntas. Uma oportunidade para crescer em doutrina e discipulado.',
    highlights: [
      { icon: 'mic', title: 'Exposição bíblica' },
      { icon: 'users', title: 'Perguntas e respostas' },
      { icon: 'music', title: 'Louvor de abertura' },
    ],
  },
  {
    id: 'encontro-jovens-comunhao',
    title: 'Encontro de Jovens em Comunhão',
    dateDay: '06',
    dateMonth: 'Jun',
    time: '15:00 - 19:00',
    location: 'Salão Juvenil MEVD',
    category: 'Reuniões',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/events/galeria/encontro-jovens.webp',
    gallery: buildGallery('encontro-jovens-comunhao', '/assets/events/galeria/encontro-jovens.webp'),
    capacity: '150 vagas',
    description:
      'Tarde de comunhão e amizade entre os jovens da igreja, com dinâmicas, partilha de testemunhos e um tempo de oração em conjunto.',
    highlights: [
      { icon: 'users', title: 'Dinâmicas de grupo' },
      { icon: 'mic', title: 'Testemunhos' },
      { icon: 'music', title: 'Música ao vivo' },
    ],
  },
  {
    id: 'noite-louvor-adoracao',
    title: 'Noite de Louvor e Adoração',
    dateDay: '26',
    dateMonth: 'Jun',
    time: '19:00 - 22:00',
    location: 'Templo Principal MEVD',
    category: 'Cultos',
    statusBadge: {
      text: 'Inscrições abertas',
      variant: 'green',
    },
    image: '/assets/events/galeria/louvor.webp',
    gallery: buildGallery('noite-louvor-adoracao', '/assets/events/galeria/louvor.webp'),
    capacity: '350 lugares',
    description:
      'Uma noite inteira dedicada à adoração, conduzida pelo ministério de louvor da igreja, com momentos de música, oração e entrega.',
    highlights: [
      { icon: 'music', title: 'Banda e coral' },
      { icon: 'mic', title: 'Ministração' },
      { icon: 'users', title: 'Adoração em conjunto' },
    ],
  },
  {
    id: 'reuniao-intercessao-familias',
    title: 'Reunião de Intercessão pelas Famílias',
    dateDay: '11',
    dateMonth: 'Jul',
    time: '17:00 - 19:00',
    location: 'Sala de Oração MEVD',
    category: 'Vigílias',
    statusBadge: {
      text: 'Pendente',
      variant: 'blue',
    },
    image: '/assets/events/galeria/intercessao.webp',
    gallery: buildGallery('reuniao-intercessao-familias', '/assets/events/galeria/intercessao.webp'),
    capacity: '120 vagas',
    description:
      'Encontro de intercessão dedicado às famílias da igreja, com oração em círculos, partilha de pedidos e clamor pelos lares.',
    highlights: [
      { icon: 'users', title: 'Oração em círculos' },
      { icon: 'mic', title: 'Partilha de pedidos' },
      { icon: 'music', title: 'Adoração suave' },
    ],
  },
  {
    id: 'culto-baptismo-novas-vidas',
    title: 'Culto de Baptismo — Novas Vidas',
    dateDay: '01',
    dateMonth: 'Ago',
    time: '10:00 - 12:30',
    location: 'Templo Principal MEVD',
    category: 'Cultos',
    statusBadge: {
      text: 'Em breve',
      variant: 'purple',
    },
    image: '/assets/events/galeria/baptismo.webp',
    gallery: buildGallery('culto-baptismo-novas-vidas', '/assets/events/galeria/baptismo.webp'),
    capacity: '400 lugares',
    description:
      'Celebração do baptismo de novos irmãos na fé, com testemunhos, oração e acolhimento pela igreja. Um dia especial para toda a família MEVD.',
    highlights: [
      { icon: 'users', title: 'Acolhimento dos novos membros' },
      { icon: 'mic', title: 'Testemunhos' },
      { icon: 'music', title: 'Coral da igreja' },
    ],
  },
];

/**
 * Todo o evento tem album. Os 7 eventos que ja trazem um album curado ficam
 * como estao; aos restantes e montado o album padrao (as mesmas 6 fotografias
 * de `GALLERY_PHOTOS`), com a fotografia de destaque do evento a abrir a lista.
 * Assim a pagina "Detalhes do Evento" mostra sempre o separador "Galeria",
 * venha o evento da Home, da agenda ou de uma ligacao directa.
 */
export const CHURCH_EVENTS: ChurchEvent[] = EVENTOS_BASE.map((event) =>
  event.gallery && event.gallery.length > 0
    ? event
    : { ...event, gallery: buildGallery(event.id, event.image) }
);

/** Campos de um evento considerados pela pesquisa (título, local, descrição, etc.). */
export function eventSearchValues(event: ChurchEvent): Array<string | undefined> {
  return [
    event.title,
    event.location,
    event.category,
    event.description,
    event.time,
    event.dateDay,
    event.dateMonth,
    event.capacity,
    ...(event.highlights ?? []).map((highlight) => highlight.title),
  ];
}

export const CURRENT_USER: UserProfile = {
  name: 'Edlásio Galhardo',
  status: 'Membro activo',
  avatar: '/assets/aistudio/Foto_de_Perfil__1__bd7124df.webp',
  civilStatus: 'Casado(a)',
  phone: '+244 923 456 789',
  address: 'Rua do Sanatório, Morro Bento, Luanda',
  email: 'edlasiogalhardo@gmail.com',
  churchName: 'IGREJA MEVD',
  activitiesCount: {
    eventsRegistered: 5,
    departments: 2,
  },
  notificationsActive: true,
};

