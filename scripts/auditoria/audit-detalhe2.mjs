import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Servidor de produção à escuta em 4100 (ver README.md desta pasta).
const BASE = process.env.AUDIT_URL || 'http://127.0.0.1:4100/';
const OUT = process.env.AUDIT_OUT || './auditoria-out';
mkdirSync(OUT, { recursive: true });
const base = process.argv[2] || BASE;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
const p = await ctx.newPage();
await p.goto(base, { waitUntil:'networkidle' });
await p.waitForTimeout(1200);
const r = await p.evaluate(() => {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx2 = canvas.getContext('2d', { willReadFrequently:true });
  const toRGBA = (cor) => { ctx2.clearRect(0,0,1,1); ctx2.fillStyle = '#fff'; ctx2.fillRect(0,0,1,1); ctx2.fillStyle = cor; ctx2.fillRect(0,0,1,1); const d = ctx2.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]]; };
  const lum = ([r,g,bl]) => { const f = v => { v/=255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(bl); };
  const ratio = (a,b) => { const A = lum(a), B = lum(b); const [x,y] = A>B?[A,B]:[B,A]; return +(((x+0.05)/(y+0.05)).toFixed(2)); };

  const fundoDe = (el) => { let e = el, cor = 'rgba(0, 0, 0, 0)';
    while (e && (cor === 'rgba(0, 0, 0, 0)' || cor === 'transparent')) { cor = getComputedStyle(e).backgroundColor; e = e.parentElement; }
    return toRGBA(cor === 'rgba(0, 0, 0, 0)' ? '#ffffff' : cor);
  };
  const textos = [...document.querySelectorAll('p, span, small, h1, h2, h3, button, a')]
    .filter(e => e.getBoundingClientRect().width > 0 && (e.textContent||'').trim().length > 2 && !e.children.length)
    .slice(0, 500)
    .map(e => { const cs = getComputedStyle(e); return { t:(e.textContent||'').trim().slice(0,34), px:parseFloat(cs.fontSize), w:+cs.fontWeight, ratio:ratio(toRGBA(cs.color), fundoDe(e)), cor:cs.color }; });
  const baixos = textos.filter(x => x.ratio < 4.5 && x.px < 18.66);
  const ok = textos.length - baixos.length;

  const alvos = [...document.querySelectorAll('button, a, input, textarea')].filter(e => e.getBoundingClientRect().width > 0)
    .map(e => { const rc = e.getBoundingClientRect(); return {
      tag: e.tagName, nome: (e.getAttribute('aria-label') || (e.textContent||'').trim().slice(0,24) || '(sem nome)'),
      w: Math.round(rc.width), h: Math.round(rc.height), cls: String(e.className).slice(0,52) }; });
  return { textos: textos.length, ok, baixos: baixos.slice(0,10), alvos };
});
console.log(`contraste: ${r.ok}/${r.textos} textos conformes (WCAG AA, <18,66px)`);
for (const x of r.baixos) console.log(`   ${x.ratio}:1  ${x.px}px/${x.w}  "${x.t}"  (${x.cor})`);
console.log('\nalvos pequenos com contexto:');
for (const a of r.alvos.filter(a => a.w < 32 || a.h < 32)) console.log(`   ${a.w}x${a.h}  ${a.tag}  "${a.nome}"  .${a.cls}`);
await b.close();
