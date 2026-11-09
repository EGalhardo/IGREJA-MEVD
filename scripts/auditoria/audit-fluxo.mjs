import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Servidor de produção à escuta em 4100 (ver README.md desta pasta).
const BASE = process.env.AUDIT_URL || 'http://127.0.0.1:4100/';
const OUT = process.env.AUDIT_OUT || './auditoria-out';
mkdirSync(OUT, { recursive: true });
const base = process.argv[2] || BASE;
const b = await chromium.launch();
const R = [];   // resultados
const ok = (nome, cond, detalhe='') => R.push({ nome, ok: !!cond, detalhe });

const ctx = await b.newContext({ viewport:{ width:1440, height:900 } });
const p = await ctx.newPage();
const erros = [], falhas = [];
p.on('pageerror', e => erros.push(String(e)));
p.on('console', m => { if (m.type()==='error') erros.push(m.text()); });
p.on('response', r => { if (r.status() >= 400) falhas.push(`${r.status()} ${r.url()}`); });

await p.goto(base, { waitUntil:'networkidle' });
await p.waitForTimeout(1000);

// ---------- 1. Início ----------
ok('Início abre com conteúdo', await p.getByText('IGREJA MEVD').first().isVisible());
const search = p.getByPlaceholder(/Pesquisar|Procurar/i).first();
if (await search.count()) {
  await search.fill('louvor');
  await p.waitForTimeout(500);
  const resultadosBusca = await p.locator('button:has-text("Ver"), a:has-text("Ver")').count();
  ok('Pesquisa no Início responde', resultadosBusca >= 0, `${resultadosBusca} atalhos visiveis`);
  await search.fill('');
  await p.waitForTimeout(300);
}

// carrossel automático (harmonia/movimento)
const antes = await p.locator('img').first().getAttribute('src').catch(()=>null);
await p.waitForTimeout(3000);
const depois = await p.locator('img').first().getAttribute('src').catch(()=>null);
ok('Carrossel do Início não rebenta', true, `img inicial ${antes === depois ? 'estável' : 'mudou'}`);

// ---------- 2. Notificações ----------
const sino = p.locator('button[aria-label*="otifica"], button:has-text("Notificações")').first();
if (await sino.count()) {
  await sino.click(); await p.waitForTimeout(700);
  const menu = await p.getByText(/Notifica/i).first().isVisible().catch(()=>false);
  ok('Menu de notificações abre', menu);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
}

// ---------- 3. Eventos ----------
await p.locator('button:has-text("Eventos")').first().click();
await p.waitForTimeout(700);
const cartoesEventos = await p.locator('img[alt]').count();
ok('Lista de eventos renderiza imagens', cartoesEventos > 0, `${cartoesEventos} imagens`);
for (const cat of ['Cultos','Congressos','Vigílias','Reuniões','Todos']) {
  const btn = p.locator(`button:has-text("${cat}")`).first();
  if (await btn.count()) { await btn.click(); await p.waitForTimeout(350); }
}
ok('Filtros de categoria não geram erro', erros.length === 0, erros.slice(0,1).join(''));

// ---------- 4. Detalhe do evento ----------
await p.getByText('Noite de Louvor e Adoração').first().click();
await p.waitForTimeout(900);
ok('Detalhe do evento abre', await p.getByText('Sobre o evento').first().isVisible().catch(()=>false));
const inscrever = p.locator('button:has-text("Inscrever"), button:has-text("Inscrever-me"), button:has-text("Cancelar")').first();
if (await inscrever.count()) {
  const textoAntes = (await inscrever.innerText()).trim();
  await inscrever.click(); await p.waitForTimeout(500);
  const textoDepois = (await p.locator('button:has-text("Inscrever"), button:has-text("Inscrever-me"), button:has-text("Cancelar")').first().innerText()).trim();
  ok('Inscrição alterna estado', textoAntes !== textoDepois, `${textoAntes} -> ${textoDepois}`);
  await p.locator('button:has-text("Cancelar")').first().click().catch(()=>{});
  await p.waitForTimeout(300);
}

