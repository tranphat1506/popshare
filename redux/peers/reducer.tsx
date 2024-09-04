import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PeerId = string;
export interface IOnlineState {
    userId: string;
    isOnline: boolean;
    lastTimeActive: number;
}
export interface IUserPublicDetail {
    userId: string;
    username: string;
    avatarEmoji: string;
    avatarColor: string;
    displayName: string;
    profilePicture?: string;
    onlineState?: IOnlineState;
}
export type Peer = IUserPublicDetail & {
    uriAvatar?: string;
    pinSlot?: number;
    suffixName?: string;
};
// peer structure
export type Peers = {
    [key: PeerId]: Peer;
};
export interface PeersPinSlots {
    [key: PeerId]: number;
}
interface IPeerHistoryActionProps {
    peerId: PeerId;
    lastActionTime: number;
}
type PeerHistoryNode = IPeerHistoryActionProps;
type PeerHistoryQueue = PeerHistoryNode[];
export interface PeersState {
    count: number;
    peers: Peers;
    recentHistory: PeerHistoryQueue;
}
export const initState: PeersState = {
    count: 0,
    peers: {},
    recentHistory: [],
};
const peersReducer = {
    addPeers: (state: PeersState, action: PayloadAction<Peer[]>) => {
        action.payload.forEach((peer) => {
            state.peers[peer.userId] = peer;
            state.count = state.count + 1;
        });
    },
    addPeer: (state: PeersState, action: PayloadAction<Peer>) => {
        const existPeer = state.peers[action.payload.userId];
        if (!existPeer) state.count = state.count + 1;
        state.peers[action.payload.userId] = { ...existPeer, ...action.payload };
    },
    removePeerByPeerId: (state: PeersState, action: PayloadAction<PeerId>) => {
        const peerDetail = state.peers[action.payload];
        if (!peerDetail) {
            delete state.peers[action.payload];
            state.count = state.count - 1;
        }
    },
};
const peersSlice = createSlice({
    name: 'peers',
    initialState: initState,
    reducers: peersReducer,
});

export const { addPeer, removePeerByPeerId, addPeers } = peersSlice.actions;
export default peersSlice.reducer;
