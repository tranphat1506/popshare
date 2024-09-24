export interface IFriendShip {
    receiverInfo?: {
        username: string;
        displayName: string;
        avatarEmoji: string;
        profilePicture: string;
        avatarColor: string;
    };
    senderInfo?: {
        username: string;
        displayName: string;
        avatarEmoji: string;
        profilePicture: string;
        avatarColor: string;
    };
    receiverId: string;
    senderId: string;
    requestTime: number;
    responseTime?: number;
    status: RequestStatusTypes;
}

export type RequestStatusTypes = 'accepted' | 'pending';
export const RequestStatusEnum: RequestStatusTypes[] = ['accepted', 'pending'];
