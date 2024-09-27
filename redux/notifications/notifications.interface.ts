export type NotificationTypeTypes = 'friend_request' | 'message' | 'others' | 'security' | 'broadcast';
export const NotificationTypeEnum: NotificationTypeTypes[] = [
    'broadcast',
    'friend_request',
    'message',
    'others',
    'security',
];

export type EntityTypeTypes = 'user' | 'server' | 'room';
export const EntityTypeEnum: EntityTypeTypes[] = ['room', 'server', 'user'];

export interface IEntity {
    entityType: EntityTypeTypes;
    userId?: string;
    serverName?: string;
    roomId?: string;
    createdAt?: number;
}

export interface INotification {
    _id: string;
    sender: IEntity;
    receiver: IEntity;
    notificationType: NotificationTypeTypes;
    notificationMessages: string[];
    notificationReaders: IEntity[];
    otherContents: any;
    createdAt: number;
}
