import { useState } from 'react';
import { Search, SlidersHorizontal, Clock, MapPin, ChevronRight } from 'lucide-react';
import { CHURCH_EVENTS } from '../../data/mockData';
import { ChurchEvent, EventCategory, Screen } from '../../types';

interface EventsScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectEvent: (event: ChurchEvent) => void;
  isDesktopLayout?: boolean;
}

const CATEGORIES: EventCategory[] = ['Todos', 'Cultos', 'Congressos', 'Vigílias', 'Reuniões'];

export default function EventsScreen({ onNavigate, onSelectEvent, isDesktopLayout = false }: EventsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = CHURCH_EVENTS.filter((event) => {
    const matchesCategory =
      selectedCategory === 'Todos' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* Search & Filter Header Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E2E8F0] space-y-3.5">
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <div className="flex items-center gap-2 bg-[#f1f5f9] rounded-xl px-3.5 py-2.5 border border-[#E2E8F0] focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  className="text-slate-500 hover:text-slate-700 p-0.5 cursor-pointer"
                  aria-label="Filtros"
                  onClick={() => setSelectedCategory('Todos')}
                >
                  <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Event Count Indicator */}
            <div className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
              <span>A mostrar:</span>
              <strong className="text-slate-900">{filteredEvents.length} eventos</strong>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0066cc] text-white shadow-xs'
                      : 'bg-[#f1f5f9] text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid: 1 col on mobile, 2 cols on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 text-xs sm:text-sm bg-white rounded-2xl border border-[#E2E8F0]">
              Nenhum evento encontrado para a pesquisa actual.
            </div>
          ) : (
            filteredEvents.map((event) => (
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

                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center w-11 h-13 rounded-xl bg-blue-50 border border-blue-200/80 text-center shrink-0">
                  <span className="text-base sm:text-lg font-black text-[#0066cc] leading-none">
                    {event.dateDay}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mt-0.5">
                    {event.dateMonth}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#0066cc] transition-colors leading-snug">
                    {event.title}
                  </h3>

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

                    <div className="text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
