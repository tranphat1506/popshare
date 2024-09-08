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
}
export const initState: ChatRoomState = {
    rooms: {},
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
};
const chatRoomSlice = createSlice({
    name: 'chatRoom',
    initialState: initState,
    reducers: chatRoomReducer,
});

export const { addRoom, addRooms, clearState, updateChatRoomData } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
