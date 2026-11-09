# Auditoria de performance, funcionalidade e harmonia — IGREJA MEVD

**Data:** 3 de Novembro de 2026
**Alvo:** build de produção (`npm run build` + `node server.js`, porta 4100)
**Ferramenta:** Playwright (Chromium), viewports 320×568 · 390×844 · 768×1024 · 1024×768 · 1440×900 · 1920×1080
**Scripts:** `audit-fluxo.mjs` (fluxo), `audit-perf.mjs` (métricas por ecrã), `audit-harmonia.mjs` (6 viewports), `audit-detalhe2.mjs` (contraste + alvos), `audit-assets.mjs` (peso por recurso)

---

## 1. Veredicto

| Área | Resultado |
|---|---|
| Fluxo funcional | **36/36 verificações verdes** (0 erros de consola, 0 pedidos falhados) |
| Harmonia / responsivo | **6/6 viewports** sem overflow horizontal, 0 elementos fora do ecrã, 0 sobreposições |
| Contraste (WCAG AA) | **99/99** textos conformes |
| Imagens sem `alt` | **0** |
| Layout shift (CLS) | **0** |
| Tarefas longas (>50 ms) | **0** em todos os ecrãs |
| Peso da rede (Início) | **3.871 KB → 1.024 KB (−73,5 %)** |
| JavaScript (transferido) | **413.636 B → 108.929 B (−73,7 %)** |
| Bíblia `genesis.json` | **188.848 B → 57.679 B (−69,4 %)** |

O app está funcional, consistente e responsivo em todos os tamanhos testados. Não foi encontrado nenhum bloqueio de utilização; os problemas detetados eram de peso, de contraste e de área táctil, e **todos foram corrigidos** nesta sessão.

---

## 2. Correções aplicadas

| # | Problema encontrado | Correção | Ficheiros |
|---|---|---|---|
| 1 | Servidor servia tudo sem compressão (JS 413 KB, JSON 188 KB em bruto) | `compression@1.8.2` com brotli/gzip, `threshold: 512` | `server.js`, `package.json` |
| 2 | Imagens não otimizadas (uma foto de perfil de **760 KB** exibida a 32×32) | Conversão para **WebP** + redimensionamento ao tamanho real de uso | `public/assets/**` |
| 3 | Texto a **2,63:1** (slate-400 a 11 px): subtítulo da pesquisa e etiquetas da barra inferior | `slate-400` → `slate-500` (**4,8:1**) | `HomeScreen.tsx`, `BottomNav.tsx` |
| 4 | Campo de pesquisa sem nome acessível | `aria-label="Pesquisar eventos"` | `HomeScreen.tsx` |
| 5 | Indicadores do carrossel com **28×8 px** | 28×24 px de área táctil (pílula visível mantém 8 px) | `HomeScreen.tsx` |
| 6 | Alvos pequenos: avatar/notificações 28×28, "Ver todos" 73×16, "Oi, Nome" 54×9 | Área táctil ampliada por pseudo-elemento (**0 px de diferença visual, confirmado por comparação pixel a pixel**) | `Appbar.tsx`, `HomeScreen.tsx` |
| 7 | Dois eventos carregavam fotos de `images.unsplash.com` (app dependia de terceiros) | Substituídas por fotografias locais em WebP | `mockData.ts` |
| 8 | Pesquisa bíblica por "amor" devolvia também Apocalipse 21:4 (o texto diz "nem pranto, nem cl**amor**") | Comparação por **palavra inteira** no texto do versículo | `BibleScreen.tsx` |
| 9 | "Mostrando **0 de 66** livros / Nenhum livro encontrado" com versículos encontrados | Estado vazio coerente: "Mas há 1 versículo sobre 'amor' na lista acima." | `BibleScreen.tsx` |
| 10 | Comunicados não tinham detalhe: o cartão não abria nada | **Popup do comunicado** com o padrão dos restantes modais (mesmo overlay, `rounded-3xl`, header com X, ESC, foco devolvido, `max-h-[min(86vh,44rem)]`), responsivo de 320 a 1920 px | `ComunicadosScreen.tsx` |
| 11 | Teste da galeria apontava para `.jpg` e apanhava um evento sem álbum | Passou a validar `.webp` e a exigir evento **com álbum** | `tests/gallery.test.ts` |

