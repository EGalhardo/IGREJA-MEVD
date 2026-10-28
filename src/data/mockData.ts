import { ChurchEvent, UserProfile } from '../types';

export const CHURCH_EVENTS: ChurchEvent[] = [
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
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf76c61?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
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
    image: '/assets/aistudio/2_b0dbb042.png',
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
    image: '/assets/aistudio/3_f31b15f7.png',
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
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    capacity: '200 vagas',
    description:
      'Treinamento e alinhamento ministerial de líderes de departamentos, diáconos e obreiros da igreja para fortalecimento dos ministérios locais e cuidado das ovelhas.',
    highlights: [
      { icon: 'mic', title: 'Direção Pastoral' },
      { icon: 'users', title: 'Capacitação e Mentoria' },
      { icon: 'music', title: 'Consagração Ministerial' },
    ],
  },
];

export const CURRENT_USER: UserProfile = {
  name: 'Edlásio Galhardo',
  status: 'Membro activo',
  avatar: '/assets/aistudio/Foto_de_Perfil__1__bd7124df.png',
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

export const CHURCH_HERO_IMAGE = 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80';
