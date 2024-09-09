import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoomDetail } from './room.interface';
import { IMessageDetail } from './messages.interface';

export type ChatRoom = {
    detail: IRoomDetail;
    messages: IMessageDetail[];
    notRead?: number;
    lastMesssage?: IMessageDetail;
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
    updateTheNewestMessage: (state: ChatRoomState, action: PayloadAction<IMessageDetail>) => {
        const room = state.rooms[action.payload._id];
        if (!room) {
            console.error('Cannot found room with id', action.payload._id);
            return;
        }
        state.roomQueue = [action.payload._id].concat(state.roomQueue);
        state.rooms[action.payload._id]!.messages = [action.payload].concat(room.messages);
        state.rooms[action.payload._id]!.lastMesssage = action.payload;
    },
};
const chatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState: initState,
    reducers: chatRoomReducer,
});

export const { addRoom, addRooms, clearState, updateChatRoomData, sortTheRoomQueue, updateTheNewestMessage } =
    chatRoomSlice.actions;
export default chatRoomSlice.reducer;
