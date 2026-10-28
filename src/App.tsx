import { useState, useEffect, useRef } from 'react';
import HomeScreen from './components/screens/HomeScreen';
import EventsScreen from './components/screens/EventsScreen';
import EventDetailScreen from './components/screens/EventDetailScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import BibleScreen from './components/screens/BibleScreen';
import ComunicadosScreen from './components/screens/ComunicadosScreen';
import Appbar from './components/Appbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Modals from './components/Modals';
import { CHURCH_EVENTS, CURRENT_USER } from './data/mockData';
import { ChurchEvent, EventCategory, Screen, UserProfile } from './types';
import { Smartphone, Monitor, X } from 'lucide-react';

type LayoutOverride = 'auto' | 'mobile-vertical' | 'desktop-horizontal';

function getLinkedEvent(): ChurchEvent | undefined {
  if (typeof window === 'undefined') return undefined;
  const eventId = new URLSearchParams(window.location.search).get('evento');
  return CHURCH_EVENTS.find((event) => event.id === eventId);
}

function clearLinkedEvent() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('evento')) return;
  url.searchParams.delete('evento');
  try {
    window.history.replaceState(window.history.state, '', url);
  } catch {
    // A navegação continua a funcionar mesmo que o navegador restrinja o histórico.
  }
}

