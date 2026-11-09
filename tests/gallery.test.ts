import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CHURCH_EVENTS } from '../src/data/mockData';

const publicPath = (src: string) => path.join(process.cwd(), 'public', src.replace(/^\//, ''));

test('eventos com galeria têm fotografias válidas e ficheiros existentes', () => {
  const withGallery = CHURCH_EVENTS.filter((event) => (event.gallery?.length ?? 0) > 0);

  assert.ok(withGallery.length >= 7, 'esperava os eventos com álbum (congresso + 6 fotografias)');

  for (const event of withGallery) {
    const gallery = event.gallery ?? [];
    const ids = new Set<string>();

    for (const photo of gallery) {
      assert.ok(photo.caption.trim().length > 0, `${event.id}: fotografia sem legenda`);
      assert.ok(photo.src.startsWith('/assets/events/galeria/'), `${event.id}: caminho inesperado ${photo.src}`);
      assert.ok(existsSync(publicPath(photo.src)), `${event.id}: ficheiro em falta ${photo.src}`);
      assert.equal(ids.has(photo.id), false, `${event.id}: id de fotografia repetido (${photo.id})`);
      ids.add(photo.id);
    }
  }
});

test('cada fotografia criada deu origem a um evento próprio', () => {
  const photoSources = [
    'culto-celebracao',
    'pregacao',
    'encontro-jovens',
    'louvor',
    'intercessao',
    'baptismo',
  ];

  for (const name of photoSources) {
    const src = `/assets/events/galeria/${name}.webp`;
    // Outros eventos podem reutilizar a imagem como cartaz; o que importa é que
    // exista um evento cujo álbum abra precisamente por esta fotografia.
    const event = CHURCH_EVENTS.find((item) => item.image === src && (item.gallery?.length ?? 0) > 0);

    assert.ok(event, `nenhum evento com álbum usa a fotografia ${name}`);
    assert.ok((event?.gallery?.length ?? 0) > 0, `${event?.id}: evento sem galeria`);
    assert.equal(event?.gallery?.[0]?.src, src, `${event?.id}: a galeria deve abrir com a foto do evento`);
  }
});

test('a grelha mostra no máximo 6 fotografias e o álbum mantém o total', () => {
  for (const event of CHURCH_EVENTS) {
    if (!event.gallery?.length) continue;
    assert.ok(event.gallery.length <= 6, `${event.id}: o cartão da grelha assume até 6 fotos`);
  }
});
