import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IRoomDetail } from './room.interface';
import { IMessageDetail } from './messages.interface';
import { IMarkAsSeenPayload } from '@/hooks/socket.io/useOnSeenStatus';
import { IRequestOnTyping } from '@/hooks/socket.io/useOnActionOnChatRoom';

export type ChatRoom = {
    detail: IRoomDetail;
    messages: IMessageDetail[];
    notRead: number;
    lastMesssage?: IMessageDetail;
    // for UI
    onAction?: IRequestOnTyping;
};
export interface ChatRoomState {
    rooms: { [roomId: string]: ChatRoom | undefined };
    roomQueue: string[];
}
export const initState: ChatRoomState = {
    rooms: {},
    roomQueue: [],
};
type UpdateChatRoomPayload<K extends keyof ChatRoom> = {
    roomId: string;
    field: K;
    data: ChatRoom[K];
};
const chatRoomReducer = {
    addRooms: (state: ChatRoomState, action: PayloadAction<IRoomDetail[]>) => {
        action.payload.forEach((room) => {
            state.rooms[room._id] = {
                detail: room,
                messages: [],
                notRead: 0,
                lastMesssage: undefined,
            };
        });
    },
    addRoom: (state: ChatRoomState, action: PayloadAction<IRoomDetail>) => {
        const room = action.payload;
        state.rooms[room._id] = {
            detail: room,
            messages: [],
            notRead: 0,
            lastMesssage: undefined,
        };
    },
    clearState: (state: ChatRoomState) => {
        state.rooms = {};
        state.roomQueue = [];
    },
    updateChatRoomData: <K extends keyof ChatRoom>(
        state: ChatRoomState,
        action: PayloadAction<UpdateChatRoomPayload<K>>,
    ) => {
        const payload = action.payload;
        const room = state.rooms[payload.roomId];
        if (!room) return;
        state.rooms[payload.roomId] = {
            ...room,
            [payload.field]: payload.data,
        };
    },
    sortTheRoomQueue: (state: ChatRoomState) => {
        state.roomQueue = Object.keys(state.rooms).sort((id: string, nextId: string) => {
            const room1 = state.rooms[id]!;
            const room2 = state.rooms[nextId]!;
            const lastMessageRoom1 = room1.lastMesssage;
            const lastMessageRoom2 = room2.lastMesssage;
            if (!lastMessageRoom1 || !lastMessageRoom2) return room1.detail.createdAt - room2.detail.createdAt;
            return lastMessageRoom1.createdAt - lastMessageRoom2.createdAt;
        });
    },
    updateTheNewestMessage: (
        state: ChatRoomState,
        action: PayloadAction<{ message: IMessageDetail; currentUserId: string }>,
    ) => {
        const { message, currentUserId } = action.payload;
        const room = state.rooms[message.roomId];
        if (!room) {
            console.error('Cannot found room with id', message.roomId);
            return;
        }
        if (!message.seenBy.includes(currentUserId)) {
            state.rooms[message.roomId]!.notRead += 1;
        } else {
            message.isSeen = true;
            message.isRecived = true;
        }
        state.roomQueue = [...new Set([message.roomId].concat(state.roomQueue))];
        state.rooms[message.roomId]!.messages = room.messages.concat([message]);
        state.rooms[message.roomId]!.lastMesssage = message;
    },
    updateTheNewestMessages: (
        state: ChatRoomState,
        action: PayloadAction<{ messages: IMessageDetail[]; currentUserId: string }>,
    ) => {
        const { messages, currentUserId } = action.payload;
        for (const message of messages) {
            const room = state.rooms[message.roomId];
            if (!room) {
                console.error('Cannot found room with id', message.roomId);
                return;
            }

            if (!message.seenBy.includes(currentUserId)) {
                state.rooms[message.roomId]!.notRead += 1;
            } else {
                message.isSeen = true;
                message.isRecived = true;
            }
            state.roomQueue = [...new Set([message.roomId].concat(state.roomQueue))];
            state.rooms[message.roomId]!.messages = room.messages.concat([message]);
            state.rooms[message.roomId]!.lastMesssage = message;
        }
    },
    updateTempMessageWithTempId: (
        state: ChatRoomState,
        action: PayloadAction<{ roomId: string; tempId: string; replaceMessage: IMessageDetail }>,
    ) => {
        const { roomId, tempId, replaceMessage } = action.payload;
        const findRoom = state.rooms[roomId];
        if (!findRoom) return;
        const messageIndex = state.rooms[roomId]!.messages.findIndex((m) => m._id === tempId);
        if (messageIndex === -1) return;
        state.rooms[roomId]!.messages[messageIndex] = replaceMessage;
        if (state.rooms[roomId]?.lastMesssage?._id === tempId) state.rooms[roomId].lastMesssage = replaceMessage;
    },

    updateSeenMessages: (
        state: ChatRoomState,
        action: PayloadAction<IMarkAsSeenPayload & { currentUserId: string }>,
    ) => {
        const { roomId, userId, messagesIdList, currentUserId } = action.payload;
        const room = state.rooms[roomId];
        if (!room) return;
        for (const messageId of messagesIdList) {
            const index = state.rooms[roomId]!.messages.findIndex((m) => m._id === messageId);
            if (index === -1) continue;
            state.rooms[roomId]!.messages[index].seenBy = state.rooms[roomId]!.messages[index].seenBy.concat(userId);
            state.rooms[roomId]!.messages[index].isRecived = true;
            state.rooms[roomId]!.messages[index].isSeen = true;
            if (userId === currentUserId) state.rooms[roomId]!.notRead -= 1;
        }
    },
};
const chatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState: initState,
    reducers: chatRoomReducer,
});

export const {
    addRoom,
    addRooms,
    clearState,
    updateChatRoomData,
    sortTheRoomQueue,
    updateTheNewestMessage,
    updateTheNewestMessages,
    updateTempMessageWithTempId,
    updateSeenMessages,
} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
