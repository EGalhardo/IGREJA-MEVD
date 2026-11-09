import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, MessageSquare, Search, Send, Smile, ImagePlus, BadgeCheck } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { loadComments, storageKeyFor } from '../data/commentsData';
import {
  addComment,
  addReply,
  countComments,
  createComment,
  filterComments,
  formatCount,
  initialsOf,
  isValidComment,
  sortComments,
  toggleLike,
  type CommentAuthor,
  type CommentFilter,
  type CommentOrder,
  type PhotoComment,
} from '../utils/comments';

interface PhotoCommentsProps {
  /** Identificador da fotografia (cada foto tem o seu mural) */
  photoId: string;
}

const FILTERS: { id: CommentFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'question', label: 'Perguntas' },
  { id: 'testimony', label: 'Testemunhos' },
  { id: 'pinned', label: 'Fixados' },
];

const VISIBLE_STEP = 3;

const me: CommentAuthor = {
  name: CURRENT_USER.name,
  initials: initialsOf(CURRENT_USER.name),
  color: '#0066cc',
  avatar: CURRENT_USER.avatar,
};

function Avatar({ author, size = 30 }: { author: CommentAuthor; size?: number }) {
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

export default function PhotoComments({ photoId }: PhotoCommentsProps) {
  const [comments, setComments] = useState<PhotoComment[]>(() => loadComments(photoId));
  const [draft, setDraft] = useState('');
  const [order, setOrder] = useState<CommentOrder>('recent');
  const [filter, setFilter] = useState<CommentFilter>('all');
  const [query, setQuery] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP);
  const loadedRef = useRef<string>(photoId);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  // Carrega o mural desta fotografia
  useEffect(() => {
    loadedRef.current = photoId;
    setComments(loadComments(photoId));
    setDraft('');
    setFilter('all');
    setQuery('');
    setReplyTo(null);
    setVisibleCount(VISIBLE_STEP);
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

  const filtered = useMemo(() => sortComments(filterComments(comments, filter, query), order), [
    comments,
    filter,
    query,
    order,
  ]);
  const visible = filtered.slice(0, visibleCount);
  const hidden = filtered.length - visible.length;

  const submit = () => {
    if (!isValidComment(draft)) return;
    setComments((list) => addComment(list, createComment(draft, me)));
    setDraft('');
    setFilter('all');
    setVisibleCount((count) => count + 1);
  };

  const submitReply = (parentId: string) => {
    if (!isValidComment(replyDraft)) return;
    setComments((list) => addReply(list, parentId, createComment(replyDraft, me)));
    setReplyDraft('');
    setReplyTo(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Cabeçalho: contagem + filtros + pesquisa */}
      <div className="shrink-0 border-b border-[#E2E8F0] px-4 pb-2.5 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-slate-900">
            Comentários
            <span className="ml-1.5 rounded-full border border-[#dbe7f6] bg-blue-50 px-1.5 py-0.5 text-[9.5px] font-extrabold text-[#0066cc]">
              {formatCount(total)}
            </span>
          </h3>
          <button
            onClick={() => setOrder((current) => (current === 'recent' ? 'oldest' : 'recent'))}
            className="shrink-0 text-[10.5px] font-bold text-[#0066cc] hover:underline cursor-pointer"
          >
            {order === 'recent' ? 'Mais recentes' : 'Mais antigos'}
          </button>
        </div>

        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="Filtrar comentários">
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(item.id);
                  setVisibleCount(VISIBLE_STEP);
                }}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] px-2.5 py-1.5">
          <Search className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
          <label htmlFor={`busca-${photoId}`} className="sr-only">
            Procurar numa mensagem
          </label>
          <input
            id={`busca-${photoId}`}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(VISIBLE_STEP);
            }}
            placeholder="Procurar numa mensagem..."
            className="w-full bg-transparent text-[10.5px] font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="overscroll-contain lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {visible.length === 0 && (
          <p className="px-4 py-6 text-center text-[11px] font-semibold text-slate-500">
            {query.trim()
              ? `Nenhuma mensagem com “${query.trim()}”.`
              : filter === 'pinned'
                ? 'Ainda não há mensagens fixadas nesta fotografia.'
                : 'Ainda não há mensagens nesta fotografia. Seja o primeiro a comentar.'}
          </p>
        )}

        {visible.map((comment) => (
          <article key={comment.id} className="border-b border-slate-100 px-4 py-3">
            <div className="flex gap-2.5">
              <Avatar author={comment.author} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900">{comment.author.name}</span>
                  {comment.official && (
                    <span className="flex items-center gap-0.5 rounded-full bg-slate-900 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide text-white">
                      <BadgeCheck className="h-2.5 w-2.5 stroke-[2.6]" />
                      Igreja
                    </span>
                  )}
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
                    aria-label={`Gosto na mensagem de ${comment.author.name}`}
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
                        <Avatar author={reply.author} size={24} />
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
                            aria-label={`Gosto na resposta de ${reply.author.name}`}
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
                    <Avatar author={me} size={24} />
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

        {hidden > 0 && (
          <div className="px-4 py-3">
            <button
              onClick={() => setVisibleCount((count) => count + VISIBLE_STEP)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-[11px] font-bold text-[#0066cc] transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Ver as {formatCount(hidden)} mensagens anteriores
            </button>
          </div>
        )}
      </div>

      {/* Campo de escrita sempre visível no fundo do painel */}
      <div className="sticky bottom-0 z-10 shrink-0 border-t border-[#E2E8F0] bg-white px-4 pb-3 pt-2.5 shadow-[0_-8px_18px_-14px_rgba(15,23,42,0.4)]">
        <div className="flex items-end gap-2.5">
          <Avatar author={me} />
          <div className="min-w-0 flex-1">
            <label htmlFor={`comment-${photoId}`} className="sr-only">
              Escreva um comentário
            </label>
            <textarea
              id={`comment-${photoId}`}
              ref={draftRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              rows={1}
              maxLength={500}
              placeholder="Escreva uma mensagem..."
              className="h-10 w-full resize-none rounded-2xl border border-[#E2E8F0] bg-slate-50 px-3 py-2.5 text-[11.5px] leading-snug text-slate-700 placeholder:text-slate-400 focus:border-[#0066cc] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            onClick={submit}
            disabled={!isValidComment(draft)}
            aria-label="Enviar comentário"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0066cc] text-white shadow-md shadow-[#0066cc]/30 transition-colors hover:bg-[#0055aa] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <Send className="h-4 w-4 stroke-[2.4]" />
          </button>
        </div>

        <div className="mt-1.5 hidden items-center justify-between px-0.5 text-[9px] font-bold text-slate-400 sm:flex">
          <div className="flex items-center gap-2.5">
            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            <Smile className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {draft.trim().length}/500
            </span>
          </div>
          <span>Enter envia • Shift + Enter nova linha</span>
        </div>
      </div>
    </div>
  );
}
