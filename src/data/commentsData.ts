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
      author: JOAO,
      text: 'Estive presente com a minha família e fomos muito abençoados. A fotografia ficou linda, já guardei! 📷',
      time: 'há 5 horas',
      likes: 11,
      likedByMe: false,
      replies: [],
    },
    {
      id: `${photoId}-c3`,
      author: ANA,
      text: 'Alguém sabe se vai haver transmissão do próximo culto de louvor? Quero acompanhar da minha casa.',
      time: 'ontem',
      likes: 6,
      likedByMe: false,
      replies: [],
    },
  ];
}

/** Chave do `localStorage` usada para guardar os comentários de cada foto. */
export const storageKeyFor = (photoId: string) => `mevd:comentarios:${photoId}`;
