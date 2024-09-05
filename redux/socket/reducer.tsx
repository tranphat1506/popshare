import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SocketState {
    isConnected: boolean;
    socketId?: string;
}

const initialState: SocketState = {
    isConnected: false,
    socketId: undefined,
};

// Now create the slice
const socketSlice = createSlice({
    name: 'socket',
    initialState,
    // Reducers: Functions we can call on the store
    reducers: {
        connectionEstablished: (state, action: PayloadAction<{ socketId?: string }>) => {
            state.socketId = action.payload.socketId;
            state.isConnected = true;
        },
        connectionLost: (state) => {
            state.socketId = undefined;
            state.isConnected = false;
        },
    },
});

// Don't have to define actions, they are automatically generated
export const { connectionEstablished, connectionLost } = socketSlice.actions;
// Export the reducer for this slice
export default socketSlice.reducer;