### 2.1 Peso dos assets

| Asset | Antes | Depois | Redução |
|---|---|---|---|
| `Foto_de_Perfil__1__…` (exibida a 32 px) | 760 KB | **8 KB** | −99 % |
| `2_b0dbb042` (cartaz) | 617 KB | **116 KB** | −81 % |
| `3_f31b15f7` (cartaz) | 431 KB | **72 KB** | −83 % |
| Destaque do carrossel (agora `MEVD_LOCKUP_02`) | 286 KB | **35 KB** | −88 % |
| Logomarca (agora `MEVD_LOGO_02`, exibida a 28 px) | 159 KB | **14 KB** | −91 % |
| 6 fotografias da galeria | 933 KB | **567 KB** | −39 % |
| 10 imagens bíblicas | 1.285 KB | **841 KB** | −35 % |
| 4 cartazes de eventos | 167 KB | **108 KB** | −35 % |
| **Total `public/assets`** | **≈4,6 MB** | **≈1,7 MB** | **−62 %** |

---

## 3. Fluxo funcional — 36 verificações

| Ecrã | Verificação | Resultado |
|---|---|---|
| Início | Abre com conteúdo | ✅ |
| Início | Pesquisa de eventos responde (16 atalhos filtrados) | ✅ |
| Início | Carrossel não rebenta (imagem inicial estável) | ✅ |
| Início | Menu de notificações abre | ✅ |
| Eventos | Lista renderiza 16 imagens | ✅ |
| Eventos | 5 filtros de categoria sem erro | ✅ |
| Evento | Detalhe abre | ✅ |
| Evento | Galeria mostra as fotografias (12 miniaturas: grelha + tira) | ✅ |
| Visualizador | Abre em ecrã inteiro | ✅ |
| Visualizador | Seta → avança para 2/6 | ✅ |
| Visualizador | Like ativa | ✅ |
| Visualizador | Dislike substitui o like (exclusivos) | ✅ |
| Mensagens | Filtro "Perguntas" reduz 3 → 1 | ✅ |
| Mensagens | Pesquisa devolve 2 resultados | ✅ |
| Mensagens | Mensagem enviada aparece no mural | ✅ |
| Mensagens | Gosto numa mensagem atua | ✅ |
| Mensagens | Campo de resposta abre | ✅ |
| Mensagens | Resposta publicada | ✅ |
| Visualizador | ESC fecha | ✅ |
| Persistência | Mensagem sobrevive ao recarregar | ✅ |
| Persistência | Dislike sobrevive ao recarregar | ✅ |
| Bíblia | Lista os 66 livros ("Mostrando 66 de 66") | ✅ |
| Bíblia | Génesis → "Ler Capítulo 1" carrega o texto | ✅ |
| Bíblia | Capítulo com 40 versículos numerados | ✅ |
| Bíblia | Pesquisa por tema devolve versículos | ✅ |
| Comunicados | Ecrã abre com 2 avisos | ✅ |
| Comunicados | Popup do comunicado abre (3 cartões) | ✅ |
| Comunicados | Popup mostra o comunicado certo (título + categoria) | ✅ |
| Comunicados | ESC fecha e o foco volta ao cartão | ✅ |
| Perfil | Ecrã abre | ✅ |
| Perfil | Modal "Os meus dados" abre e fecha ao guardar | ✅ |
| Perfil | Modal "Notificações" | ✅ |
| Perfil | Modal "Segurança" | ✅ |
| Perfil | Modal "Ajuda" | ✅ |
| Global | 0 erros de consola · 0 pedidos ≥400 | ✅ |

