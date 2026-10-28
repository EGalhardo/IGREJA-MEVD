import { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Copy,
  Check,
  Type,
  ExternalLink,
  Flame,
  Tag
} from 'lucide-react';
import { Screen } from '../../types';
import {
  ALL_BIBLE_BOOKS,
  BibleBook,
  getChapterVerses,
  TOPICAL_SEARCH_VERSES,
  BibleVerse
} from '../../data/bibleData';

interface BibleScreenProps {
  onNavigate: (screen: Screen) => void;
  isDesktopLayout?: boolean;
}

const DAILY_VERSES = [
  {
    bookId: 'filipenses',
    chapter: 4,
    ref: 'Filipenses 4:13',
    text: 'Tudo posso naquele que me fortalece.',
    topic: 'Fé e Fortaleza',
  },
  {
    bookId: 'salmos',
    chapter: 23,
    ref: 'Salmos 23:1',
    text: 'O Senhor é o meu pastor, nada me faltará.',
    topic: 'Confiança e Cuidado',
  },
  {
    bookId: 'jeremias',
    chapter: 29,
    ref: 'Jeremias 29:11',
    text: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano.',
    topic: 'Esperança Divina',
  },
  {
    bookId: 'joao',
    chapter: 3,
    ref: 'João 3:16',
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    topic: 'Salvação e Amor',
  },
  {
    bookId: 'salmos',
    chapter: 91,
    ref: 'Salmos 91:1',
    text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.',
    topic: 'Proteção Celestial',
  },
];

type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl';

