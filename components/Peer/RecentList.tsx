import { FlatList } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { ListRenderItem } from 'react-native';
import PeerDevice, { PeerDeviceProps } from './PeerDevice';
import { IFilterListData, IHandleFilterProps } from './PeersGroup';
import SectionContainer from './SectionContainer';
import { useAppSelector } from '@/redux/hooks/hooks';
interface RecentListProps {
    peerPeerScreen: number;
    displayScreen: number;
    maxDisplay?: number;
    showSectionTitle?: boolean;
}
type HandleFilterRecentProps = IHandleFilterProps & {};
export const handelFilterHistory = ({ peersState, ...filter }: HandleFilterRecentProps): PeerDeviceProps[] => {
    const filterData: PeerDeviceProps[] = [];
    peersState.recentHistory.forEach((peer) => {
        const existPeer = peersState.peers[peer.peerId];
        if (existPeer !== undefined) {
            let peerDeviceProps: PeerDeviceProps = { peerId: peer.peerId, existPeer: existPeer };
            const pinSlot = existPeer.pinSlot ?? -1;
            if (pinSlot === -1) filterData.push(peerDeviceProps);
            else filterData.push({ ...peerDeviceProps, isSetPin: true });
        }
    });
    return filterData;
};
const RecentList: React.FC<RecentListProps> = ({ ...props }) => {
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const peersData = useAppSelector((state) => state.peers);
    const [recentData, setRecentData] = useState<IFilterListData>({ data: [], length: 0 });

    const filterRenderItem: ListRenderItem<PeerDeviceProps> = useCallback(
        ({ item }) => {
            return <PeerDevice {...item} width={props.displayScreen / props.peerPeerScreen} />;
        },
        [props.peerPeerScreen, props.displayScreen],
    );
    useEffect(() => {
        const filterData: PeerDeviceProps[] = handelFilterHistory({ peersState: peersData, max: props.maxDisplay });

        setRecentData({
            data: filterData,
            length: filterData.length,
        });
    }, [peersData]);
    return (
        <>
            {recentData.length !== 0 && (
                <SectionContainer showTitle={props.showSectionTitle} sectionTitle="Recent">
                    <FlatList
                        horizontal
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={{ alignSelf: 'flex-start', columnGap: 20 }}
                        data={recentData.data}
                        renderItem={filterRenderItem}
                        keyExtractor={(item) => item.peerId}
                    />
                </SectionContainer>
            )}
        </>
    );
};

export default RecentList;