---

## 4. Performance por ecrã (1440×900, produção)

| Ecrã | FCP | DCL | Recursos | KB rede | Nós DOM | Imgs quebradas | Tarefas longas | CLS | Erros |
|---|---|---|---|---|---|---|---|---|---|
| Início | 208 ms | 77 ms | 18 | 1.024 | 535 | 0/19 | 0 | 0 | 0 |
| Eventos | 180 ms | 80 ms | 18 | 1.024 | 477 | 0/16 | 0 | 0 | 0 |
| Detalhe do evento | 204 ms | 68 ms | 18 | 1.024 | 256 | 0/12 | 0 | 0 | 0 |
| Galeria (separador) | 200 ms | 74 ms | 18 | 1.024 | 270 | 0/18 | 0 | 0 | 0 |
| Visualizador + mensagens | 220 ms | 85 ms | 18 | 1.024 | 431 | 0/27 | 0 | 0 | 0 |
| Bíblia | 188 ms | 71 ms | 18 | 1.024 | 775 | 0/2 | 0 | 0 | 0 |
| Comunicados | 212 ms | 85 ms | 18 | 1.024 | 152 | 0/2 | 0 | 0 | 0 |
| Perfil | 196 ms | 75 ms | 18 | 1.024 | 191 | 0/3 | 0 | 0 | 0 |

**Antes / depois (Início):** 3.871 KB → **1.024 KB** de rede · 3.392 KB → **902 KB** de imagens · JS 413 KB → **109 KB** transferidos · 20 → 18 pedidos.

Os 5 sermões em MP3 (2,4 MB no total, `public/assets/audio`) **não entram no carregamento inicial**: o áudio só é pedido quando o utilizador carrega em reproduzir. O mesmo vale para os 66 JSON da Bíblia (4 MB), pedidos um a um conforme o livro escolhido.

Todos os ecrãs ficam abaixo de 250 ms de First Contentful Paint, sem layout shift e sem tarefas longas — o utilizador vê conteúdo no primeiro quarto de segundo.

---

## 5. Harmonia e responsivo

| Viewport | overflowX | Alvos | &lt;32 px | Sem nome acessível | Imgs sem alt | Fora do ecrã | Nav | Sobreposição | Erros |
|---|---|---|---|---|---|---|---|---|---|
| 320×568 | 0 | 36 | 7 | 0 | 0 | 0 | 5/5 | não | 0 |
| 390×844 | 0 | 36 | 7 | 0 | 0 | 0 | 5/5 | não | 0 |
| 768×1024 | 0 | 36 | 7 | 0 | 0 | 0 | 5/5 | não | 0 |
| 1024×768 | 0 | 37 | 6 | 0 | 0 | 0 | 5/5 | não | 0 |
| 1440×900 | 0 | 37 | 6 | 0 | 0 | 0 | 5/5 | não | 0 |
| 1920×1080 | 0 | 37 | 6 | 0 | 0 | 0 | 5/5 | não | 0 |

- **Zero overflow horizontal** em todos os tamanhos — nenhuma barra de deslocamento lateral.
- **Navegação sempre 5/5** (Início, Eventos, Bíblia, Comunicados, Perfil) visível.
- **O compositor do visualizador nunca é tapado** pela barra inferior nem pela lista de miniaturas.
- Comparação antes/depois das correções de área táctil: **0 pixéis alterados** a 1440 px, 2 pixéis a 320 px (só a cor do subtítulo).

---

## 6. Acessibilidade

