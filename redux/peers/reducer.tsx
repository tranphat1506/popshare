import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PeerId = string;
interface IOnlineState {
    lastOnline: number;
    isOnline: boolean;
}
export interface IUserPublicDetail {
    _id: string;
    username: string;
    avatarEmoji: string;
    displayName: string;
    profilePicture?: string;
    avatarColor: string;
    createdAt: Date;
}
export type Peer = {
    id: PeerId;
    userBgColorCode: string;
    username: string;
    displayName: string;
    suffixName: string;
    avatar: string;
    onlineState?: IOnlineState;
    uriAvatar?: string;
    pinSlot?: number;
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
            state.peers[peer.id] = peer;
            state.count = state.count + 1;
        });
    },
    addPeer: (state: PeersState, action: PayloadAction<Peer>) => {
        const existPeer = state.peers[action.payload.id];
        if (!existPeer) state.count = state.count + 1;
        state.peers[action.payload.id] = { ...existPeer, ...action.payload };
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
