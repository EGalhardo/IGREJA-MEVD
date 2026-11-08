export type Screen = 'home' | 'events' | 'event-detail' | 'profile' | 'announcements' | 'bible';

export type EventCategory = 'Todos' | 'Cultos' | 'Congressos' | 'Vigílias' | 'Reuniões';

/** Fotografia do álbum (galeria) de um evento */
export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  /** Momento do evento: Louvor, Pregação, Comunhão, ... */
  tag?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  dateDay: string;
  dateMonth: string;
  time: string;
  location: string;
  category: EventCategory;
  statusBadge: {
    text: 'Inscrições abertas' | 'Pendente' | 'Em breve';
    variant: 'green' | 'blue' | 'purple';
  };
  image: string;
  capacity?: string;
  description?: string;
  highlights?: Array<{
    icon: 'mic' | 'music' | 'users';
    title: string;
  }>;
  /** Álbum do evento (galeria de fotos) */
  gallery?: GalleryPhoto[];
}

export interface UserProfile {
  name: string;
  status: string;
  avatar: string;
  civilStatus: string;
  phone: string;
  address: string;
  email: string;
  churchName: string;
  activitiesCount: {
    eventsRegistered: number;
    departments: number;
  };
  notificationsActive: boolean;
}
