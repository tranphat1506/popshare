import { Flex, Icon, Skeleton } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { SIZES } from '@/constants/Sizes';
import { MotiView } from 'moti';
import { addPeer, Peer } from '@/redux/peers/reducer';
import { getAllFirstLetterOfString } from '@/helpers/string';
import { FetchUserAvatarByUrl, FetchUserProfileById } from '@/helpers/fetching';
import { AntDesign } from '@expo/vector-icons';
import { useAppDispatch } from '@/redux/hooks/hooks';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { LoginSessionManager } from '@/storage/loginSession.storage';
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

    const handleFetchingPeer = async () => {
        try {
            const session = await LoginSessionManager.getCurrentSession();
            if (!peerProfile) {
                const data = await FetchUserProfileById(peerId, { token: session?.token, rtoken: session?.rtoken });
                if (!data) throw Error('Cannot Fetching');
                const uriData = data.user.profilePicture
                    ? await FetchUserAvatarByUrl(data.user.profilePicture)
                    : undefined;
                const peer: Peer = {
                    ...data.user,
                    uriAvatar: uriData,
                    suffixName: getAllFirstLetterOfString(data.user.displayName),
                };
                dispatch(addPeer(peer));
                setPeerProfile(peer);
            } else if (!peerProfile.uriAvatar) {
                const uriData = peerProfile.profilePicture
                    ? await FetchUserAvatarByUrl(peerProfile.profilePicture)
                    : undefined;
                const peer: Peer = { ...peerProfile, uriAvatar: uriData };
                dispatch(addPeer(peer));
                setPeerProfile(peer);
            } else setPeerProfile(existPeer);
        } catch (error) {
            console.error(error);
        }
    };
    // Fetch peer profile
    useEffect(() => {
        handleFetchingPeer();
    }, [dispatch]);
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
                                    color={peerProfile.avatarColor ?? 'yellow.400'}
                                    name="pushpin"
                                    as={AntDesign}
                                />
                            </View>
                        )}
                        <Pressable
                            onLongPress={() => {
                                console.log('Show detail', peerProfile.userId);
                            }}
                        >
                            <PopshareAvatar
                                avatarColor={peerProfile.avatarColor}
                                avatarEmoji={peerProfile.avatarEmoji as EmojiKey}
                                profilePicture={peerProfile.profilePicture}
                                size={48}
                                displayOnlineState={true}
                                onlineState={peerProfile.onlineState}
                            />
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
