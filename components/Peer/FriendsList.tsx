import { FlatList } from 'native-base';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ListRenderItem } from 'react-native';
import PeerDevice, { PeerDeviceProps } from './PeerDevice';
import { IFilterListData, IHandleFilterProps } from './PeersGroup';
import SectionContainer from './SectionContainer';
import { useAppSelector } from '@/redux/hooks/hooks';
import { FriendsEmpty } from '@/app/Friends/FriendsEmpty';
import { handelFilterHistory } from './RecentList';
import { Peer } from '@/redux/peers/reducer';
// import { useDispatch } from 'react-redux';
// import { genRandomPeers, genRandomPeersId } from '@/helpers/FakeDevices';
// import { addPeers, PeersPinSlots } from '@/redux/peers/reducer';
interface FriendsListProps {
    peerPeerScreen: number;
    displayScreen: number;
    maxDisplay?: number;
    showSectionTitle?: boolean;
    showOnlyPinned?: boolean;
    showOnlyRecent?: boolean;
}
type HandleFilterDataProps = IHandleFilterProps & {
    searchFilter?: string;
    showOnlyPinned?: boolean;
    showOnlyRecent?: boolean;
};
const handleFilterData = ({ peersState, ...filter }: HandleFilterDataProps): PeerDeviceProps[] => {
    if (filter.showOnlyRecent) return handelFilterHistory({ peersState, ...filter });
    const pinData: PeerDeviceProps[] = [];
    const withoutPinData: PeerDeviceProps[] = [];
    Object.keys(peersState.peers).forEach((id) => {
        const existPeer: Peer | undefined = peersState.peers[id];
        const peerDeviceProps: PeerDeviceProps = { peerId: id, existPeer: existPeer };
        const pinSlot = existPeer?.pinSlot ?? -1;
        if (pinSlot === -1 && !filter.showOnlyPinned) withoutPinData.push(peerDeviceProps);
        else pinData[pinSlot] = { ...peerDeviceProps, isSetPin: true };
    });
    return [...pinData, ...withoutPinData].slice(0, filter.max);
};
const FriendsList: React.FC<FriendsListProps> = ({ ...props }) => {
    const peersData = useAppSelector((state) => state.peers);
    const [friendData, setFriendData] = useState<IFilterListData>({ data: [], length: 0 });
    // const dispatch = useDispatch();
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    // useLayoutEffect(() => {
    //     const dumpFriendPeers = genRandomPeers(10);
    //     dumpFriendPeers.forEach((peer, index) => {
    //         peer.pinSlot = index;
    //     });
    //     // console.log(dumpFriendPeers.map((p) => p.username));
    //     dispatch(addPeers(dumpFriendPeers));
    //     setIsLoading(false);
    // }, []);
    const filterRenderItem: ListRenderItem<PeerDeviceProps> = useCallback(
        ({ item }) => {
            return <PeerDevice {...item} width={props.displayScreen / props.peerPeerScreen} />;
        },
        [props.peerPeerScreen, props.displayScreen],
    );
    useLayoutEffect(() => {
        const filterData: PeerDeviceProps[] = handleFilterData({
            peersState: peersData,
            max: props.maxDisplay,
            showOnlyPinned: props.showOnlyPinned,
            showOnlyRecent: props.showOnlyRecent,
        });
        setFriendData({
            data: filterData,
            length: peersData.count,
        });
    }, [peersData, props.maxDisplay, props.showOnlyPinned, props.showOnlyRecent]);
    if (!friendData.length) return <FriendsEmpty />;
    return (
        <SectionContainer
            showTitle={props.showSectionTitle ?? true}
            sectionTitle="Friends"
            linkProps={{
                to: { screen: 'friends', params: {} },
                title: `See All (${friendData.length})`,
            }}
        >
            <FlatList
                key={props.peerPeerScreen}
                contentContainerStyle={{
                    display: 'flex',
                    width: '100%',
                }}
                scrollEnabled={false}
                columnWrapperStyle={{
                    marginBottom: 10,
                    // justifyContent: 'space-between',
                    columnGap: 10,
                }}
                numColumns={props.peerPeerScreen}
                data={friendData.data}
                renderItem={filterRenderItem}
                keyExtractor={(item) => item.peerId}
            />
        </SectionContainer>
    );
};

export default FriendsList;
