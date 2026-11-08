import test from 'node:test';
import assert from 'node:assert/strict';
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
  type PhotoComment,
} from '../src/utils/comments';
import { seedComments } from '../src/data/commentsData';

const autor: CommentAuthor = { name: 'Edlásio Galhardo', initials: 'EG', color: '#0066cc' };

test('validação de comentários: vazios e demasiado longos são recusados', () => {
  assert.equal(isValidComment('   '), false);
  assert.equal(isValidComment('Bom culto!'), true);
  assert.equal(isValidComment('a'.repeat(500)), true);
  assert.equal(isValidComment('a'.repeat(501)), false);
});

test('createComment limpa espaços e inicia sem gostos', () => {
  const comment = createComment('  Que   noite   abençoada  ', autor, { id: 'c1' });

  assert.equal(comment.id, 'c1');
  assert.equal(comment.text, 'Que noite abençoada');
  assert.equal(comment.likes, 0);
  assert.equal(comment.likedByMe, false);
  assert.deepEqual(comment.replies, []);
});

test('novos comentários entram no topo e as respostas ficam no comentário certo', () => {
  const semente = seedComments('foto-1');
  const novo = createComment('Glória a Deus!', autor, { id: 'novo' });
  const lista = addComment(semente, novo);

  assert.equal(lista[0].id, 'novo');
  assert.equal(lista.length, semente.length + 1);

  const comResposta = addReply(lista, 'novo', createComment('Amém!', autor, { id: 'r1' }));
  assert.equal(comResposta[0].replies.length, 1);
  assert.equal(comResposta[0].replies[0].text, 'Amém!');
  assert.equal(countComments(comResposta), countComments(semente) + 2);
});

test('gosto alterna entre dar e retirar, sem ficar negativo', () => {
  const lista = seedComments('foto-2');
  const alvo = lista[0];

  const comGosto = toggleLike(lista, alvo.id);
  assert.equal(comGosto[0].likedByMe, true);
  assert.equal(comGosto[0].likes, alvo.likes + 1);

  const semGosto = toggleLike(comGosto, alvo.id);
  assert.equal(semGosto[0].likedByMe, false);
  assert.equal(semGosto[0].likes, alvo.likes);
});

test('ordenação mantém o comentário fixado no topo e respeita a ordem escolhida', () => {
  const lista = seedComments('foto-3');
  const recentes = sortComments(lista, 'recent');
  const antigos = sortComments(lista, 'oldest');

  assert.equal(recentes[0].pinned, true, 'o fixado deve ficar primeiro');
  assert.equal(antigos[0].pinned, true, 'o fixado deve ficar primeiro em ambas as ordens');
  assert.equal(recentes.length, lista.length);
  assert.equal(antigos.length, lista.length);
  assert.notDeepEqual(
    recentes.map((c) => c.id),
    antigos.map((c) => c.id)
  );
});

test('contagens e iniciais', () => {
  assert.equal(formatCount(7), '7');
  assert.equal(formatCount(1200), '1,2 mil');
  assert.equal(initialsOf('Edlásio Galhardo'), 'EG');
  assert.equal(initialsOf('Marta'), 'MA');
  assert.equal(countComments([]), 0);
});

test('cada fotografia tem comentários de exemplo independentes', () => {
  const a: PhotoComment[] = seedComments('foto-a');
  const b: PhotoComment[] = seedComments('foto-b');

  assert.ok(a.length >= 3);
  assert.notEqual(a[0].id, b[0].id, 'os ids devem ser próprios de cada foto');
  assert.ok(a.some((comment) => comment.pinned), 'deve existir um comentário fixado');
});