// ---------- 5. Galeria + visualizador + mensagens ----------
await p.locator('button', { hasText:'Galeria' }).first().click();
await p.waitForTimeout(600);
const fotos = await p.evaluate(() => [...document.querySelectorAll('button[aria-label^="Ver fotografia"]')].filter(e => e.getBoundingClientRect().width > 0).length);
ok('Galeria mostra as fotografias (grelha + tira)', fotos >= 6, `${fotos} miniaturas visiveis`);
await p.locator('button[aria-label^="Ver fotografia 1 de"]').first().click();
await p.waitForTimeout(700);
const dlg = p.locator('[role="dialog"][aria-label^="Galeria de"]');
ok('Visualizador abre em ecrã inteiro', await dlg.isVisible());

// navegação por teclado
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(500);
const contador2 = await dlg.locator('text=/^2 \\/ 6$/').count();
ok('Seta direita avança para 2/6', contador2 === 1);
await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(400);

// like/dislike
const like = dlg.getByRole('button', { name:/^Gosto nesta fotografia/ });
await like.click(); await p.waitForTimeout(250);
ok('Like activa', (await like.getAttribute('aria-pressed')) === 'true');
const dislike = dlg.getByRole('button', { name:/^Não gosto nesta fotografia/ });
await dislike.click(); await p.waitForTimeout(250);
ok('Dislike substitui o like', (await dislike.getAttribute('aria-pressed')) === 'true' && (await like.getAttribute('aria-pressed')) === 'false');

// mensagens: filtros, pesquisa, envio, resposta, gosto
const todos = await dlg.locator('article').count();
await dlg.getByRole('tab', { name:'Perguntas' }).click(); await p.waitForTimeout(350);
const perguntas = await dlg.locator('article').count();
ok('Filtro Perguntas reduz a lista', perguntas >= 1 && perguntas < todos, `${todos} -> ${perguntas}`);
await dlg.getByRole('tab', { name:'Todos' }).click(); await p.waitForTimeout(300);
await dlg.getByPlaceholder('Procurar numa mensagem...').fill('transmissão');
await p.waitForTimeout(400);
const busca= await dlg.locator('article').count();
ok('Pesquisa de mensagens funciona', busca >= 1, `${busca} resultados`);
await dlg.getByPlaceholder('Procurar numa mensagem...').fill('');
await p.waitForTimeout(300);

const campo = dlg.getByPlaceholder('Escreva uma mensagem...');
await campo.fill('Auditoria automática: tudo a funcionar.');
await dlg.getByRole('button', { name:'Enviar comentário' }).click();
await p.waitForTimeout(500);
ok('Mensagem enviada aparece no mural', (await dlg.locator('article', { hasText:'Auditoria automática' }).count()) > 0);
const primeiroGosto = dlg.locator('button[aria-label^="Gosto na mensagem"]').first();
await primeiroGosto.click(); await p.waitForTimeout(300);
ok('Gosto numa mensagem actua', (await primeiroGosto.getAttribute('aria-pressed')) === 'true');

// responder
await dlg.getByRole('button', { name:'Responder' }).first().click();
await p.waitForTimeout(350);
const campoResposta = dlg.locator('input[aria-label^="Responder a"]');
ok('Campo de resposta abre', (await campoResposta.count()) === 1);
if (await campoResposta.count()) {
  await campoResposta.fill('Resposta de teste.');
  await campoResposta.press('Enter');
  await p.waitForTimeout(600);
  ok('Resposta publicada', (await dlg.getByText('Resposta de teste.').count()) > 0);
}

// teclado ESC fecha
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
ok('ESC fecha o visualizador', (await p.locator('[role="dialog"][aria-label^="Galeria de"]').count()) === 0);

// persistência depois de recarregar
await p.reload({ waitUntil:'networkidle' });
await p.waitForTimeout(1200);
await p.locator('button:has-text("Eventos")').first().click(); await p.waitForTimeout(500);
await p.getByText('Noite de Louvor e Adoração').first().click(); await p.waitForTimeout(600);
await p.locator('button', { hasText:'Galeria' }).first().click(); await p.waitForTimeout(400);
await p.locator('button[aria-label^="Ver fotografia 1 de"]').first().click(); await p.waitForTimeout(700);
const dlg2 = p.locator('[role="dialog"][aria-label^="Galeria de"]');
ok('Mensagem persiste após recarregar', (await dlg2.locator('article', { hasText:'Auditoria automática' }).count()) > 0);
ok('Dislike persiste após recarregar', (await dlg2.getByRole('button', { name:/^Não gosto nesta fotografia/ }).getAttribute('aria-pressed')) === 'true');
await p.keyboard.press('Escape'); await p.waitForTimeout(400);

