export interface BibleBook {
  id: string;
  name: string;
  abbr: string;
  testament: 'AT' | 'NT';
  category: string;
  chapters: number;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleTopicSearch {
  topic: string;
  ref: string;
  bookId: string;
  chapter: number;
  text: string;
}

// Todos os 66 livros canônicos da Bíblia Sagrada (39 Antigo Testamento + 27 Novo Testamento)
export const ALL_BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento (39 livros)
  // Pentateuco / Lei
  { id: 'genesis', name: 'Gênesis', abbr: 'Gn', testament: 'AT', category: 'Pentateuco', chapters: 50 },
  { id: 'exodo', name: 'Êxodo', abbr: 'Êx', testament: 'AT', category: 'Pentateuco', chapters: 40 },
  { id: 'levitico', name: 'Levítico', abbr: 'Lv', testament: 'AT', category: 'Pentateuco', chapters: 27 },
  { id: 'numeros', name: 'Números', abbr: 'Nm', testament: 'AT', category: 'Pentateuco', chapters: 36 },
  { id: 'deuteronomio', name: 'Deuteronômio', abbr: 'Dt', testament: 'AT', category: 'Pentateuco', chapters: 34 },

  // Históricos
  { id: 'josue', name: 'Josué', abbr: 'Js', testament: 'AT', category: 'Históricos', chapters: 24 },
  { id: 'juizes', name: 'Juízes', abbr: 'Jz', testament: 'AT', category: 'Históricos', chapters: 21 },
  { id: 'rute', name: 'Rute', abbr: 'Rt', testament: 'AT', category: 'Históricos', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', abbr: '1Sm', testament: 'AT', category: 'Históricos', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', abbr: '2Sm', testament: 'AT', category: 'Históricos', chapters: 24 },
  { id: '1reis', name: '1 Reis', abbr: '1Rs', testament: 'AT', category: 'Históricos', chapters: 22 },
  { id: '2reis', name: '2 Reis', abbr: '2Rs', testament: 'AT', category: 'Históricos', chapters: 25 },
  { id: '1cronicas', name: '1 Crônicas', abbr: '1Cr', testament: 'AT', category: 'Históricos', chapters: 29 },
  { id: '2cronicas', name: '2 Crônicas', abbr: '2Cr', testament: 'AT', category: 'Históricos', chapters: 36 },
  { id: 'esdras', name: 'Esdras', abbr: 'Ed', testament: 'AT', category: 'Históricos', chapters: 10 },
  { id: 'neemias', name: 'Neemias', abbr: 'Ne', testament: 'AT', category: 'Históricos', chapters: 13 },
  { id: 'ester', name: 'Ester', abbr: 'Et', testament: 'AT', category: 'Históricos', chapters: 10 },

  // Poéticos e Sabedoria
  { id: 'jo', name: 'Jó', abbr: 'Jó', testament: 'AT', category: 'Poéticos', chapters: 42 },
  { id: 'salmos', name: 'Salmos', abbr: 'Sl', testament: 'AT', category: 'Poéticos', chapters: 150 },
  { id: 'proverbios', name: 'Provérbios', abbr: 'Pv', testament: 'AT', category: 'Poéticos', chapters: 31 },
  { id: 'eclesiastes', name: 'Eclesiastes', abbr: 'Ec', testament: 'AT', category: 'Poéticos', chapters: 12 },
  { id: 'canticos', name: 'Cânticos', abbr: 'Ct', testament: 'AT', category: 'Poéticos', chapters: 8 },

  // Profetas Maiores
  { id: 'isaias', name: 'Isaías', abbr: 'Is', testament: 'AT', category: 'Profetas Maiores', chapters: 66 },
  { id: 'jeremias', name: 'Jeremias', abbr: 'Jr', testament: 'AT', category: 'Profetas Maiores', chapters: 52 },
  { id: 'lamentacoes', name: 'Lamentações', abbr: 'Lm', testament: 'AT', category: 'Profetas Maiores', chapters: 5 },
  { id: 'ezequiel', name: 'Ezequiel', abbr: 'Ez', testament: 'AT', category: 'Profetas Maiores', chapters: 48 },
  { id: 'daniel', name: 'Daniel', abbr: 'Dn', testament: 'AT', category: 'Profetas Maiores', chapters: 12 },

