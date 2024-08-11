import { Avatar, Flex, Icon, Skeleton } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { SIZES } from '@/constants/Sizes';
import { MotiView } from 'moti';
import { addPeer, Peer } from '@/redux/peers/reducer';
import { getAllFirstLetterOfString, StringOnlineStateHelper, stringToColorCode } from '@/helpers/string';
import { FetchUserAvatarByUrl, FetchUserProfileById } from '@/helpers/fetching';
import { AntDesign } from '@expo/vector-icons';
import { ThemedView } from '../ThemedView';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { genRandomPeer, getRandomImageUrl } from '@/helpers/FakeDevices';
export type PeerDeviceProps = {
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>;
    className?: string;
    isSetPin?: boolean;
    peerId: string;
    existPeer?: Peer;
};

const PeerDevice: React.FC<PeerDeviceProps> = ({
    style,
    className = '',
    width = SIZES.PEER_DEVICE_WIDTH,
    height = SIZES.PEER_DEVICE_HEIGHT,
    isSetPin = false,
    peerId,
    existPeer,
}) => {
    const dispatch = useAppDispatch();
    const [peerProfile, setPeerProfile] = useState<Peer | undefined>(existPeer);
    // Fetch peer profile
    useEffect(() => {
        // console.log(existPeer?.displayName);
        if (!peerProfile)
            FetchUserProfileById('3')
                .then(async ({ isError, payload }) => {
                    if (!isError) {
                        const avatar = getRandomImageUrl();
                        const uriAvt = await FetchUserAvatarByUrl(avatar);
                        const peer: Peer = {
                            id: peerId,
                            username: payload.username,
                            avatar: avatar,
                            displayName: payload.fullName,
                            uriAvatar: uriAvt,
                            userBgColorCode: stringToColorCode(peerId),
                            suffixName: getAllFirstLetterOfString(payload.fullName),
                            onlineState: {
                                lastOnline: Date.now(),
                                isOnline: true,
                            },
                        };
                        dispatch(addPeer(peer));
                        setPeerProfile(peer);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        else if (!peerProfile.uriAvatar) {
            FetchUserAvatarByUrl(peerProfile.avatar)
                .then((uri) => {
                    const peer: Peer = { ...peerProfile, uriAvatar: uri };
                    dispatch(addPeer(peer));
                    setPeerProfile(peer);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else setPeerProfile(existPeer);
    }, []);
    return (
        <View>
            <View
                style={[style, { flexBasis: width, paddingVertical: 5 }]}
                className={''.concat('flex justify-center items-center relative', className)}
            >
                {peerProfile === undefined ? (
                    <>
                        <Skeleton w={'48px'} h={'48px'} rounded={'full'}></Skeleton>
                        <Flex direction="column" justifyContent={'center'} alignItems={'center'} paddingTop={1}>
                            <Skeleton h={'12px'} w={width - 20} paddingY={'1.5px'} rounded={'lg'} />
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: width - 10,
                                }}
                            >
                                <ThemedText
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{
                                        fontFamily: 'System-Regular',
                                        fontSize: 12,
                                        lineHeight: 12,
                                        paddingRight: 2,
                                    }}
                                    darkColor={'#999'}
                                    lightColor={'#777'}
                                >
                                    @
                                </ThemedText>
                                <Skeleton h={'10px'} w={'2/3'} paddingY={'1px'} rounded={'lg'} />
                            </View>
                        </Flex>
                    </>
                ) : (
                    <>
                        {isSetPin && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    // borderWidth: 1,
                                    // borderColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon
                                    size={4}
                                    color={peerProfile.userBgColorCode ?? 'yellow.400'}
                                    name="pushpin"
                                    as={AntDesign}
                                />
                            </View>
                        )}
                        <Pressable
                            onPress={() => {
                                dispatch(addPeer(genRandomPeer()));
                            }}
                            onLongPress={() => {
                                console.log('Show detail', peerProfile.id);
                            }}
                        >
                            <Avatar
                                source={{ uri: peerProfile.uriAvatar }}
                                style={{
                                    backgroundColor: peerProfile.userBgColorCode,
                                }}
                            >
                                <ThemedText
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                    }}
                                    lightColor="#fff"
                                    darkColor="#fff"
                                >
                                    {peerProfile.suffixName}
                                </ThemedText>
                            </Avatar>
                            {peerProfile.onlineState && (
                                <ThemedView
                                    style={{
                                        position: 'absolute',
                                        bottom: -5,
                                        right: -5,
                                        padding: 3,
                                        borderRadius: 100,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: peerProfile.onlineState.isOnline ? '#22c55e' : '#737373',
                                            minWidth: 15,
                                            height: 15,
                                            borderRadius: 100,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                paddingHorizontal: 4,
                                                fontFamily: 'System-Regular',
                                                color: '#fff',
                                            }}
                                        >
                                            {peerProfile.onlineState.isOnline ??
                                                StringOnlineStateHelper.toLastOnlineTime(
                                                    peerProfile.onlineState.lastOnline,
                                                )}
                                        </Text>
                                    </View>
                                </ThemedView>
                            )}
                        </Pressable>
                        <Flex direction="column" justifyContent={'center'} alignItems={'center'} paddingTop={1}>
                            <ThemedText
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: 'System-Medium',
                                    fontSize: 12,
                                    textAlign: 'center',
                                    lineHeight: 15,
                                    width: width - 10,
                                }}
                                darkColor={'#fff'}
                                lightColor={'#333'}
                            >
                                {peerProfile.displayName}
                            </ThemedText>
                            <ThemedText
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    fontFamily: 'System-Regular',
                                    fontSize: 10,
                                    lineHeight: 12,
                                    textAlign: 'center',
                                    textTransform: 'capitalize',
                                    width: width - 10,
                                }}
                                darkColor={'#999'}
                                lightColor={'#777'}
                            >
                                @{peerProfile.username}
                            </ThemedText>
                        </Flex>
                    </>
                )}
            </View>
        </View>
    );
};

export const PeerDeviceSkeleton: React.FC<{
    width?: number;
    style?: StyleProp<ViewStyle>;
    className?: string;
}> = ({ style, className = '', width = SIZES.PEER_DEVICE_WIDTH }) => {
    return (
        <MotiView>
            <View
                style={[style, { flexBasis: width, paddingVertical: 5 }]}
                className={''.concat('flex justify-center items-center relative', className)}
            >
                <Skeleton w={'48px'} h={'48px'} rounded={'full'}></Skeleton>
                <Flex direction="column" justifyContent={'center'} alignItems={'center'} paddingTop={1}>
                    <Skeleton h={'12px'} w={width - 20} paddingY={'1.5px'} rounded={'lg'} />
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: width - 10,
                        }}
                    >
                        <ThemedText
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                                fontFamily: 'System-Regular',
                                fontSize: 12,
                                lineHeight: 12,
                                paddingRight: 2,
                            }}
                            darkColor={'#999'}
                            lightColor={'#777'}
                        >
                            @
                        </ThemedText>
                        <Skeleton h={'10px'} w={'2/3'} paddingY={'1px'} rounded={'lg'} />
                    </View>
                </Flex>
            </View>
        </MotiView>
    );
};

export default memo(PeerDevice, (prevState, nextState) => {
    return prevState.peerId === nextState.peerId;
});
