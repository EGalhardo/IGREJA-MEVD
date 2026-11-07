/**
 * Notificações mostradas no menu dropdown da foto de perfil (appbar).
 *
 * Cada notificação tem um tipo (que define o ícone e a cor), um título curto,
 * a mensagem completa (mostrada no popup) e a indicação de lida/não lida.
 */

export type NotificationKind = 'evento' | 'culto' | 'aviso' | 'comunicado';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-congresso-jovens',
    kind: 'evento',
    title: 'Inscrições abertas • Congresso de Jovens 2027',
    message:
      'As inscrições para o Congresso de Jovens 2027 estão abertas. O encontro realiza-se a 15 de Maio, das 08:00 às 18:00, em Luanda, e as vagas são limitadas a 250 participantes. Faça a sua inscrição na página do evento ou no secretariado da igreja.',
    time: 'Hoje • 08:30',
    read: false,
  },
  {
    id: 'notif-culto-doutrina',
    kind: 'culto',
    title: 'Culto de Doutrina e Oração hoje às 18:30',
    message:
      'Lembramos que hoje, quarta-feira, às 18:30, temos o Culto de Doutrina e Oração no templo principal. Traga a sua Bíblia e convide um familiar ou amigo para participar deste momento de estudo e intercessão.',
    time: 'Hoje • 07:00',
    read: false,
  },
  {
    id: 'notif-vigilia',
    kind: 'aviso',
    title: 'Vigília de Oração confirmada para sábado',
    message:
      'A vigília de oração deste mês foi confirmada para sábado, às 22:00, no templo principal. Haverá transmissão para os membros que não puderem estar presentes. Pedimos que cheguem 15 minutos antes para a organização dos lugares.',
    time: 'Ontem • 19:45',
    read: false,
  },
  {
    id: 'notif-escola-biblica',
    kind: 'comunicado',
    title: 'Escola Bíblica Dominical passa a começar às 09:00',
    message:
      'A partir do próximo domingo, a Escola Bíblica Dominical passa a começar às 09:00. Os professores e auxiliares devem estar no templo 15 minutos antes para a preparação das salas e dos materiais.',
    time: 'Ontem • 12:10',
    read: true,
  },
  {
    id: 'notif-louvor',
    kind: 'comunicado',
    title: 'Ensaio geral do departamento de louvor',
    message:
      'O ensaio geral do departamento de louvor realiza-se na sexta-feira, às 18:00, no templo principal. A presença de todos os coralistas e músicos é obrigatória para a preparação do culto de domingo.',
    time: '2 dias • 16:20',
    read: true,
  },
];

export const countUnread = (list: AppNotification[]): number =>
  list.filter((notification) => !notification.read).length;
