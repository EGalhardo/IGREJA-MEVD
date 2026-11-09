import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Servidor de produção à escuta em 4100 (ver README.md desta pasta).
const BASE = process.env.AUDIT_URL || 'http://127.0.0.1:4100/';
const OUT = process.env.AUDIT_OUT || './auditoria-out';
mkdirSync(OUT, { recursive: true });
const base = process.argv[2] || BASE;
const b = await chromium.launch();

const cenarios = [
  { nome:'Início', acao: async () => {} },
  { nome:'Eventos', acao: async (p) => { await p.locator('button:has-text("Eventos")').first().click(); } },
  { nome:'Detalhe do evento', acao: async (p) => { await p.locator('button:has-text("Eventos")').first().click(); await p.waitForTimeout(500); await p.getByText('Noite de Louvor e Adoração').first().click(); } },
  { nome:'Galeria (separador)', acao: async (p) => { await p.locator('button:has-text("Eventos")').first().click(); await p.waitForTimeout(400); await p.getByText('Noite de Louvor e Adoração').first().click(); await p.waitForTimeout(400); await p.locator('button', { hasText:'Galeria' }).first().click(); } },
  { nome:'Visualizador + mensagens', acao: async (p) => { await p.locator('button:has-text("Eventos")').first().click(); await p.waitForTimeout(400); await p.getByText('Noite de Louvor e Adoração').first().click(); await p.waitForTimeout(400); await p.locator('button', { hasText:'Galeria' }).first().click(); await p.waitForTimeout(300); await p.locator('button[aria-label^="Ver fotografia 1 de"]').first().click(); } },
  { nome:'Bíblia', acao: async (p) => { await p.locator('button:has-text("Bíblia")').first().click(); } },
  { nome:'Comunicados', acao: async (p) => { await p.locator('button:has-text("Comunicados")').first().click(); } },
  { nome:'Perfil', acao: async (p) => { await p.locator('button:has-text("Perfil")').first().click(); } },
];

const resultados = [];
for (const c of cenarios) {
  const ctx = await b.newContext({ viewport:{ width:1440, height:900 } });
  const p = await ctx.newPage();
  const pedidos = [];
  p.on('response', async (r) => {
    const url = r.url();
    const tipo = r.request().resourceType();
    let bytes = 0;
    try { bytes = (await r.body()).length; } catch {}
    pedidos.push({ url, tipo, status: r.status(), bytes });
  });
  const erros = [];
  p.on('pageerror', e => erros.push(String(e)));
  p.on('console', m => { if (m.type()==='error') erros.push(m.text()); });

  await p.goto(base, { waitUntil:'domcontentloaded' });
  await p.waitForTimeout(600);
  const t0 = Date.now();
  await c.acao(p);
  await p.waitForTimeout(900);
  const latencia = Date.now() - t0;

  const metricas = await p.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const fcp = paints.find(x => x.name === 'first-contentful-paint');
    const recursos = performance.getEntriesByType('resource');
    const bytes = recursos.reduce((s,r) => s + (r.transferSize || 0), 0);
    const clinte = document.createElement('div');
    return {
      dcl: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      fcp: fcp ? Math.round(fcp.startTime) : null,
      recursos: recursos.length,
      kb: Math.round(bytes/1024),
      dom: document.querySelectorAll('*').length,
      imgsQuebradas: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
      imgs: document.images.length,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  // tarefas longas e CLS medidos após carregar
  const vitals = await p.evaluate(() => new Promise((resolve) => {
    let longTasks = 0, longTotal = 0, cls = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { longTasks++; longTotal += e.duration; } })
        .observe({ entryTypes:['longtask'] });
    } catch {}
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
        .observe({ entryTypes:['layout-shift'] });
    } catch {}
    setTimeout(() => resolve({ longTasks, longTotal: Math.round(longTotal), cls: +cls.toFixed(3) }), 1500);
  }));

  const falhas = pedidos.filter(x => x.status >= 400).map(x => `${x.status} ${x.url.split('/').slice(-1)[0]}`);
  const porTipo = {};
  for (const x of pedidos) { porTipo[x.tipo] = (porTipo[x.tipo] || 0) + Math.round(x.bytes/1024); }

  resultados.push({ cenario:c.nome, latencia, ...metricas, ...vitals, errores:erros.length, erros:erros.slice(0,2), falhas, porTipo });
  await ctx.close();
}

console.log('| Ecrã | Latência | FCP | DCL | Load | Recursos | KB rede | DOM | Imgs quebradas | Tarefas longas | CLS | Erros |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of resultados) {
  console.log(`| ${r.cenario} | ${r.latencia} ms | ${r.fcp} ms | ${r.dcl} ms | ${r.load} ms | ${r.recursos} | ${r.kb} KB | ${r.dom} | ${r.imgsQuebradas}/${r.imgs} | ${r.longTasks} (${r.longTotal} ms) | ${r.cls} | ${r.errores}${r.erros.length?' — '+r.erros.join(' / ').slice(0,80):''} |`);
}
console.log('\n=== falhas de rede ===');
for (const r of resultados) if (r.falhas.length || r.overflowX) console.log(r.cenario, '| falhas:', r.falhas.slice(0,5), '| overflowX:', r.overflowX);
console.log('\n=== bytes por tipo (último ecrã) ===', JSON.stringify(resultados[resultados.length-1].porTipo));
await b.close();