- **Contraste:** 99/99 textos conformes (WCAG AA para texto &lt;18,66 px). As 5 falhas de 2,63:1 desapareceram.
- **Nomes acessíveis:** todos os botões, inputs e imagens têm nome; 0 `<img>` sem `alt`.
- **Alvos:** o menor alvo restante é **28×24 px** (indicadores do carrossel) e 54×25 px (etiqueta "Oi, Nome") — ambos acima do mínimo WCAG 2.5.8 (24×24). O avatar de 28×28 tem **área táctil real de 40×40** por pseudo-elemento.
- **Área de pesquisa:** clicar em qualquer ponto da caixa foca o campo.

---

## 7. Pendentes priorizados (não aplicados)

| Prioridade | Item | Ganho estimado | Risco |
|---|---|---|---|
| 1 | **Miniaturas responsivas** (`srcset` a 400 px) para as 6 fotografias da grelha, que hoje descarregam o ficheiro completo (≈110 KB) para cartões de ~96 px | **−400 a −600 KB** no Início e em Eventos | médio (toca em `mockData`, `SafeImage`, cartões) |
| 2 | **Divisão do bundle** (405 KB): separar Bíblia/leitor e visualizador em *chunks* carregados a pedido | **−120 a −180 KB** no arranque | médio |
| 3 | Limpeza dos botões duplicados e ocultos `Ver fotografia N` (o DOM tem 12 botões para 6 fotos) | DOM mais leve e auditorias mais fiáveis | baixo |
| 4 | Fotografias dos eventos "Retiro Espiritual" e "Reunião de Obreiros" reaproveitam imagens de outros cartões | consistência visual | baixo (falta material novo) |
| 5 | Pré-carregamento do primeiro slide do carrossel (`fetchpriority="high"`) | −30 a −60 ms no FCP | baixo |

---

## 8. Como reproduzir

Os quatro scripts que produziram este relatório ficam no repositório, em `scripts/auditoria/` (ver o `README.md` dessa pasta).

```bash
npm run build && PORT=4100 node server.js &
npm i -D playwright && npx playwright install chromium   # dependência das auditorias

node scripts/auditoria/audit-fluxo.mjs      # 36 verificações funcionais + persistência
node scripts/auditoria/audit-perf.mjs       # FCP/DCL/CLS/tarefas longas por ecrã
node scripts/auditoria/audit-harmonia.mjs   # 6 viewports: overflow, alvos, alt, sobreposições
node scripts/auditoria/audit-detalhe2.mjs   # contraste AA (oklch → sRGB) e alvos pequenos
npm test                                    # 22 testes de unidade
```

Opções: `AUDIT_URL` (endereço a auditar) e `AUDIT_OUT` (pasta das capturas, por omissão `./auditoria-out`).

---

## 9. Tema escuro (ícone Escuro/Claro no appbar)

O alternador fica no appbar (desktop e telemóvel), guarda a escolha em `localStorage` (`mevd:tema`) e aplica `data-theme="dark"` no `<html>` — com um pequeno script no `index.html` que evita o flash claro ao recarregar.

| Elemento | Claro | Escuro |
|---|---|---|
| Fundo do app, cartões, appbar, sidebar e modais | `#ffffff` / `#f1f5f9` | **`#050D1C`** |
| Linhas, bordas e divisores (toda a app) | `#e2e8f0` | **`#163B70`** |
| Texto principal | `slate-900` | `#eef4fc` |
| Texto secundário | `slate-500/400` | `#aec0dd` / `#97abc9` |
| Azuis de destaque | `#0066cc` | `#6fb1ff` |
| Logomarca | `MEVD_LOGO_02.webp` (traço azul) | **`MEVD_LOGO_DARK.webp`** (traço claro, imagem fornecida) |
| 1.º destaque do carrossel | `MEVD_LOCKUP_02.webp` | **`MEVD_LOCKUP_DARK.webp`** |

Verificação em Playwright: **0 falhas de contraste** nos 5 ecrãs principais (Início, Eventos, Bíblia, Comunicados, Perfil) e no popup do comunicado; 320→1920 px sem overflow; logomarca e destaque trocam e voltam ao claro; preferência mantém-se após recarregar; 0 erros de consola.
