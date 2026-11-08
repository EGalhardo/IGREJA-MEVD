import type { PhotoComment, CommentAuthor } from '../utils/comments';

/**
 * Comentários iniciais das fotografias da galeria.
 *
 * Como o projecto não tem servidor de dados, os comentários vivem nesta
 * semente + no que o utilizador escrever (guardado em `localStorage`).
 */

const MARTA: CommentAuthor = { name: 'Marta Cavaco', initials: 'MC', color: '#0066cc' };
const JOAO: CommentAuthor = { name: 'João Manuel', initials: 'JM', color: '#0ea5e9' };
const ANA: CommentAuthor = { name: 'Ana Lopes', initials: 'AL', color: '#10b981' };
const FILIPE: CommentAuthor = { name: 'Pastor Filipe', initials: 'PF', color: '#8b5cf6' };
const CARLOS: CommentAuthor = { name: 'Carlos Silva', initials: 'CS', color: '#f59e0b' };

/** Comentários de exemplo, usados na primeira vez que a foto é aberta. */
export function seedComments(photoId: string): PhotoComment[] {
  return [
    {
      id: `${photoId}-c1`,
      author: MARTA,
      text: 'Que momento abençoado! O louvor foi ministrado com muita unção. Deus continue a usar o ministério da IGREJA MEVD. 🙏',
      time: 'há 2 horas',
      likes: 24,
      likedByMe: false,
      pinned: true,
      kind: 'testimony',
      replies: [
        {
          id: `${photoId}-c1-r1`,
          author: JOAO,
          text: 'Amém! Também fui muito abençoado por esta foto.',
          time: 'há 1 hora',
          likes: 3,
          likedByMe: false,
          replies: [],
        },
      ],
    },
    {
      id: `${photoId}-c2`,
      author: ANA,
      text: 'Alguém sabe se vai haver transmissão do próximo culto de louvor? Quero acompanhar da minha casa.',
      time: 'ontem',
      likes: 6,
      likedByMe: false,
      kind: 'question',
      replies: [],
    },
    {
      id: `${photoId}-c3`,
      author: FILIPE,
      text: 'Sim, Ana. A transmissão começa às 19:00 na página do evento. Todos estão convidados. 🙌',
      time: 'ontem',
      likes: 41,
      likedByMe: false,
      kind: 'general',
      official: true,
      replies: [],
    },
    {
      id: `${photoId}-c4`,
      author: JOAO,
      text: 'Estive presente com a minha família e fomos muito abençoados. A fotografia ficou linda, já guardei! 📷',
      time: 'há 5 horas',
      likes: 11,
      likedByMe: false,
      kind: 'testimony',
      replies: [],
    },
    {
      id: `${photoId}-c5`,
      author: CARLOS,
      text: 'Guardei esta foto para o meu testemunho de Domingo. Obrigado à equipa de comunicação!',
      time: 'há 2 dias',
      likes: 15,
      likedByMe: false,
      kind: 'testimony',
      replies: [],
    },
  ];
}

/** Chave do `localStorage` usada para guardar os comentários de cada foto. */
export const storageKeyFor = (photoId: string) => `mevd:comentarios:${photoId}`;

/** Chave do `localStorage` do "gosto" na fotografia. */
export const likeKeyFor = (photoId: string) => `mevd:gosto-foto:${photoId}`;

/** Número de gostos inicial de cada fotografia (estável por identificador). */
export function seedLikeCount(photoId: string): number {
  let hash = 0;
  for (let i = 0; i < photoId.length; i += 1) {
    hash = (hash * 31 + photoId.charCodeAt(i)) % 100000;
  }
  return 18 + (hash % 23);
}

/** Lê os comentários guardados; se não existirem, devolve a semente. */
export function loadComments(photoId: string): PhotoComment[] {
  try {
    const stored = window.localStorage.getItem(storageKeyFor(photoId));
    if (!stored) return seedComments(photoId);
    const parsed = JSON.parse(stored) as PhotoComment[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedComments(photoId);
  } catch {
    return seedComments(photoId);
  }
}
