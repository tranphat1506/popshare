import { PeersState } from '@/redux/peers/reducer';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { PeerDeviceProps } from './PeerDevice';
import RecentList from './RecentList';
import FriendsList from './FriendsList';
const { width } = Dimensions.get('window');
const PADDING_DISPLAY_SCREEN = 15;
const DISPLAY_SCREEN = width - PADDING_DISPLAY_SCREEN * 2;
type PeersGroupProps = {
    peerPerScreen: number;
    maxDisplay?: number;
};
export interface IFilterListData {
    data: PeerDeviceProps[];
    length: number;
}
export interface IHandleFilterProps {
    peersState: PeersState;
    max?: number;
}
const PeersGroup: React.FC<PeersGroupProps> = (props) => {
    return (
        <ScrollView className="flex flex-col">
            <RecentList
                peerPeerScreen={props.peerPerScreen}
                maxDisplay={props.maxDisplay}
                displayScreen={DISPLAY_SCREEN}
            />
            {/* Friends */}
            <FriendsList
                peerPeerScreen={props.peerPerScreen}
                maxDisplay={props.maxDisplay}
                displayScreen={DISPLAY_SCREEN}
            />
        </ScrollView>
    );
};

export default PeersGroup;
