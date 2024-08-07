import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';

type PeerId = string;
export type Peer = {
    id: PeerId;
    OS: typeof Platform.OS;
    username: string;
    deviceName: string;
    avatar: string;
};
// peer structure

export type Peers = Peer[];

interface PeersState {
    count: number;
    peers: Peers;
    friends: { [key: PeerId]: number };
}
export const initState: PeersState = {
    count: 0,
    peers: [],
    friends: {},
};
const peersReducer = {
    addPeer: (state: PeersState, action: PayloadAction<Peer>) => {
        state.peers = [...state.peers, action.payload];
        state.count = state.count + 1;
    },
    removePeer: (state: PeersState) => {
        state.count = state.count - 1;
        state.peers.splice(0, 1);
    },
    removePeerByPeerId: (state: PeersState, action: PayloadAction<PeerId>) => {
        const id = action.payload;
        // find room detail
        const index = state.peers.findIndex((p) => p.id === id);
        if (index !== -1) {
            state.peers.splice(index, 1);
            state.count = state.count - 1;
        }
    },
};
const peersSlice = createSlice({
    name: 'peers',
    initialState: initState,
    reducers: peersReducer,
});

export const { addPeer, removePeer, removePeerByPeerId } = peersSlice.actions;
export default peersSlice.reducer;
