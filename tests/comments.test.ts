import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addComment,
  filterComments,
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
import { seedComments, seedLikeCount } from '../src/data/commentsData';

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

test('filtros do mural: perguntas, testemunhos e fixados', () => {
  const lista = seedComments('foto-4');

  const perguntas = filterComments(lista, 'question');
  const testemunhos = filterComments(lista, 'testimony');
  const fixados = filterComments(lista, 'pinned');

  assert.ok(perguntas.length >= 1);
  assert.ok(perguntas.every((comment) => comment.kind === 'question'));
  assert.ok(testemunhos.length >= 2);
  assert.ok(testemunhos.every((comment) => comment.kind === 'testimony'));
  assert.equal(fixados.length, 1);
  assert.equal(fixados[0].pinned, true);
  assert.equal(filterComments(lista, 'all').length, lista.length);
});

test('pesquisa ignora acentos, maiúsculas e encontra também nas respostas', () => {
  const lista = seedComments('foto-5');

  const semAcento = filterComments(lista, 'all', 'transmissao');
  const comAcento = filterComments(lista, 'all', 'transmissão');
  const porAutor = filterComments(lista, 'all', 'PASTOR');

  assert.ok(semAcento.length >= 1, 'deve encontrar "transmissão" escrito sem acento');
  assert.equal(semAcento.length, comAcento.length);
  assert.equal(porAutor.length, 1);
  assert.equal(porAutor[0].author.name, 'Pastor Filipe');
  assert.equal(filterComments(lista, 'all', 'palavra-inexistente').length, 0);
});

test('mensagem da igreja tem etiqueta própria e o tipo é guardado', () => {
  const lista = seedComments('foto-6');
  const oficial = lista.filter((comment) => comment.official);

  assert.equal(oficial.length, 1);
  assert.equal(oficial[0].author.name, 'Pastor Filipe');

  const nova = createComment('Pergunta nova', autor, { id: 'k1', kind: 'question' });
  assert.equal(nova.kind, 'question');
  assert.equal(nova.official, undefined);
});

test('gostos iniciais da fotografia são estáveis e ficam entre 18 e 40', () => {
  const a = seedLikeCount('noite-louvor-adoracao-foto-1');
  const b = seedLikeCount('noite-louvor-adoracao-foto-1');
  const outros = ['foto-a', 'foto-b', 'foto-c'].map(seedLikeCount);

  assert.equal(a, b, 'o mesmo identificador deve dar sempre o mesmo número');
  for (const valor of [a, ...outros]) {
    assert.ok(valor >= 18 && valor <= 40, `valor fora do intervalo: ${valor}`);
  }
});