  // Profetas Menores
  { id: 'oseias', name: 'Oseias', abbr: 'Os', testament: 'AT', category: 'Profetas Menores', chapters: 14 },
  { id: 'joel', name: 'Joel', abbr: 'Jl', testament: 'AT', category: 'Profetas Menores', chapters: 3 },
  { id: 'amos', name: 'Amós', abbr: 'Am', testament: 'AT', category: 'Profetas Menores', chapters: 9 },
  { id: 'obadias', name: 'Obadias', abbr: 'Ob', testament: 'AT', category: 'Profetas Menores', chapters: 1 },
  { id: 'jonas', name: 'Jonas', abbr: 'Jn', testament: 'AT', category: 'Profetas Menores', chapters: 4 },
  { id: 'miqueias', name: 'Miqueias', abbr: 'Mq', testament: 'AT', category: 'Profetas Menores', chapters: 7 },
  { id: 'naum', name: 'Naum', abbr: 'Na', testament: 'AT', category: 'Profetas Menores', chapters: 3 },
  { id: 'habacuque', name: 'Habacuque', abbr: 'Hc', testament: 'AT', category: 'Profetas Menores', chapters: 3 },
  { id: 'sofonias', name: 'Sofonias', abbr: 'Sf', testament: 'AT', category: 'Profetas Menores', chapters: 3 },
  { id: 'ageu', name: 'Ageu', abbr: 'Ag', testament: 'AT', category: 'Profetas Menores', chapters: 2 },
  { id: 'zacarias', name: 'Zacarias', abbr: 'Zc', testament: 'AT', category: 'Profetas Menores', chapters: 14 },
  { id: 'malaquias', name: 'Malaquias', abbr: 'Ml', testament: 'AT', category: 'Profetas Menores', chapters: 4 },

  // Novo Testamento (27 livros)
  // Evangelhos
  { id: 'mateus', name: 'Mateus', abbr: 'Mt', testament: 'NT', category: 'Evangelhos', chapters: 28 },
  { id: 'marcos', name: 'Marcos', abbr: 'Mc', testament: 'NT', category: 'Evangelhos', chapters: 16 },
  { id: 'lucas', name: 'Lucas', abbr: 'Lc', testament: 'NT', category: 'Evangelhos', chapters: 24 },
  { id: 'joao', name: 'João', abbr: 'Jo', testament: 'NT', category: 'Evangelhos', chapters: 21 },

  // Histórico
  { id: 'atos', name: 'Atos dos Apóstolos', abbr: 'At', testament: 'NT', category: 'Histórico', chapters: 28 },

  // Epístolas Paulinas
  { id: 'romanos', name: 'Romanos', abbr: 'Rm', testament: 'NT', category: 'Cartas Paulinas', chapters: 16 },
  { id: '1corintios', name: '1 Coríntios', abbr: '1Co', testament: 'NT', category: 'Cartas Paulinas', chapters: 16 },
  { id: '2corintios', name: '2 Coríntios', abbr: '2Co', testament: 'NT', category: 'Cartas Paulinas', chapters: 13 },
  { id: 'galatas', name: 'Gálatas', abbr: 'Gl', testament: 'NT', category: 'Cartas Paulinas', chapters: 6 },
  { id: 'efesios', name: 'Efésios', abbr: 'Ef', testament: 'NT', category: 'Cartas Paulinas', chapters: 6 },
  { id: 'filipenses', name: 'Filipenses', abbr: 'Fp', testament: 'NT', category: 'Cartas Paulinas', chapters: 4 },
  { id: 'colossenses', name: 'Colossenses', abbr: 'Cl', testament: 'NT', category: 'Cartas Paulinas', chapters: 4 },
  { id: '1tessalonicenses', name: '1 Tessalonicenses', abbr: '1Ts', testament: 'NT', category: 'Cartas Paulinas', chapters: 5 },
  { id: '2tessalonicenses', name: '2 Tessalonicenses', abbr: '2Ts', testament: 'NT', category: 'Cartas Paulinas', chapters: 3 },
  { id: '1timoteo', name: '1 Timóteo', abbr: '1Tm', testament: 'NT', category: 'Cartas Paulinas', chapters: 6 },
  { id: '2timoteo', name: '2 Timóteo', abbr: '2Tm', testament: 'NT', category: 'Cartas Paulinas', chapters: 4 },
  { id: 'tito', name: 'Tito', abbr: 'Tt', testament: 'NT', category: 'Cartas Paulinas', chapters: 3 },
  { id: 'filemom', name: 'Filemom', abbr: 'Fm', testament: 'NT', category: 'Cartas Paulinas', chapters: 1 },

