export interface INotification {
  id: string | number;
  image: string;
  secondaryImage?: string | null;
  content: string;
  createdAt: number;
}

export interface INotificationState {
  userNotification: Record<string, INotification[]>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  addNotifications: (userId: string, notifications: INotification[]) => void;
  fetchNotifications: (userId: string) => INotification[];

  deleteNotification: (userId: string, ids: (string | number)[]) => void;
  deleteAllNotifications: (userId: string) => void;
}