export default function BibleScreen({ onNavigate, isDesktopLayout = false }: BibleScreenProps) {
  // Navigation inside the Bible page
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'books' | 'chapters' | 'reader'>('books');

  // Filter state
  const [selectedTestament, setSelectedTestament] = useState<'todos' | 'AT' | 'NT'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('todos');

  // Verse of the day state
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const activeVerse = DAILY_VERSES[activeVerseIndex];

  // Reader state
  const [fontSize, setFontSize] = useState<ReaderFontSize>('base');
  const [bibleVersion, setBibleVersion] = useState<'ARA' | 'NVI'>('ARA');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mevd_bible_bookmarks');
      return saved ? JSON.parse(saved) : ['Salmos 23:1', 'Filipenses 4:13'];
    } catch {
      return ['Salmos 23:1', 'Filipenses 4:13'];
    }
  });
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Audio Speech Synthesis
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return ALL_BIBLE_BOOKS.filter((book) => {
      // Testament filter
      if (selectedTestament === 'AT' && book.testament !== 'AT') return false;
      if (selectedTestament === 'NT' && book.testament !== 'NT') return false;

      // Category filter
      if (activeCategory !== 'todos' && book.category !== activeCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = book.name.toLowerCase().includes(query);
        const matchesAbbr = book.abbr.toLowerCase().includes(query);
        const matchesCat = book.category.toLowerCase().includes(query);
        return matchesName || matchesAbbr || matchesCat;
      }

      return true;
    });
  }, [selectedTestament, activeCategory, searchQuery]);

  // Topic search results
  const topicalResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return TOPICAL_SEARCH_VERSES.filter(
      (item) =>
        item.topic.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query) ||
        item.ref.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Categories available based on testament
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    ALL_BIBLE_BOOKS.forEach((book) => {
      if (selectedTestament === 'todos' || book.testament === selectedTestament) {
        cats.add(book.category);
      }
    });
    return Array.from(cats);
  }, [selectedTestament]);

  // Handle open a book to select chapter
  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setViewMode('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle open specific chapter
  const handleSelectChapter = (chapterNum: number, bookToOpen?: BibleBook) => {
    const targetBook = bookToOpen || selectedBook;
    if (targetBook) {
      setSelectedBook(targetBook);
      setSelectedChapter(chapterNum);
      setViewMode('reader');
      stopAudio();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Return to books list
  const handleBackToBooks = () => {
    setViewMode('books');
    setSelectedChapter(null);
    stopAudio();
  };

  // Return to chapter selection
  const handleBackToChapters = () => {
    setViewMode('chapters');
    setSelectedChapter(null);
    stopAudio();
  };

  // Next / Prev Chapter
  const handleNextChapter = () => {
    if (!selectedBook || selectedChapter === null) return;
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(selectedChapter + 1);
      stopAudio();
    } else {
      // Go to next book
      const currentIndex = ALL_BIBLE_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (currentIndex < ALL_BIBLE_BOOKS.length - 1) {
        const nextBook = ALL_BIBLE_BOOKS[currentIndex + 1];
        setSelectedBook(nextBook);
        setSelectedChapter(1);
        stopAudio();
      }
    }
  };

  const handlePrevChapter = () => {
    if (!selectedBook || selectedChapter === null) return;
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      stopAudio();
    } else {
      // Go to prev book
      const currentIndex = ALL_BIBLE_BOOKS.findIndex((b) => b.id === selectedBook.id);
      if (currentIndex > 0) {
        const prevBook = ALL_BIBLE_BOOKS[currentIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.chapters);
        stopAudio();
      }
    }
  };

  // Bookmark toggle
  const toggleBookmark = (verseRef: string) => {
    setBookmarkedVerses((prev) => {
      const exists = prev.includes(verseRef);
      const updated = exists ? prev.filter((r) => r !== verseRef) : [...prev, verseRef];
      try {
        localStorage.setItem('mevd_bible_bookmarks', JSON.stringify(updated));
      } catch {
        // Ignore local storage error
      }
      return updated;
    });
  };

  // Copy to clipboard
  const handleCopyText = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(label);
      setTimeout(() => setCopiedNotification(null), 2500);
    }
  };

  // Audio Speech Synthesis Player
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const handleToggleAudio = (textToRead: string) => {
    if (!('speechSynthesis' in window)) {
      alert('A síntese de voz não é suportada neste navegador.');
      return;
    }

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Current reader verses
  const currentVerses: BibleVerse[] = useMemo(() => {
    if (!selectedBook || selectedChapter === null) return [];
    return getChapterVerses(selectedBook.id, selectedChapter);
  }, [selectedBook, selectedChapter]);

  // Current chapter text string for audio and copy
  const fullChapterText = useMemo(() => {
    if (!selectedBook || selectedChapter === null) return '';
    return `${selectedBook.name}, Capítulo ${selectedChapter}. ${currentVerses
      .map((v) => `${v.number}. ${v.text}`)
      .join(' ')}`;
  }, [selectedBook, selectedChapter, currentVerses]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Toast Notificação de Cópia */}
        {copiedNotification && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{copiedNotification} copiado com sucesso!</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 1: LISTA DE LIVROS (VELHO E NOVO TESTAMENTO)        */}
        {/* ======================================================== */}
        {viewMode === 'books' && (
          <>
            {/* Banner Inspirador do Versículo do Dia com Áudio e Navegação Direta */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm border border-amber-200/60 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-6 sm:p-8 text-white">
              <div className="relative z-10 flex flex-col justify-between min-h-[170px] sm:min-h-[190px]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-100 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Versículo do Dia • IGREJA MEVD
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAudio(`Versículo do dia. ${activeVerse.ref}. ${activeVerse.text}`)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isPlayingAudio ? 'bg-white text-amber-900 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={isPlayingAudio ? 'Pausar áudio' : 'Ouvir leitura em áudio'}
                      aria-label="Ouvir leitura em áudio"
                    >
                      {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleBookmark(activeVerse.ref)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        bookmarkedVerses.includes(activeVerse.ref)
                          ? 'bg-white text-amber-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title="Guardar versículo"
                      aria-label="Guardar versículo"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedVerses.includes(activeVerse.ref) ? 'fill-amber-900' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleCopyText(`"${activeVerse.text}" — ${activeVerse.ref}`, activeVerse.ref)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors cursor-pointer"
                      title="Copiar versículo"
                      aria-label="Copiar versículo"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-4">
                  <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic font-medium leading-relaxed">
                    "{activeVerse.text}"
                  </blockquote>
                  <p className="mt-2 text-xs sm:text-sm font-bold text-amber-200 tracking-wide flex items-center gap-2">
                    <span>— {activeVerse.ref}</span>
                    <span className="text-white/60">•</span>
                    <span className="font-normal text-amber-100">{activeVerse.topic}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/15 text-xs gap-2">
                  <button
                    onClick={() => {
                      const book = ALL_BIBLE_BOOKS.find((b) => b.id === activeVerse.bookId);
                      if (book) handleSelectChapter(activeVerse.chapter, book);
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-white hover:text-amber-200 underline transition-colors cursor-pointer"
                  >
                    <span>Ler capítulo completo ({activeVerse.ref.split(':')[0]})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveVerseIndex((prev) => (prev + 1) % DAILY_VERSES.length);
                      stopAudio();
                    }}
                    className="font-bold text-amber-100 hover:text-white transition-colors cursor-pointer"
                  >
                    Próximo versículo ({activeVerseIndex + 1}/{DAILY_VERSES.length}) →
                  </button>
                </div>
              </div>
            </div>

            {/* Container Principal: Livros da Bíblia Sagrada */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-[#E2E8F0] space-y-6">
              {/* Cabeçalho e Filtros de Testamento */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#0066cc]" />
                    <span>Bíblia Sagrada • Antigo e Novo Testamento</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Consulte os 66 livros canônicos, selecione qualquer capítulo e leia a palavra de Deus.
                  </p>
                </div>

                {/* Abas dos Testamentos com contagem */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold shrink-0">
                  <button
                    onClick={() => {
                      setSelectedTestament('todos');
                      setActiveCategory('todos');
                    }}
                    className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      selectedTestament === 'todos'
                        ? 'bg-white text-[#0066cc] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos (66)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTestament('AT');
                      setActiveCategory('todos');
                    }}
                    className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      selectedTestament === 'AT'
                        ? 'bg-white text-[#0066cc] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Velho Testamento (39)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTestament('NT');
                      setActiveCategory('todos');
                    }}
                    className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                      selectedTestament === 'NT'
                        ? 'bg-white text-[#0066cc] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Novo Testamento (27)
                  </button>
                </div>
              </div>

              {/* Barra de Busca de Livros e Palavras-chave */}
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar livro (ex: Salmos, Mateus, Gn, João) ou tema (ex: fé, amor, paz)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066cc] focus:bg-white transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 px-2 py-0.5 rounded-full cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Chips de Categorias Bíblicas */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setActiveCategory('todos')}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                    activeCategory === 'todos'
                      ? 'bg-[#0066cc] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas as Seções
                </button>
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                      activeCategory === category
                        ? 'bg-[#0066cc] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Se houver resultados por tema bíblico na busca */}
              {topicalResults.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0066cc]">
                    <Tag className="w-4 h-4" />
                    <span>Versículos Encontrados pelo Tema pesquisado:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topicalResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const book = ALL_BIBLE_BOOKS.find((b) => b.id === item.bookId);
                          if (book) handleSelectChapter(item.chapter, book);
                        }}
                        className="p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#0066cc] transition-all cursor-pointer shadow-2xs group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#0066cc]">
                            {item.ref}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#0066cc] font-semibold">
                            Tema: {item.topic}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">"{item.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid de Livros Canônicos */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
                  <span>Mostrando {filteredBooks.length} de {ALL_BIBLE_BOOKS.length} livros</span>
                  <span>Clique em um livro para escolher o capítulo</span>
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#E2E8F0] rounded-2xl">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Nenhum livro encontrado</p>
                    <p className="text-xs text-slate-500 mt-1">Tente pesquisar com outro termo ou limpe o filtro.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0066cc] hover:bg-blue-50/30 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="w-8 h-8 rounded-xl bg-slate-50 border border-[#E2E8F0] text-slate-800 font-bold text-xs flex items-center justify-center shadow-2xs group-hover:bg-[#0066cc] group-hover:text-white group-hover:border-[#0066cc] transition-colors">
                            {book.abbr}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              book.testament === 'AT'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {book.testament === 'AT' ? 'Velho' : 'Novo'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#0066cc] transition-colors">
                            {book.name}
                          </h4>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                            <span>{book.chapters} cap.</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                              {book.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Banner do Plano de Leitura Diário */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0">
                  <Bookmark className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Plano Diário de Leitura Bíblica • IGREJA MEVD
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho." — Salmos 119:105
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSelectChapter(1, ALL_BIBLE_BOOKS.find((b) => b.id === 'genesis'))}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Começar em Gênesis 1</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: SELETOR DE CAPÍTULOS DE UM LIVRO ESCOLHIDO      */}
        {/* ======================================================== */}
        {viewMode === 'chapters' && selectedBook && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-[#E2E8F0] space-y-6 animate-in fade-in duration-200">
            {/* Cabeçalho do Livro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToBooks}
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  aria-label="Voltar aos livros"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {selectedBook.name}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        selectedBook.testament === 'AT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {selectedBook.testament === 'AT' ? 'Velho Testamento' : 'Novo Testamento'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Seção: {selectedBook.category} • Total de {selectedBook.chapters} capítulos
                  </p>
                </div>
              </div>

              {/* Botão de Leitura Imediata (Capítulo 1) */}
              <button
                onClick={() => handleSelectChapter(1)}
                className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0055aa] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ler Capítulo 1</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grade de Capítulos */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                Selecione o capítulo para ler:
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2.5">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chNum) => (
                  <button
                    key={chNum}
                    onClick={() => handleSelectChapter(chNum)}
                    className="h-11 rounded-xl border border-[#E2E8F0] hover:border-[#0066cc] bg-white hover:bg-blue-50 font-bold text-xs sm:text-sm text-slate-800 hover:text-[#0066cc] transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                  >
                    {chNum}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 3: LEITOR BÍBLICO COMPLETO (READER MODE)           */}
        {/* ======================================================== */}
        {viewMode === 'reader' && selectedBook && selectedChapter !== null && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-[#E2E8F0] space-y-6 animate-in fade-in duration-200">
            {/* Top Toolbar de Navegação e Controles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToChapters}
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  title="Voltar aos capítulos"
                  aria-label="Voltar aos capítulos"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {selectedBook.name} {selectedChapter}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        selectedBook.testament === 'AT'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {selectedBook.testament === 'AT' ? 'AT' : 'NT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {bibleVersion === 'ARA' ? 'Almeida Revista e Atualizada' : 'Nova Versão Internacional'}
                  </p>
                </div>
              </div>

              {/* Botões de Ação do Leitor */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Versão da Bíblia */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setBibleVersion('ARA')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      bibleVersion === 'ARA' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ARA
                  </button>
                  <button
                    onClick={() => setBibleVersion('NVI')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      bibleVersion === 'NVI' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    NVI
                  </button>
                </div>

                {/* Ajuste de Tamanho de Fonte */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      fontSize === 'sm' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                    title="Fonte pequena"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      fontSize === 'base' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                    title="Fonte padrão"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      fontSize === 'lg' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                    title="Fonte grande"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      fontSize === 'xl' ? 'bg-white text-[#0066cc] shadow-xs' : 'text-slate-600'
                    }`}
                    title="Fonte extra grande"
                  >
                    A++
                  </button>
                </div>

                {/* Áudio Text-To-Speech */}
                <button
                  onClick={() => handleToggleAudio(fullChapterText)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                      : 'border border-[#E2E8F0] text-slate-700 hover:bg-slate-50'
                  }`}
                  title={isPlayingAudio ? 'Pausar áudio' : 'Ouvir capítulo em áudio'}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isPlayingAudio ? 'Pausar' : 'Ouvir'}</span>
                </button>

                {/* Copiar Capítulo */}
                <button
                  onClick={() => handleCopyText(fullChapterText, `${selectedBook.name} ${selectedChapter}`)}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar texto do capítulo"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copiar</span>
                </button>
              </div>
            </div>

            {/* Texto dos Versículos Bíblicos */}
            <div className="space-y-4 max-w-4xl mx-auto py-2">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs uppercase tracking-widest text-[#0066cc] font-bold">
                  {selectedBook.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                  {selectedBook.name} {selectedChapter}
                </h3>
              </div>

              <div
                className={`space-y-3 font-serif leading-relaxed text-slate-800 ${
                  fontSize === 'sm'
                    ? 'text-sm'
                    : fontSize === 'base'
                    ? 'text-base sm:text-lg'
                    : fontSize === 'lg'
                    ? 'text-lg sm:text-xl'
                    : 'text-xl sm:text-2xl'
                }`}
              >
                {currentVerses.map((verse) => {
                  const verseRef = `${selectedBook.name} ${selectedChapter}:${verse.number}`;
                  const isBookmarked = bookmarkedVerses.includes(verseRef);

                  return (
                    <div
                      key={verse.number}
                      className={`p-2.5 rounded-xl transition-colors hover:bg-slate-50 flex items-start gap-3 group relative ${
                        isBookmarked ? 'bg-amber-50/60 border-l-4 border-amber-500' : ''
                      }`}
                    >
                      <span className="font-sans font-bold text-xs text-[#0066cc] select-none pt-1 shrink-0 w-6">
                        {verse.number}
                      </span>
                      <p className="flex-1">{verse.text}</p>

                      {/* Ações rápidas no versículo */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                        <button
                          onClick={() => toggleBookmark(verseRef)}
                          className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-600 transition-colors cursor-pointer ${
                            isBookmarked ? 'text-amber-600' : ''
                          }`}
                          title={isBookmarked ? 'Remover dos favoritos' : 'Favoritar versículo'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleCopyText(`"${verse.text}" (${verseRef})`, verseRef)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Copiar versículo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rodapé com Navegação para Capítulo Anterior e Próximo */}
            <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <button
                onClick={handlePrevChapter}
                disabled={selectedChapter === 1 && selectedBook.id === ALL_BIBLE_BOOKS[0].id}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-slate-800 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Capítulo Anterior</span>
              </button>

              <button
                onClick={handleBackToChapters}
                className="text-xs font-bold text-[#0066cc] hover:underline cursor-pointer"
              >
                Ver todos os capítulos
              </button>

              <button
                onClick={handleNextChapter}
                disabled={
                  selectedChapter === selectedBook.chapters &&
                  selectedBook.id === ALL_BIBLE_BOOKS[ALL_BIBLE_BOOKS.length - 1].id
                }
                className="px-4 py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0055aa] text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Próximo Capítulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
