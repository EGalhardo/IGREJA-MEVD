# Scripts de auditoria (Playwright)

Verificam o app **em modo de produção**, com métricas reais de rede, contraste e área táctil.

## Preparação

```bash
npm run build
PORT=4100 node server.js &     # servidor de produção a servir dist/
npm i -D playwright            # dependência das auditorias (não faz parte do bundle)
npx playwright install chromium
```

## Execução

```bash
node scripts/auditoria/audit-fluxo.mjs      # 32 verificações funcionais + persistência
node scripts/auditoria/audit-perf.mjs       # FCP/DCL/CLS, tarefas longas, KB por ecrã
node scripts/auditoria/audit-harmonia.mjs   # 6 viewports: overflow, alvos, alt, sobreposições
node scripts/auditoria/audit-detalhe2.mjs   # contraste WCAG AA (oklch -> sRGB via canvas)
```

Variáveis opcionais:

| Variável | Efeito |
|---|---|
| `AUDIT_URL` | endereço a auditar (por omissão `http://127.0.0.1:4100/`) |
| `AUDIT_OUT` | pasta das capturas (por omissão `./auditoria-out`) |

Os resultados das últimas execuções estão descritos em [`../../AUDITORIA.md`](../../AUDITORIA.md).
