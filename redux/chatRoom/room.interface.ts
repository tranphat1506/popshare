import { IRequestOnTyping } from '@/hooks/socket.io/useOnActionOnChatRoom';

// Interface cho NotificationSettings
interface INotificationSettings {
    message: boolean;
    tag: boolean;
}
// Interface cho MemberDetail
export interface IMemberDetail {
    memberId: string;
    position: MemberPositionTypes;
    permissionScore: number;
    joinedAt: number;
    displayName?: string;
    notificationSettings: INotificationSettings;
}

// Interface cho MembersList
export interface IMembersList {
    member: number;
    list: IMemberDetail[]; // Mảng các MemberDetail
}
interface IMessageSettings {
    allowMemberMessage: boolean;
    allowAutoJoin: boolean;
}
export interface IRoomDetail {
    _id: string; // room id
    roomAvatar?: string;
    roomName?: string;
    roomBannedList: IMembersList; // MembersList chứa danh sách cấm
    roomMembers: IMembersList; // MembersList chứa danh sách thành viên
    createdBy: string;
    createdAt: number;
    messageSettings: IMessageSettings;
    roomType: RoomTypeTypes;
}
type MemberPositionTypes = 'owner' | 'member' | 'other';
export const MemberPositionEnum: MemberPositionTypes[] = ['member', 'other', 'owner'];

export type RoomTypeTypes = 'cloud' | 'group' | 'p2p';
export const RoomTypeEnum: RoomTypeTypes[] = ['cloud', 'group', 'p2p'];
