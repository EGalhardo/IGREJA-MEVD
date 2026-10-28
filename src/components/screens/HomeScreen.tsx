import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Calendar, Megaphone, Play, BookOpen, Clock, MapPin, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHURCH_EVENTS } from '../../data/mockData';
import { ChurchEvent, Screen } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectEvent: (event: ChurchEvent) => void;
  onOpenQuickFeature?: (feature: string) => void;
  isDesktopLayout?: boolean;
}

// Imagens em destaque do carrossel oficial da IGREJA MEVD
const HERO_CAROUSEL_SLIDES = [
  {
    id: 1,
    image: '/assets/aistudio/1_6270ba45.png',
    alt: 'IGREJA MEVD - Logomarca e Identidade Oficial',
    title: 'Bem-vindo à IGREJA MEVD',
    subtitle: 'Uma igreja viva, unida e em missão.',
    cta: 'Conhecer a Igreja',
  },
  {
    id: 2,
    image: '/assets/aistudio/2_b0dbb042.png',
    alt: 'Nova Série: Edificando uma Família Excelente com Pr. Feliz & Pra. Manuela Paulo',
    title: 'Nova Série: Família Excelente',
    subtitle: 'Todos os domingos de Junho às 09h • Pr. Feliz & Pra. Manuela',
    cta: 'Ver Programação',
  },
  {
    id: 3,
    image: '/assets/aistudio/3_f31b15f7.png',
    alt: 'Save the Date: 9º CVD Congresso de Jovens e Vigília de Oração',
    title: '9º CVD • Congresso de Jovens',
    subtitle: '17 e 18 de Outubro • Vigília de Oração e Louvor',
    cta: 'Ver Detalhes do Evento',
  },
];

export default function HomeScreen({
  onNavigate,
  onSelectEvent,
  onOpenQuickFeature,
  isDesktopLayout = false,
}: HomeScreenProps) {
  // Todos os eventos recentes e novos da IGREJA MEVD para a secção Próximos Eventos
  const upcomingEvents = CHURCH_EVENTS;

  // Carrossel de 5 segundos em modo loop
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_CAROUSEL_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_CAROUSEL_SLIDES.length) % HERO_CAROUSEL_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // 5 segundos

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Carrossel de Destaque Animado com Duração de 5 segundos e Loop Infinito */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E2E8F0] w-full aspect-[16/9] select-none group bg-slate-100"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides: 100% Preenchimento Total do Container sem cortes nem espaços vazios */}
          {HERO_CAROUSEL_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                onClick={() => onNavigate('events')}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center block"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}

          {/* Botão Anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-sm"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Botão Próximo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-sm"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Indicadores de Slide (Pills elegantes com fundo translúcido para contraste em qualquer imagem) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20 shadow-sm">
            {HERO_CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                  idx === currentSlide
                    ? 'w-7 sm:w-8 bg-white shadow-xs'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Barra de Progresso Animada de 5 segundos no topo do carrossel */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-amber-400 animate-in"
              style={{
                width: '100%',
                animation: isPaused ? 'none' : 'carouselProgress 5s linear forwards',
              }}
            />
          </div>
        </div>

        {/* Campo Centralizado "Pesquisar Eventos" no Modo Desktop / Tablet */}
        {isDesktopLayout && (
          <div className="flex justify-center w-full animate-in fade-in slide-in-from-top-2 duration-300">
            <div
              onClick={() => onNavigate('events')}
              className="w-full max-w-2xl bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-[#E2E8F0] hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066cc] flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <Search className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Pesquisar Eventos
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Encontre cultos, congressos, vigílias e actividades especiais da IGREJA MEVD...
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0055aa] px-4 py-2 rounded-xl shadow-xs transition-colors">
                Explorar Agenda
              </span>
            </div>
          </div>
        )}

        {/* 4 Quick Actions Grid */}
        <div>
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
            {/* 1. Eventos */}
            <button
              onClick={() => onNavigate('events')}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#E2E8F0] hover:border-blue-300 hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:bg-purple-100 group-hover:scale-105 transition-all">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">Eventos</span>
            </button>

            {/* 2. Comunicados */}
            <button
              onClick={() => onNavigate('announcements')}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#E2E8F0] hover:border-blue-300 hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-blue-50 text-[#0066cc] flex items-center justify-center mb-2 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">Comunicados</span>
            </button>

            {/* 3. Sermões */}
            <button
              onClick={() => onOpenQuickFeature?.('sermoes')}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#E2E8F0] hover:border-blue-300 hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:bg-emerald-100 group-hover:scale-105 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center pl-0.5">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">Sermões</span>
            </button>

            {/* 4. Bíblia */}
            <button
              onClick={() => onNavigate('bible')}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-[#E2E8F0] hover:border-blue-300 hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:bg-amber-100 group-hover:scale-105 transition-all">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">Bíblia</span>
            </button>
          </div>
        </div>

        {/* Próximos Eventos Section */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Próximos eventos
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                Fique a par das actividades mais importantes da nossa comunidade
              </p>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs sm:text-sm font-semibold text-[#0066cc] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Event Cards - 1 col on mobile, 2 cols on tablet / desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  onSelectEvent(event);
                  onNavigate('event-detail');
                }}
                className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-[#E2E8F0] flex items-center gap-3.5 cursor-pointer hover:border-[#0066cc]/60 hover:shadow-md active:scale-[0.99] transition-all group"
              >
                {/* Left Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative shadow-2xs">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Middle Date Badge */}
                <div className="flex flex-col items-center justify-center w-11 h-13 rounded-xl bg-blue-50 border border-blue-200/80 text-center shrink-0">
                  <span className="text-base sm:text-lg font-black text-[#0066cc] leading-none">
                    {event.dateDay}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mt-0.5">
                    {event.dateMonth}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#0066cc] transition-colors leading-snug">
                    {event.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2 flex items-center justify-between">
                    {event.statusBadge.variant === 'green' && (
                      <span className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {event.statusBadge.text}
                      </span>
                    )}
                    {event.statusBadge.variant === 'blue' && (
                      <span className="inline-block bg-sky-50 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                        {event.statusBadge.text}
                      </span>
                    )}
                    {event.statusBadge.variant === 'purple' && (
                      <span className="inline-block bg-purple-50 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                        {event.statusBadge.text}
                      </span>
                    )}

                    <span className="text-[11px] font-bold text-[#0066cc] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      <span>Ver</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
