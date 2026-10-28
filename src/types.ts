export type Screen = 'home' | 'events' | 'event-detail' | 'profile' | 'announcements' | 'bible';

export type EventCategory = 'Todos' | 'Cultos' | 'Congressos' | 'Vigílias' | 'Reuniões';

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
