import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Servidor de produção da IGREJA MEVD.
 *
 * Serve a pasta `dist/` (gerada por `npm run build`) com uma política de cache
 * que garante que uma nova versão aparece de imediato:
 *
 *  - `index.html`  -> `no-store` (nunca é reaproveitado do cache)
 *  - ficheiros com hash de conteúdo (index-XXXX.js/css) -> imutáveis (1 ano)
 *  - restantes ficheiros de `public/` (cartazes, áudios, imagens) -> `no-cache`
 *    (revalidam sempre, por isso trocar uma imagem não fica "presa")
 *
 * Também expõe o cabeçalho `X-App-Build` com a data de construção, para se
 * poder confirmar em qualquer momento qual versão está a ser servida.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');

if (!fs.existsSync(indexFile)) {
  console.error('[MEVD] Falta a pasta dist/. Corre primeiro: npm run build');
  process.exit(1);
}

// Lido a cada pedido: se houver um build novo, o cabeçalho muda sem reiniciar.
const currentBuildId = () => new Date(fs.statSync(indexFile).mtimeMs).toISOString();
const port = Number(process.env.PORT || 8080);

const app = express();
app.disable('x-powered-by');
app.set('etag', 'strong');

app.use((req, res, next) => {
  const url = req.path;
  res.set('X-App-Build', currentBuildId());

  if (url === '/' || url.endsWith('/index.html')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else if (/^\/assets\/[^/]*-[A-Za-z0-9_-]{8,}\.(js|css)$/.test(url)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.set('Cache-Control', 'no-cache');
  }
  next();
});

app.use(
  express.static(distDir, {
    index: 'index.html',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    },
  })
);

// Qualquer rota desconhecida devolve a aplicação (só há uma página).
app.get('*', (_req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(indexFile);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[MEVD] produção em http://0.0.0.0:${port} · build ${currentBuildId()}`);
});
