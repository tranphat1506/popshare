import { useAppSelector } from '@/redux/hooks/hooks';
import { addPeer, Peer } from '@/redux/peers/reducer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import PeerDevice from './PeerDevice';
import { useDispatch } from 'react-redux';
import { genRandomPeer } from '@/helpers/FakeDevices';
import { SIZES } from '@/constants/Sizes';
import { ThemedText } from '../ThemedText';
import { Link } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const PADDING_DISPLAY_SCREEN = 15;
const DISPLAY_SCREEN = width - PADDING_DISPLAY_SCREEN * 2;
const MAX_PEER_DISPLAY = 10;
type PeersGroupProps = {};
const PeersGroup: React.FC<PeersGroupProps> = (props) => {
    const peersData = useAppSelector((state) => state.peers);
    const dispatch = useDispatch();
    const Friends = useMemo(() => {
        const filterFriends: Peer[] = [];
        peersData.peers.forEach((peer) => {
            // check if is friends and filter with position
            if (peersData.friends[peer.id] !== undefined) filterFriends[peersData.friends[peer.id]] = peer;
        });
        const countFriend = filterFriends.length;
        return {
            friendsData: filterFriends.slice(0, MAX_PEER_DISPLAY),
            totalFriends: countFriend,
        };
    }, []);
    const OtherPeers = useMemo(() => {
        const filterOtherPeers: Peer[] = [];
        peersData.peers.forEach((peer) => {
            // check if is not friends and push to array
            if (peersData.friends[peer.id] == undefined) filterOtherPeers.push(peer);
        });
        const countOtherDevices = filterOtherPeers.length;
        return {
            otherPeersData: filterOtherPeers.slice(0, MAX_PEER_DISPLAY),
            totalOtherPeers: countOtherDevices,
        };
    }, [peersData]);
    const [totalPeer] = useState<number>(4);

    const filterRenderItem: ListRenderItem<Peer> = useCallback(({ item }) => {
        return <PeerDevice {...item} width={DISPLAY_SCREEN / totalPeer} />;
    }, []);
    useEffect(() => {
        const id = setInterval(() => {
            dispatch(addPeer(genRandomPeer()));
        }, 3000);

        return () => {
            clearInterval(id);
        };
    }, []);
    return (
        <ScrollView className="flex flex-col">
            {/* Friends */}
            <View
                style={{
                    marginHorizontal: PADDING_DISPLAY_SCREEN,
                    paddingBottom: 20,
                }}
            >
                <View
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <ThemedText
                        type="title"
                        style={{
                            fontFamily: 'System-Bold',
                            fontSize: 26,
                            lineHeight: 28,
                            textTransform: 'capitalize',
                        }}
                    >
                        Friends
                    </ThemedText>
                    <Link to={{ screen: 'devices', params: {} }}>
                        <ThemedText
                            type="default"
                            style={{
                                fontFamily: 'System-Regular',
                                fontSize: 13,
                            }}
                            lightColor="#6e6e6e"
                        >
                            More ({Friends.totalFriends})
                        </ThemedText>
                    </Link>
                </View>
                <FlatList
                    key={totalPeer}
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
                    numColumns={totalPeer}
                    data={Friends.friendsData}
                    renderItem={filterRenderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
            {/* Other devices */}
            <View
                style={{
                    marginHorizontal: PADDING_DISPLAY_SCREEN,
                    paddingBottom: 20,
                }}
            >
                <View
                    style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <ThemedText
                        type="title"
                        style={{
                            fontFamily: 'System-Bold',
                            fontSize: 26,
                            lineHeight: 28,
                            textTransform: 'capitalize',
                        }}
                    >
                        Other Devices
                    </ThemedText>
                    <Link to={{ screen: 'devices', params: {} }}>
                        <ThemedText
                            type="default"
                            style={{
                                fontFamily: 'System-Regular',
                                fontSize: 13,
                            }}
                            lightColor="#6e6e6e"
                        >
                            More ({OtherPeers.totalOtherPeers})
                        </ThemedText>
                    </Link>
                </View>
                <FlatList
                    key={totalPeer}
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
                    numColumns={totalPeer}
                    data={OtherPeers.otherPeersData}
                    renderItem={filterRenderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </ScrollView>
    );
};

export default PeersGroup;
