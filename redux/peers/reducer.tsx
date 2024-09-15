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
    [key: PeerId]: Peer | undefined;
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
    addPeers: (state: PeersState, action: PayloadAction<Peers>) => {
        Object.keys(action.payload).forEach((peerId) => {
            const peer = action.payload[peerId];
            state.peers[peerId] = peer;
        });
        state.count = Object.keys(state.peers).length;
    },
    addPeer: (state: PeersState, action: PayloadAction<Peer>) => {
        state.peers[action.payload.userId] = action.payload;
        state.count = Object.keys(state.peers).length;
    },
    removePeerByPeerId: (state: PeersState, action: PayloadAction<PeerId>) => {
        const peerDetail = state.peers[action.payload];
        if (!peerDetail) {
            delete state.peers[action.payload];
        }
        state.count = Object.keys(state.peers).length;
    },
    clear: (state: PeersState) => {
        state.count = 0;
        state.peers = {};
        state.recentHistory = [];
    },
    updatePeerById: <T extends keyof Peer>(
        state: PeersState,
        action: PayloadAction<{ userId: string; field: T; data: Peer[T] }>,
    ) => {
        const peer = state.peers[action.payload.userId];
        if (!peer) return;
        state.peers[action.payload.userId] = {
            ...peer,
            [action.payload.field]: action.payload.data,
        };
    },
};
const peersSlice = createSlice({
    name: 'peers',
    initialState: initState,
    reducers: peersReducer,
});

export const { addPeer, removePeerByPeerId, addPeers, clear, updatePeerById } = peersSlice.actions;
export default peersSlice.reducer;