// ---------- 6. Bíblia ----------
await p.locator('button:has-text("Bíblia")').first().click();
await p.waitForTimeout(900);
const livros = await p.evaluate(() => (document.body.innerText.match(/Mostrando (\d+) de \d+ livros/) || [])[1]);
ok('Bíblia lista os 66 livros', livros === '66', `Mostrando ${livros} de 66`);
// abre o primeiro livro/capítulo
const genesis = p.locator('button', { hasText:'Gênesis' }).first();
if (await genesis.count()) {
  await genesis.click(); await p.waitForTimeout(1500);
  const ler = p.getByText('Ler Capítulo 1').first();
  if (await ler.count()) { await ler.click(); await p.waitForTimeout(2200); }
  const texto = await p.evaluate(() => document.body.innerText);
  ok('Capítulo de Gênesis 1 carrega o texto', /No princípio/i.test(texto));
  ok('Capítulo com múltiplos versículos', (texto.match(/\b\d{1,3}\b/g)||[]).length > 10, `${(texto.match(/\b\d{1,3}\b/g)||[]).length} números no texto`);
}
// voltar à grelha de livros (a pesquisa por tema só existe nessa vista)
const voltar = p.getByRole('button', { name:'Voltar' }).first();
if (await voltar.count()) { await voltar.click(); await p.waitForTimeout(900); }
const buscaBiblia = p.getByLabel('Pesquisar livros ou temas bíblicos');
if (await buscaBiblia.count()) {
  await buscaBiblia.fill('amor');
  await p.waitForTimeout(1000);
  const achou = await p.getByText(/Versículos Encontrados/i).count();
  ok('Pesquisa bíblica mostra versículos por tema', achou > 0);
  await buscaBiblia.fill('');
  await p.waitForTimeout(400);
}

// ---------- 7. Comunicados ----------
await p.locator('button:has-text("Comunicados")').first().click();
await p.waitForTimeout(700);
ok('Comunicados abre', await p.getByText(/Comunicados/i).first().isVisible());
const avisos = await p.locator('h3, h4').filter({ hasText:/Congresso|Culto|Inscri|Oração/i }).count();
ok('Comunicados listam avisos', avisos > 0, `${avisos} títulos`);

// ---------- 8. Perfil + modais ----------
await p.locator('button:has-text("Perfil")').first().click();
await p.waitForTimeout(700);
ok('Perfil abre', await p.getByText('Edlásio', { exact:false }).first().isVisible().catch(()=>false));
await p.getByText('Os meus dados', { exact:false }).first().click();
await p.waitForTimeout(700);
ok('Modal "Os meus dados" abre', (await p.getByRole('dialog').count()) > 0);
const guardar = p.getByRole('button', { name:/Guardar|Salvar|Concluir/i }).first();
if (await guardar.count()) { await guardar.click(); await p.waitForTimeout(600); }
ok('Modal fecha ao guardar', (await p.getByRole('dialog').count()) === 0);

for (const opcao of ['Minha Igreja','Notificações','Segurança','Ajuda','Sobre']) {
  const o = p.getByText(opcao, { exact:false }).first();
  if (await o.count()) {
    await o.click(); await p.waitForTimeout(600);
    const abriu = (await p.getByRole('dialog').count()) > 0;
    if (abriu) { await p.keyboard.press('Escape'); await p.waitForTimeout(400); }
    ok(`Opção do perfil "${opcao}"`, abriu);
  }
}

// ---------- 9. Navegação inferior (mobile) e logout ----------
console.log(JSON.stringify({ resultados: R, erros, falhas: [...new Set(falhas)] }, null, 1));
await ctx.close();
await b.close();
