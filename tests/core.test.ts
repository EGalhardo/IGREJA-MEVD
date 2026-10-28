import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_BIBLE_BOOKS, SCRIPTURE_CACHE, getChapterVerses } from '../src/data/bibleData';
import { CHURCH_EVENTS } from '../src/data/mockData';
import { sanitizeEmail, sanitizePhone, sanitizeText } from '../src/utils/sanitize';
import { normalizeSearch } from '../src/utils/search';
import { shareOrCopy } from '../src/utils/shareUtils';

test('pesquisa encontra texto com ou sem acentos', () => {
  assert.equal(normalizeSearch('  Vigília de Oração  '), 'vigilia de oracao');
  assert.equal(normalizeSearch('GÊNESIS'), 'genesis');
  assert.ok(normalizeSearch('Vigília de Oração').includes(normalizeSearch('vigilia')));
});

test('validação preserva nomes e endereços de email legítimos', () => {
  assert.equal(sanitizeText("D'Angelo & Filhos"), "D'Angelo & Filhos");
  assert.equal(sanitizeText('<b>Ana</b> Maria'), 'Ana Maria');
  assert.deepEqual(sanitizeEmail(" d'angelo&familia@example.com "), {
    isValid: true,
    value: "d'angelo&familia@example.com",
  });
  assert.equal(sanitizeEmail('nome..apelido@example.com').isValid, false);
  assert.equal(sanitizeEmail('nome@exemplo').isValid, false);
});

test('telefone inválido não é silenciosamente alterado para outro número', () => {
  assert.deepEqual(sanitizePhone('+244 923 456 789'), {
    isValid: true,
    value: '+244 923 456 789',
  });
  assert.equal(sanitizePhone('123abc4567').isValid, false);
  assert.equal(sanitizePhone('123').isValid, false);
});

test('a Bíblia devolve apenas o texto disponível, sem inventar versículos', () => {
  assert.deepEqual(getChapterVerses('genesis', 2), []);
  assert.deepEqual(getChapterVerses('livro-inexistente', 1), []);
  assert.equal(getChapterVerses('salmos', 23)[0].text, 'O Senhor é o meu pastor, nada me faltará.');
  assert.equal(ALL_BIBLE_BOOKS.length, 66);
  for (const [key, verses] of Object.entries(SCRIPTURE_CACHE)) {
    const match = key.match(/^(.*)-(\d+)$/);
    assert.ok(match, `Chave bíblica inválida: ${key}`);
    const book = ALL_BIBLE_BOOKS.find((item) => item.id === match[1]);
    assert.ok(book, `Livro desconhecido: ${key}`);
    assert.ok(Number(match[2]) >= 1 && Number(match[2]) <= book.chapters);
    let previous = 0;
    for (const verse of verses) {
      assert.ok(verse.number > previous && verse.text.trim().length > 0, `Versículo inválido em ${key}`);
      previous = verse.number;
    }
  }
});

test('eventos têm identificadores únicos para a partilha', () => {
  const ids = CHURCH_EVENTS.map((event) => event.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('falha de partilha é comunicada e o elemento temporário é removido', async () => {
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
  let removed = false;
  let feedback: { message: string; success: boolean } | undefined;
  const textArea = {
    value: '', style: {},
    setAttribute() {}, focus() {}, select() {}, setSelectionRange() {},
    remove() { removed = true; },
  };

  try {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async () => { throw new Error('sem permissão'); } } },
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        createElement: () => textArea,
        body: { appendChild() {} },
        execCommand: () => { throw new Error('cópia indisponível'); },
      },
    });
    const result = await shareOrCopy(
      { title: 'Evento', text: 'Detalhes', url: 'https://example.com/?evento=teste' },
      (message, success) => { feedback = { message, success }; }
    );
    assert.equal(result, false);
    assert.equal(feedback?.success, false);
    assert.match(feedback?.message ?? '', /Não foi possível/);
    assert.equal(removed, true);
  } finally {
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
    else Reflect.deleteProperty(globalThis, 'navigator');
    if (documentDescriptor) Object.defineProperty(globalThis, 'document', documentDescriptor);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});