  // Epístolas Gerais
  { id: 'hebreus', name: 'Hebreus', abbr: 'Hb', testament: 'NT', category: 'Cartas Gerais', chapters: 13 },
  { id: 'tiago', name: 'Tiago', abbr: 'Tg', testament: 'NT', category: 'Cartas Gerais', chapters: 5 },
  { id: '1pedro', name: '1 Pedro', abbr: '1Pe', testament: 'NT', category: 'Cartas Gerais', chapters: 5 },
  { id: '2pedro', name: '2 Pedro', abbr: '2Pe', testament: 'NT', category: 'Cartas Gerais', chapters: 3 },
  { id: '1joao', name: '1 João', abbr: '1Jo', testament: 'NT', category: 'Cartas Gerais', chapters: 5 },
  { id: '2joao', name: '2 João', abbr: '2Jo', testament: 'NT', category: 'Cartas Gerais', chapters: 1 },
  { id: '3joao', name: '3 João', abbr: '3Jo', testament: 'NT', category: 'Cartas Gerais', chapters: 1 },
  { id: 'judas', name: 'Judas', abbr: 'Jd', testament: 'NT', category: 'Cartas Gerais', chapters: 1 },

  // Profecia
  { id: 'apocalipse', name: 'Apocalipse', abbr: 'Ap', testament: 'NT', category: 'Profecia', chapters: 22 },
];

