import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, MessageSquare, Send, Smile, ImagePlus, ChevronDown } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { seedComments, storageKeyFor } from '../data/commentsData';
import {
  addComment,
  addReply,
  countComments,
  createComment,
  formatCount,
  initialsOf,
  isValidComment,
  sortComments,
  toggleLike,
  type CommentAuthor,
  type CommentOrder,
  type PhotoComment,
} from '../utils/comments';

interface PhotoCommentsProps {
  /** Identificador da fotografia (cada foto tem o seu mural) */
  photoId: string;
  /** Nome do evento, mostrado no subtítulo */
  eventTitle: string;
}

const me: CommentAuthor = {
  name: CURRENT_USER.name,
  initials: initialsOf(CURRENT_USER.name),
  color: '#0066cc',
  avatar: CURRENT_USER.avatar,
};

function Avatar({ author, size = 32 }: { author: CommentAuthor; size?: number }) {
  return author.avatar ? (
    <img
      src={author.avatar}
      alt={author.name}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      style={{ width: size, height: size, background: author.color, fontSize: Math.round(size * 0.34) }}
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white"
      aria-hidden="true"
    >
      {author.initials}
    </span>
  );
}

export default function PhotoComments({ photoId, eventTitle }: PhotoCommentsProps) {
  const [comments, setComments] = useState<PhotoComment[]>(() => seedComments(photoId));
  const [draft, setDraft] = useState('');
  const [order, setOrder] = useState<CommentOrder>('recent');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [showAll, setShowAll] = useState(false);
  const loadedRef = useRef<string>('');

  // Carrega o que já existe para esta fotografia (guardado no browser)
  useEffect(() => {
    loadedRef.current = photoId;
    try {
      const stored = window.localStorage.getItem(storageKeyFor(photoId));
      setComments(stored ? (JSON.parse(stored) as PhotoComment[]) : seedComments(photoId));
    } catch {
      setComments(seedComments(photoId));
    }
    setDraft('');
    setReplyTo(null);
    setShowAll(false);
  }, [photoId]);

  // Guarda sempre que a lista muda (só depois de carregada)
  useEffect(() => {
    if (loadedRef.current !== photoId) return;
    try {
      window.localStorage.setItem(storageKeyFor(photoId), JSON.stringify(comments));
    } catch {
      // Sem armazenamento disponível: a sessão continua a funcionar em memória.
    }
  }, [comments, photoId]);

  const total = useMemo(() => countComments(comments), [comments]);
  const ordered = useMemo(() => sortComments(comments, order), [comments, order]);
  const visible = showAll ? ordered : ordered.slice(0, 3);

  const submit = () => {
    if (!isValidComment(draft)) return;
    setComments((list) => addComment(list, createComment(draft, me)));
    setDraft('');
  };

  const submitReply = (parentId: string) => {
    if (!isValidComment(replyDraft)) return;
    setComments((list) => addReply(list, parentId, createComment(replyDraft, me)));
    setReplyDraft('');
    setReplyTo(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      {/* Cabeçalho */}
      <div className="shrink-0 border-b border-[#E2E8F0] px-4 pb-2.5 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-slate-900">
            Comentários <span className="font-bold text-slate-500">({formatCount(total)})</span>
          </h3>
          <button
            onClick={() => setOrder((current) => (current === 'recent' ? 'oldest' : 'recent'))}
            className="flex items-center gap-1 text-[11px] font-bold text-[#0066cc] hover:underline cursor-pointer"
          >
            {order === 'recent' ? 'Mais recentes' : 'Mais antigos'}
            <ChevronDown className="h-3 w-3 stroke-[2.6]" />
          </button>
        </div>
        <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-500">
          Participe na conversa • {eventTitle}
        </p>
      </div>

      {/* Caixa de escrita */}
      <div className="shrink-0 border-b border-[#E2E8F0] bg-slate-50 px-4 py-3">
        <div className="flex gap-2.5">
          <Avatar author={me} />
          <div className="min-w-0 flex-1">
            <label htmlFor={`comment-${photoId}`} className="sr-only">
              Escreva um comentário
            </label>
            <textarea
              id={`comment-${photoId}`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              maxLength={500}
              placeholder="Escreva um comentário..."
              className="h-11 w-full resize-none rounded-2xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[11.5px] leading-snug text-slate-700 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-slate-400">
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                <Smile className="h-4 w-4" aria-hidden="true" />
                <span className="text-[9.5px] font-semibold">{draft.trim().length}/500</span>
              </div>
              <button
                onClick={submit}
                disabled={!isValidComment(draft)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0066cc] px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#0055aa] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-3 w-3 stroke-[2.4]" />
                Comentar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="overscroll-contain lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {visible.length === 0 && (
          <p className="px-4 py-6 text-center text-[11px] font-semibold text-slate-500">
            Ainda não há comentários nesta fotografia. Seja o primeiro a comentar.
          </p>
        )}

        {visible.map((comment) => (
          <article key={comment.id} className="border-b border-slate-100 px-4 py-3">
            <div className="flex gap-2.5">
              <Avatar author={comment.author} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900">{comment.author.name}</span>
                  {comment.pinned && (
                    <span className="rounded-full border border-[#dbe7f6] bg-blue-50 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide text-[#0066cc]">
                      Fixado
                    </span>
                  )}
                  <span className="text-[9.5px] font-bold text-slate-500">{comment.time}</span>
                </div>

                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-700">{comment.text}</p>

                <div className="mt-1.5 flex items-center gap-3.5 text-[10px] font-bold text-slate-500">
                  <button
                    onClick={() => setComments((list) => toggleLike(list, comment.id))}
                    aria-pressed={comment.likedByMe}
                    className={`flex items-center gap-1 transition-colors cursor-pointer hover:text-[#0066cc] ${
                      comment.likedByMe ? 'text-[#0066cc]' : ''
                    }`}
                  >
                    <Heart
                      className={`h-3 w-3 ${comment.likedByMe ? 'fill-current stroke-[2.4]' : 'stroke-[2.2]'}`}
                    />
                    {formatCount(comment.likes)}
                  </button>

                  <button
                    onClick={() => {
                      setReplyTo(replyTo === comment.id ? null : comment.id);
                      setReplyDraft('');
                    }}
                    className="hover:text-[#0066cc] transition-colors cursor-pointer"
                  >
                    Responder
                  </button>

                  {comment.replies.length > 0 && (
                    <span className="flex items-center gap-1 text-[#0066cc]">
                      <MessageSquare className="h-3 w-3 stroke-[2.2]" />
                      {comment.replies.length} resposta{comment.replies.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                {/* Respostas */}
                {comment.replies.length > 0 && (
                  <div className="mt-2 space-y-2.5 border-l-2 border-slate-100 pl-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <Avatar author={reply.author} size={26} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10.5px] font-bold text-slate-900">
                              {reply.author.name}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500">{reply.time}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-700">{reply.text}</p>
                          <button
                            onClick={() => setComments((list) => toggleLike(list, reply.id))}
                            aria-pressed={reply.likedByMe}
                            className={`mt-1 flex items-center gap-1 text-[9.5px] font-bold transition-colors cursor-pointer hover:text-[#0066cc] ${
                              reply.likedByMe ? 'text-[#0066cc]' : 'text-slate-500'
                            }`}
                          >
                            <Heart
                              className={`h-2.5 w-2.5 ${reply.likedByMe ? 'fill-current stroke-[2.4]' : 'stroke-[2.2]'}`}
                            />
                            {formatCount(reply.likes)}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Campo de resposta */}
                {replyTo === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <Avatar author={me} size={26} />
                    <div className="min-w-0 flex-1">
                      <input
                        value={replyDraft}
                        onChange={(event) => setReplyDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            submitReply(comment.id);
                          }
                        }}
                        maxLength={500}
                        autoFocus
                        placeholder={`Responder a ${comment.author.name.split(' ')[0]}...`}
                        aria-label={`Responder a ${comment.author.name}`}
                        className="w-full rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-2 text-[11px] text-slate-700 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none"
                      />
                      <div className="mt-1.5 flex justify-end gap-2">
                        <button
                          onClick={() => setReplyTo(null)}
                          className="rounded-lg px-2 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => submitReply(comment.id)}
                          disabled={!isValidComment(replyDraft)}
                          className="rounded-lg bg-[#0066cc] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#0055aa] disabled:opacity-40 cursor-pointer"
                        >
                          Responder
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}

        {!showAll && ordered.length > 3 && (
          <div className="px-4 py-3">
            <button
              onClick={() => setShowAll(true)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[11px] font-bold text-[#0066cc] transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Ver os {total} comentários
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
