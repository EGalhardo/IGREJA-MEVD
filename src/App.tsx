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
import { X } from 'lucide-react';

const DESKTOP_LAYOUT_QUERY = '(min-width: 1024px), (min-width: 768px) and (orientation: landscape)';

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

  // O layout acompanha automaticamente a largura e a orientação do dispositivo.
  const [isDesktopLayout, setIsDesktopLayout] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_LAYOUT_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_LAYOUT_QUERY);
    const updateLayout = () => setIsDesktopLayout(query.matches);
    updateLayout();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', updateLayout);
      return () => query.removeEventListener('change', updateLayout);
    }

    // Compatibilidade com versões antigas de navegadores em tablets.
    query.addListener(updateLayout);
    return () => query.removeListener(updateLayout);
  }, []);

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
    <div
      className="h-screen w-full bg-slate-100 flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
      style={{ height: '100dvh' }}
    >
      <div className="relative flex h-full w-full overflow-hidden">
        <div
          className={`flex h-full w-full overflow-hidden bg-white ${
            isDesktopLayout ? '' : 'mx-auto max-w-2xl border-x-0 sm:border-x border-[#E2E8F0] shadow-xs'
          }`}
        >
          {isDesktopLayout && (
            <Sidebar
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              user={user}
              onLogout={handleLogout}
              unreadCount={3}
            />
          )}

          {/* A mesma árvore de conteúdo é mantida ao mudar a orientação do ecrã. */}
          <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
            <Appbar
              currentScreen={currentScreen}
              isDesktopLayout={isDesktopLayout}
              onNavigate={navigateTo}
              onBack={handleBack}
              onOpenNotifications={() => setActiveModal('notificacoes')}
              onOpenProfile={() => navigateTo('profile')}
              onMicClick={() => showToast('A pesquisa por voz não está disponível nesta versão.')}
              user={user}
              unreadCount={3}
            />

            <main className="@container flex min-h-0 flex-1 flex-col overflow-y-auto">
              {currentScreen === 'home' && (
                <HomeScreen
                  onNavigate={navigateTo}
                  onSelectEvent={handleSelectEvent}
                  onOpenQuickFeature={(feature) => setActiveModal(feature)}
                  isDesktopLayout={isDesktopLayout}
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
                  isDesktopLayout={isDesktopLayout}
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
                  isDesktopLayout={isDesktopLayout}
                />
              )}

              {currentScreen === 'bible' && (
                <BibleScreen
                  onNavigate={navigateTo}
                  onShowToast={showToast}
                  isDesktopLayout={isDesktopLayout}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  user={user}
                  onNavigate={navigateTo}
                  onOpenOption={(opt) => setActiveModal(opt)}
                  onLogout={handleLogout}
                  isDesktopLayout={isDesktopLayout}
                />
              )}

              {currentScreen === 'announcements' && (
                <ComunicadosScreen
                  onNavigate={navigateTo}
                  isDesktopLayout={isDesktopLayout}
                />
              )}
            </main>

            <BottomNav
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              isDesktopLayout={isDesktopLayout}
            />
          </div>
        </div>

        {toastMessage && (
          <div className={`fixed ${isDesktopLayout ? 'top-[calc(var(--desktop-header-height)+0.5rem)]' : 'top-16 sm:top-20'} left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 w-full max-w-sm px-4`}>
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
