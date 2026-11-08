/**
 * Lógica dos comentários das fotografias da galeria do evento.
 *
 * As funções são puras (sem React e sem browser) para poderem ser testadas
 * e reutilizadas pelo componente `PhotoComments`.
 */

export interface CommentAuthor {
  name: string;
  /** Iniciais mostradas no avatar quando não há fotografia */
  initials: string;
  /** Cor de fundo do avatar */
  color: string;
  avatar?: string;
}

export interface PhotoComment {
  id: string;
  author: CommentAuthor;
  text: string;
  /** Etiqueta relativa: "há 2 horas", "ontem", ... */
  time: string;
  likes: number;
  likedByMe: boolean;
  pinned?: boolean;
  replies: PhotoComment[];
}

export type CommentOrder = 'recent' | 'oldest';

const normalize = (text: string) => text.trim().replace(/\s+/g, ' ');

/** Texto aceitável? (entre 1 e 500 caracteres depois de limpo) */
export function isValidComment(text: string): boolean {
  const clean = normalize(text);
  return clean.length > 0 && clean.length <= 500;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Cria um comentário novo (já validado) para uma fotografia. */
export function createComment(
  text: string,
  author: CommentAuthor,
  options: { id: string; time?: string; pinned?: boolean } = { id: '' }
): PhotoComment {
  return {
    id: options.id || `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    author,
    text: normalize(text),
    time: options.time ?? 'agora',
    likes: 0,
    likedByMe: false,
    pinned: options.pinned,
    replies: [],
  };
}

/** Adiciona um comentário à lista (no topo, como no YouTube). */
export function addComment(list: PhotoComment[], comment: PhotoComment): PhotoComment[] {
  return [comment, ...list];
}

/** Adiciona uma resposta dentro de um comentário. */
export function addReply(
  list: PhotoComment[],
  parentId: string,
  reply: PhotoComment
): PhotoComment[] {
  return list.map((comment) =>
    comment.id === parentId
      ? { ...comment, replies: [...comment.replies, reply] }
      : comment
  );
}

/** Alterna o "gosto" de um comentário (principal ou resposta). */
export function toggleLike(list: PhotoComment[], commentId: string): PhotoComment[] {
  const apply = (comment: PhotoComment): PhotoComment => {
    if (comment.id === commentId) {
      const likedByMe = !comment.likedByMe;
      return { ...comment, likedByMe, likes: Math.max(0, comment.likes + (likedByMe ? 1 : -1)) };
    }
    if (comment.replies.length > 0) {
      return { ...comment, replies: comment.replies.map(apply) };
    }
    return comment;
  };

  return list.map(apply);
}

/** Total de comentários (principais + respostas). */
export function countComments(list: PhotoComment[]): number {
  return list.reduce((total, comment) => total + 1 + comment.replies.length, 0);
}

/**
 * Ordena a lista: os comentários fixados ficam sempre no topo e os restantes
 * seguem por ordem de chegada.
 */
export function sortComments(list: PhotoComment[], order: CommentOrder): PhotoComment[] {
  const pinned = list.filter((comment) => comment.pinned);
  const rest = list.filter((comment) => !comment.pinned).slice();
  if (order === 'oldest') rest.reverse();
  return [...pinned, ...rest];
}

/** Formata números grandes como no YouTube (1 200 -> 1,2 mil). */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace('.0', '').replace('.', ',')} mil`;
}