// Trechos bíblicos incluídos no projeto. Alguns capítulos estão incompletos e a versão não é identificada.
export const SCRIPTURE_CACHE: Record<string, BibleVerse[]> = {
  // Gênesis 1
  'genesis-1': [
    { number: 1, text: 'No princípio criou Deus os céus e a terra.' },
    { number: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.' },
    { number: 3, text: 'E disse Deus: Haja luz; e houve luz.' },
    { number: 4, text: 'E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas.' },
    { number: 5, text: 'E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro.' },
    { number: 26, text: 'E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra.' },
    { number: 27, text: 'E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.' },
    { number: 28, text: 'E Deus os abençoou, e Deus lhes disse: Frutificai e multiplicai-vos, e enchei a terra, e sujeitai-a.' },
    { number: 31, text: 'E viu Deus tudo quanto tinha feito, e eis que era muito bom; e foi a tarde e a manhã, o dia sexto.' },
  ],
  // Gênesis 12
  'genesis-12': [
    { number: 1, text: 'Ora, o Senhor disse a Abrão: Sai-te da tua terra, da tua parentela e da casa de teu pai, para a terra que eu te mostrarei.' },
    { number: 2, text: 'E far-te-ei uma grande nação, e abençoar-te-ei e engrandecerei o teu nome; e tu serás uma bênção.' },
    { number: 3, text: 'E abençoarei os que te abençoarem, e amaldiçoarei os que te amaldiçoarem; e em ti serão benditas todas as famílias da terra.' },
  ],
  // Êxodo 20
  'exodo-20': [
    { number: 1, text: 'Então falou Deus todas estas palavras, dizendo:' },
    { number: 2, text: 'Eu sou o Senhor teu Deus, que te tirei da terra do Egito, da casa da servidão.' },
    { number: 3, text: 'Não terás outros deuses diante de mim.' },
    { number: 7, text: 'Não tomarás o nome do Senhor teu Deus em vão; porque o Senhor não terá por inocente o que tomar o seu nome em vão.' },
    { number: 8, text: 'Lembra-te do dia do sábado, para o santificar.' },
    { number: 12, text: 'Honra a teu pai e a tua mãe, para que se prolonguem os teus dias na terra que o Senhor teu Deus te dá.' },
  ],
  // Josué 1
  'josue-1': [
    { number: 8, text: 'Não se aparte da tua boca o livro desta lei; antes medita nele dia e noite, para que tenhas cuidado de fazer conforme a tudo quanto nele está escrito; porque então farás prosperar o teu caminho, e serás bem sucedido.' },
    { number: 9, text: 'Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.' },
  ],
  // Salmos 1
  'salmos-1': [
    { number: 1, text: 'Bem-aventurado o homem que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda dos escarnecedores.' },
    { number: 2, text: 'Antes tem o seu prazer na lei do Senhor, e na sua lei medita de dia e de noite.' },
    { number: 3, text: 'Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto no seu tempo; as suas folhas não cairão, e tudo quanto fizer prosperará.' },
    { number: 6, text: 'Porque o Senhor conhece o caminho dos justos; porém o caminho dos ímpios perecerá.' },
  ],
  // Salmos 23
  'salmos-23': [
    { number: 1, text: 'O Senhor é o meu pastor, nada me faltará.' },
    { number: 2, text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranqüilas.' },
    { number: 3, text: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.' },
    { number: 4, text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.' },
    { number: 5, text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.' },
    { number: 6, text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' },
  ],
  // Salmos 91
  'salmos-91': [
    { number: 1, text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.' },
    { number: 2, text: 'Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.' },
    { number: 4, text: 'Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.' },
    { number: 7, text: 'Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti.' },
    { number: 11, text: 'Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.' },
    { number: 16, text: 'Fartá-lo-ei com longura de dias, e lhe mostrarei a minha salvação.' },
  ],
  // Salmos 121
  'salmos-121': [
    { number: 1, text: 'Levantarei os meus olhos para os montes, de onde vem o meu socorro.' },
    { number: 2, text: 'O meu socorro vem do Senhor que fez o céu e a terra.' },
    { number: 3, text: 'Não deixará vacilar o teu pé; aquele que te guarda não tosquenejará.' },
    { number: 7, text: 'O Senhor te guardará de todo o mal; guardará a tua alma.' },
    { number: 8, text: 'O Senhor guardará a tua entrada e a tua saída, desde agora e para sempre.' },
  ],
  // Provérbios 3
  'proverbios-3': [
    { number: 5, text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.' },
    { number: 6, text: 'Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.' },
    { number: 7, text: 'Não sejas sábio a teus próprios olhos; teme ao Senhor e aparta-te do mal.' },
  ],
  // Isaías 40
  'isaias-40': [
    { number: 28, text: 'Não sabes, não ouviste que o eterno Deus, o Senhor, o Criador dos fins da terra, nem se cansa nem se fatiga? É inescrutável o seu entendimento.' },
    { number: 29, text: 'Dá força ao cansado, e multiplica as forças ao que não tem nenhum vigor.' },
    { number: 31, text: 'Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.' },
  ],
  // Isaías 53
  'isaias-53': [
    { number: 3, text: 'Era desprezado, e o mais rejeitado entre os homens, homem de dores, e experimentado nos trabalhos.' },
    { number: 4, text: 'Verdadeiramente ele tomou sobre si as nossas enfermidades, e as nossas dores levou sobre si; e nós o reputávamos por aflito, ferido de Deus, e oprimido.' },
    { number: 5, text: 'Mas ele foi ferido por causa das nossas transgressões, e moído por causa das nossas iniqüidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.' },
  ],
  // Jeremias 29
  'jeremias-29': [
    { number: 11, text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.' },
    { number: 12, text: 'Então me invocareis, e ireis, e orareis a mim, e eu vos ouvirei.' },
    { number: 13, text: 'E buscar-me-eis, e me achareis, quando me buscardes com todo o vosso coração.' },
  ],
  // Mateus 5 (As Bem-aventuranças)
  'mateus-5': [
    { number: 1, text: 'E Jesus, vendo a multidão, subiu a um monte, e, assentando-se, chegaram-se a ele os seus discípulos;' },
    { number: 2, text: 'E, abrindo a sua boca, os ensinava, dizendo:' },
    { number: 3, text: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus;' },
    { number: 4, text: 'Bem-aventurados os que choram, porque eles serão consolados;' },
    { number: 5, text: 'Bem-aventurados os mansos, porque eles herdarão a terra;' },
    { number: 6, text: 'Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos;' },
    { number: 7, text: 'Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia;' },
    { number: 8, text: 'Bem-aventurados os limpos de coração, porque eles verão a Deus;' },
    { number: 9, text: 'Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus;' },
    { number: 14, text: 'Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte;' },
    { number: 16, text: 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.' },
  ],
  // Mateus 6 (Oração do Pai Nosso e Ansiedade)
  'mateus-6': [
    { number: 9, text: 'Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome;' },
    { number: 10, text: 'Venha o teu reino, seja feita a tua vontade, assim na terra como no céu;' },
    { number: 11, text: 'O pão nosso de cada dia nos dá hoje;' },
    { number: 12, text: 'E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores;' },
    { number: 13, text: 'E não nos conduzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém.' },
    { number: 33, text: 'Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.' },
    { number: 34, text: 'Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.' },
  ],
  // João 1
  'joao-1': [
    { number: 1, text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.' },
    { number: 2, text: 'Ele estava no princípio com Deus.' },
    { number: 3, text: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.' },
    { number: 4, text: 'Nele estava a vida, e a vida era a luz dos homens.' },
    { number: 12, text: 'Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus, aos que crêem no seu nome;' },
    { number: 14, text: 'E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade.' },
  ],
  // João 3
  'joao-3': [
    { number: 16, text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.' },
    { number: 17, text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.' },
  ],
  // João 14
  'joao-14': [
    { number: 1, text: 'Não se turbe o vosso coração; credes em Deus, crede também em mim.' },
    { number: 2, text: 'Na casa de meu Pai há muitas moradas; se não fosse assim, eu vo-lo teria dito. Vou preparar-vos lugar.' },
    { number: 6, text: 'Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.' },
    { number: 27, text: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.' },
  ],
  // Romanos 8
  'romanos-8': [
    { number: 1, text: 'Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o Espírito.' },
    { number: 28, text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.' },
    { number: 31, text: 'Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?' },
    { number: 37, text: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.' },
    { number: 38, text: 'Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,' },
    { number: 39, text: 'Nem a altura, nem a profundidade, nem alguma outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.' },
  ],
  // 1 Coríntios 13
  '1corintios-13': [
    { number: 1, text: 'Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.' },
    { number: 4, text: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbe.' },
    { number: 7, text: 'Tudo sofre, tudo crê, tudo espera, tudo suporta.' },
    { number: 8, text: 'O amor nunca falha; mas havendo profecias, serão aniquiladas; havendo línguas, cessarão; havendo ciência, desaparecerá;' },
    { number: 13, text: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor.' },
  ],
  // Gálatas 5
  'galatas-5': [
    { number: 22, text: 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.' },
    { number: 23, text: 'Contra estas coisas não há lei.' },
    { number: 25, text: 'Se vivemos pelo Espírito, andemos também pelo Espírito.' },
  ],
  // Efésios 6
  'efesios-6': [
    { number: 10, text: 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder.' },
    { number: 11, text: 'Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.' },
    { number: 14, text: 'Estai, pois, firmes, tendo cingidos os vossos lombos com a verdade, e vestida a couraça da justiça;' },
    { number: 16, text: 'Tomando sobretudo o escudo da fé, com o qual podereis apagar todos os dardos inflamados do maligno.' },
    { number: 17, text: 'Tomai também o capacete da salvação, e a espada do Espírito, que é a palavra de Deus;' },
  ],
  // Filipenses 4
  'filipenses-4': [
    { number: 4, text: 'Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.' },
    { number: 6, text: 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.' },
    { number: 7, text: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.' },
    { number: 13, text: 'Posso todas as coisas naquele que me fortalece.' },
    { number: 19, text: 'O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.' },
  ],
  // Hebreus 11
  'hebreus-11': [
    { number: 1, text: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não vêem.' },
    { number: 6, text: 'Ora, sem fé é impossível agradar-lhe; porque é necessário que aquele que se aproxima de Deus creia que ele existe, e que é galardoador dos que o buscam.' },
  ],
  // Tiago 1
  'tiago-1': [
    { number: 2, text: 'Meus irmãos, tende grande gozo quando cairdes em várias tentações;' },
    { number: 5, text: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada.' },
    { number: 22, text: 'E sede cumpridores da palavra, e não somente ouvintes, enganando-vos a vós mesmos.' },
  ],
  // Apocalipse 21
  'apocalipse-21': [
    { number: 1, text: 'E vi um novo céu, e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.' },
    { number: 3, text: 'E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles, e será o seu Deus.' },
    { number: 4, text: 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.' },
    { number: 5, text: 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas. E disse-me: Escreve; porque estas palavras são verdadeiras e fiéis.' },
  ],
};

// Devolve apenas os versículos realmente incluídos no projeto.
export function getChapterVerses(bookId: string, chapter: number): BibleVerse[] {
  return SCRIPTURE_CACHE[`${bookId}-${chapter}`] ?? [];
}

// Temas bíblicos populares para busca rápida por palavras-chave
export const TOPICAL_SEARCH_VERSES: BibleTopicSearch[] = [
  {
    topic: 'Fé',
    ref: 'Hebreus 11:1',
    bookId: 'hebreus',
    chapter: 11,
    text: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não vêem.'
  },
  {
    topic: 'Amor',
    ref: '1 Coríntios 13:13',
    bookId: '1corintios',
    chapter: 13,
    text: 'Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor.'
  },
  {
    topic: 'Salvação',
    ref: 'João 3:16',
    bookId: 'joao',
    chapter: 3,
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'
  },
  {
    topic: 'Paz',
    ref: 'Filipenses 4:7',
    bookId: 'filipenses',
    chapter: 4,
    text: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.'
  },
  {
    topic: 'Proteção',
    ref: 'Salmos 91:1',
    bookId: 'salmos',
    chapter: 91,
    text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.'
  },
  {
    topic: 'Esperança',
    ref: 'Jeremias 29:11',
    bookId: 'jeremias',
    chapter: 29,
    text: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano.'
  },
  {
    topic: 'Força',
    ref: 'Filipenses 4:13',
    bookId: 'filipenses',
    chapter: 4,
    text: 'Posso todas as coisas naquele que me fortalece.'
  },
  {
    topic: 'Provisão',
    ref: 'Salmos 23:1',
    bookId: 'salmos',
    chapter: 23,
    text: 'O Senhor é o meu pastor, nada me faltará.'
  },
  {
    topic: 'Criação',
    ref: 'Gênesis 1:1',
    bookId: 'genesis',
    chapter: 1,
    text: 'No princípio criou Deus os céus e a terra.'
  },
  {
    topic: 'Oração',
    ref: 'Mateus 6:9',
    bookId: 'mateus',
    chapter: 6,
    text: 'Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome...'
  },
  {
    topic: 'Consolação',
    ref: 'Apocalipse 21:4',
    bookId: 'apocalipse',
    chapter: 21,
    text: 'E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor.'
  },
];
