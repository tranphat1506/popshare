export type IMessageTypeTypes = 'text' | 'image' | 'video' | 'file';
export const MessageTypeEnum: IMessageTypeTypes[] = ['file', 'image', 'text', 'video'];

export interface IReaction {
    data: string;
    senderId: string;
    createdAt: number;
}
// Interface cho tin nhắn
export interface IMessageDetail {
    _id: string; // id message
    roomId: string; // ID của phòng chat
    senderId: string; // Người gửi tin nhắn

    messageType: IMessageTypeTypes; // Loại tin nhắn
    content?: string; // Nội dung tin nhắn (dành cho tin nhắn văn bản)
    mediaUrl?: string; // URL của media (ảnh, video, file)

    reactions: IReaction[];
    seenBy: string[]; // Danh sách người đã xem tin nhắn
    repliedTo?: string; // ID của tin nhắn mà tin nhắn này đang trả lời

    createdAt: number; // Thời gian gửi tin nhắn
    isEveryoneRecalled: boolean; // Nếu nguoi gui đã thu hồi tin nhắn voi tất cả người dùng trong phòng
    isSelfRecalled: boolean; // Nếu người gửi đã thu hồi tin nhắn
    tempId?: string;

    // for UI
    isTemp?: boolean;
    isSeen?: boolean;
    isRecived?: boolean;
}
