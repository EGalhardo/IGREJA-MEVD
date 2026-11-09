import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Servidor de produção à escuta em 4100 (ver README.md desta pasta).
const BASE = process.env.AUDIT_URL || 'http://127.0.0.1:4100/';
const OUT = process.env.AUDIT_OUT || './auditoria-out';
mkdirSync(OUT, { recursive: true });
const base = process.argv[2] || BASE;
const b = await chromium.launch();
const viewports = [
  ['320x568', 320, 568, true], ['390x844', 390, 844, true], ['768x1024', 768, 1024, true],
  ['1024x768', 1024, 768, false], ['1440x900', 1440, 900, false], ['1920x1080', 1920, 1080, false],
];
const linhas = [];

for (const [tag, w, h, isM] of viewports) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:isM, hasTouch:isM });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', e => erros.push(String(e)));
  p.on('console', m => { if (m.type()==='error') erros.push(m.text()); });

  await p.goto(base, { waitUntil:'networkidle' });
  await p.waitForTimeout(1200);

  const medir = () => p.evaluate(() => {
    const alvos = [...document.querySelectorAll('button, a, input, textarea, [role="button"]')].filter(e => e.getBoundingClientRect().width > 0);
    const pequenos = alvos.filter(e => { const r = e.getBoundingClientRect(); return (r.width < 32 || r.height < 32); });
    const semNome = alvos.filter(e => !(e.getAttribute('aria-label') || (e.textContent||'').trim() || e.getAttribute('title')));
    const imgsSemAlt = [...document.images].filter(i => !i.hasAttribute('alt'));
    const overflowEls = [...document.querySelectorAll('main *')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.right > window.innerWidth + 1;
    }).slice(0, 5).map(e => `${e.tagName}.${String(e.className).slice(0,28)}`);
    return {
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      alvos: alvos.length,
      pequenos: pequenos.length,
      amostraPequenos: pequenos.slice(0,3).map(e => (e.getAttribute('aria-label') || (e.textContent||'').trim()).slice(0,22)),
      semNome: semNome.length,
      imgsSemAlt: imgsSemAlt.length,
      foraDoEcra: overflowEls,
    };
  });

  const inicio = await medir();

  // navegação inferior / lateral
  const navOk = [];
  for (const alvo of ['Início','Eventos','Bíblia','Comunicados','Perfil']) {
    const el = p.locator(`button:has-text("${alvo}")`).first();
    if (await el.count()) { await el.click(); await p.waitForTimeout(600); navOk.push(alvo); }
  }

  // ecrã do visualizador: o compositor fica tapado pela barra inferior?
  await p.goto(base + '?evento=noite-louvor-adoracao', { waitUntil:'networkidle' });
  await p.waitForTimeout(1000);
  await p.locator('button', { hasText:'Galeria' }).first().click(); await p.waitForTimeout(500);
  await p.locator('button[aria-label^="Ver fotografia 1 de"]').first().click(); await p.waitForTimeout(900);

  const sobreposicao = await p.evaluate(() => {
    const campo = document.querySelector('[role="dialog"] textarea');
    const barra = [...document.querySelectorAll('nav, [role="navigation"], footer')].filter(e => e.getBoundingClientRect().height > 0 && getComputedStyle(e).position !== 'static');
    const r = campo ? campo.getBoundingClientRect() : null;
    const barras = barra.map(e => ({ tag:e.tagName, top:Math.round(e.getBoundingClientRect().top), h:Math.round(e.getBoundingClientRect().height) }));
    const tapado = r ? barras.some(x => r.bottom > x.top && r.top < x.top + x.h) : false;
    return { campoVisivel: !!campo, topoCampo: r ? Math.round(r.bottom) : null, barras, tapado };
  });

  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await p.screenshot({ path:`${OUT}/audit-${tag}.png` });

  linhas.push({ tag, ...inicio, navOk: navOk.length, tapado: sobreposicao.tapado, barras: sobreposicao.barras.length, erros: erros.length });
  await ctx.close();
}

console.log('| Viewport | overflowX | alvos | <32px | sem nome | imgs sem alt | fora do ecrã | nav | sobreposição | erros |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const l of linhas) console.log(`| ${l.tag} | ${l.overflowX} | ${l.alvos} | ${l.pequenos}${l.amostraPequenos.length?' ('+l.amostraPequenos.join(' · ')+')':''} | ${l.semNome} | ${l.imgsSemAlt} | ${l.foraDoEcra.length} | ${l.navOk}/5 | ${l.tapado ? 'SIM' : 'não'} | ${l.erros} |`);
await b.close();