export default function App() {
  const [linkedEvent] = useState(getLinkedEvent);
  const [currentScreen, setCurrentScreen] = useState<Screen>(linkedEvent ? 'event-detail' : 'home');
  const [previousScreen, setPreviousScreen] = useState<Screen>(linkedEvent ? 'events' : 'home');
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent>(linkedEvent ?? CHURCH_EVENTS[0]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [eventCategory, setEventCategory] = useState<EventCategory>('Todos');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // Layout mode override: auto detects window dimensions & orientation, or allows manual previewing
  const [layoutOverride, setLayoutOverride] = useState<LayoutOverride>('auto');
  const [isWindowDesktopOrLandscape, setIsWindowDesktopOrLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    return window.innerWidth >= 1024 || (window.innerWidth >= 768 && isLandscape);
  });

  // Listen to viewport resizing and orientation changes
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      const isWide = window.innerWidth >= 1024 || (window.innerWidth >= 768 && isLandscape);
      setIsWindowDesktopOrLandscape(isWide);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Determine active layout mode:
  // - desktop-horizontal: Sidebar + Appbar + Central Content Area
  // - mobile-vertical: Appbar + Central Content Area + Bottom Navbar
  const isDesktopLayout =
    layoutOverride === 'desktop-horizontal'
      ? true
      : layoutOverride === 'mobile-vertical'
      ? false
      : isWindowDesktopOrLandscape;

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  // Show temporary toast message
  const showToast = (message: string) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimer.current = null;
    }, 3200);
  };

  // Safe navigation helper
  const navigateTo = (screen: Screen) => {
    if (screen !== 'event-detail') clearLinkedEvent();
    if (screen === currentScreen) return;
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    clearLinkedEvent();
    if (currentScreen === 'event-detail') {
      setCurrentScreen(previousScreen === 'event-detail' ? 'events' : previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleSelectEvent = (event: ChurchEvent) => {
    setSelectedEvent(event);
  };

  const handleToggleRegistration = (eventId: string) => {
    setRegisteredEventIds((previous) =>
      previous.includes(eventId)
        ? previous.filter((id) => id !== eventId)
        : [...previous, eventId]
    );
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleLogout = () => {
    setActiveModal('logout-confirm');
  };

  const handleConfirmLogout = () => {
    showToast('Não há uma sessão autenticada nesta versão.');
    navigateTo('home');
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Device Simulator / Mode Selector Bar (Quick Switcher for Reviewing all Responsive Modes) */}
      <div className="bg-slate-900 text-white px-3 sm:px-6 py-2 flex items-center justify-between shrink-0 text-xs border-b border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight text-white hidden sm:inline">
            IGREJA MEVD • Sistema Responsivo
          </span>
          <span className="text-slate-400 text-[11px] bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            {isDesktopLayout
              ? 'Tablet Horizontal / Desktop (Sidebar + Appbar + Conteúdo)'
              : 'Mobile / Tablet Vertical (Appbar + Conteúdo + Navbar)'}
          </span>
        </div>

        {/* Layout Mode Simulator Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setLayoutOverride('auto')}
            className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              layoutOverride === 'auto'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Detecção automática de tamanho e rotação"
          >
            Auto
          </button>
          <button
            onClick={() => setLayoutOverride('mobile-vertical')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              layoutOverride === 'mobile-vertical'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Modo Mobile & Tablet Vertical"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile / Tablet Vertical</span>
          </button>
          <button
            onClick={() => setLayoutOverride('desktop-horizontal')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              layoutOverride === 'desktop-horizontal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Modo Tablet Horizontal & Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet Horizontal / Desktop</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Application Shell */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* MODE A: Tablet Horizontal & Desktop (Sidebar + Appbar + Central Content) */}
        {isDesktopLayout ? (
          <div className="flex w-full h-full overflow-hidden bg-white">
            {/* Barra Lateral (Sidebar) */}
            <Sidebar
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              user={user}
              onLogout={handleLogout}
              unreadCount={3}
            />

            {/* Coluna Principal: Appbar + Área Central de Conteúdo */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
              {/* Appbar Superior */}
              <Appbar
                currentScreen={currentScreen}
                isDesktopLayout={true}
                onNavigate={navigateTo}
                onBack={handleBack}
                onOpenNotifications={() => setActiveModal('notificacoes')}
                onOpenProfile={() => navigateTo('profile')}
                onMicClick={() => showToast('A pesquisa por voz não está disponível nesta versão.')}
                user={user}
                unreadCount={3}
              />

              {/* Área Central de Conteúdo */}
              <main className="flex-1 overflow-y-auto flex flex-col">
                {currentScreen === 'home' && (
                  <HomeScreen
                    onNavigate={navigateTo}
                    onSelectEvent={handleSelectEvent}
                    onOpenQuickFeature={(feature) => setActiveModal(feature)}
                    isDesktopLayout={true}
                  />
                )}

                {currentScreen === 'events' && (
                  <EventsScreen
                    onNavigate={navigateTo}
                    onSelectEvent={handleSelectEvent}
                    selectedCategory={eventCategory}
                    onSelectCategory={setEventCategory}
                    searchQuery={eventSearchQuery}
                    onSearchQueryChange={setEventSearchQuery}
                    isDesktopLayout={true}
                  />
                )}

                {currentScreen === 'event-detail' && (
                  <EventDetailScreen
                    event={selectedEvent}
                    isRegistered={registeredEventIds.includes(selectedEvent.id)}
                    onToggleRegistration={handleToggleRegistration}
                    onNavigate={navigateTo}
                    onBack={handleBack}
                    onShowToast={showToast}
                    isDesktopLayout={true}
                  />
                )}

                {currentScreen === 'bible' && (
                  <BibleScreen
                    onNavigate={navigateTo}
                    onShowToast={showToast}
                    isDesktopLayout={true}
                  />
                )}

                {currentScreen === 'profile' && (
                  <ProfileScreen
                    user={user}
                    onNavigate={navigateTo}
                    onOpenOption={(opt) => setActiveModal(opt)}
                    onLogout={handleLogout}
                    isDesktopLayout={true}
                  />
                )}

                {currentScreen === 'announcements' && (
                  <ComunicadosScreen
                    onNavigate={navigateTo}
                    isDesktopLayout={true}
                  />
                )}
              </main>
            </div>
          </div>
        ) : (
          /* MODE B: Mobile & Tablet Vertical (Appbar + Área Central de Conteúdo + Navbar) */
          <div className="flex flex-col w-full h-full overflow-hidden bg-white max-w-2xl mx-auto border-x-0 sm:border-x border-[#E2E8F0] shadow-xs">
            {/* Appbar Superior */}
            <Appbar
              currentScreen={currentScreen}
              isDesktopLayout={false}
              onNavigate={navigateTo}
              onBack={handleBack}
              onOpenNotifications={() => setActiveModal('notificacoes')}
              onOpenProfile={() => navigateTo('profile')}
              onMicClick={() => showToast('A pesquisa por voz não está disponível nesta versão.')}
              user={user}
              unreadCount={3}
            />

            {/* Área Central de Conteúdo */}
            <main className="flex-1 overflow-y-auto flex flex-col">
              {currentScreen === 'home' && (
                <HomeScreen
                  onNavigate={navigateTo}
                  onSelectEvent={handleSelectEvent}
                  onOpenQuickFeature={(feature) => setActiveModal(feature)}
                  isDesktopLayout={false}
                />
              )}

              {currentScreen === 'events' && (
                <EventsScreen
                  onNavigate={navigateTo}
                  onSelectEvent={handleSelectEvent}
                  selectedCategory={eventCategory}
                  onSelectCategory={setEventCategory}
                  searchQuery={eventSearchQuery}
                  onSearchQueryChange={setEventSearchQuery}
                  isDesktopLayout={false}
                />
              )}

              {currentScreen === 'event-detail' && (
                <EventDetailScreen
                  event={selectedEvent}
                  isRegistered={registeredEventIds.includes(selectedEvent.id)}
                  onToggleRegistration={handleToggleRegistration}
                  onNavigate={navigateTo}
                  onBack={handleBack}
                  onShowToast={showToast}
                  isDesktopLayout={false}
                />
              )}

              {currentScreen === 'bible' && (
                <BibleScreen
                  onNavigate={navigateTo}
                  onShowToast={showToast}
                  isDesktopLayout={false}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  user={user}
                  onNavigate={navigateTo}
                  onOpenOption={(opt) => setActiveModal(opt)}
                  onLogout={handleLogout}
                  isDesktopLayout={false}
                />
              )}

              {currentScreen === 'announcements' && (
                <ComunicadosScreen
                  onNavigate={navigateTo}
                  isDesktopLayout={false}
                />
              )}
            </main>

            {/* Navbar Inferior */}
            <BottomNav
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              isDesktopLayout={false}
            />
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-sm px-4">
            <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700/60">
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-2 p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Modals */}
        <Modals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          user={user}
          onUpdateUser={handleUpdateUser}
          onConfirmLogout={handleConfirmLogout}
          onShowToast={showToast}
        />
      </div>
    </div>
  );
}
