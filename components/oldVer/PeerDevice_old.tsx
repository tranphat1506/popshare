import { Avatar, Flex, Icon, Skeleton } from 'native-base';
import React, { memo, useLayoutEffect, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { SIZES } from '@/constants/Sizes';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Peer } from '@/redux/peers/reducer';
import { getAllFirstLetterOfString, StringOnlineStateHelper, stringToColorCode } from '@/helpers/string';
import { FetchUserAvatarByUrl } from '@/helpers/fetching';
import { AntDesign } from '@expo/vector-icons';
import { ThemedView } from '../ThemedView';
export type PeerDeviceProps = {
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>;
    className?: string;
    delay?: number;
    isSetPin?: boolean;
} & Peer;
const PeerDevice: React.FC<PeerDeviceProps> = ({
    style,
    className = '',
    delay = 0,
    width = SIZES.PEER_DEVICE_WIDTH,
    height = SIZES.PEER_DEVICE_HEIGHT,
    ...props
}) => {
    const [uriAvatar, setUriAvatar] = useState<string | undefined>(undefined);
    const userBgColorCode = stringToColorCode(props.id);
    useLayoutEffect(() => {
        const r = FetchUserAvatarByUrl(props.avatar);
        r.then((uri) => {
            setUriAvatar(uri);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    const USERNAME_FOR_BROKEN_AVATAR = getAllFirstLetterOfString(props.username);
    return (
        <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                type: 'timing',
                duration: 300,
                delay: 50 * delay,
                easing: Easing.linear,
            }}
        >
            <View
                style={[style, { flexBasis: width, paddingVertical: 5 }]}
                className={''.concat('flex justify-center items-center relative', className)}
            >
                {props.isSetPin && (
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
                        <Icon size={4} color={userBgColorCode ?? 'yellow.400'} name="pushpin" as={AntDesign} />
                    </View>
                )}
                <Pressable
                    onPress={() => {
                        console.log(props.id);
                    }}
                    onLongPress={() => {
                        console.log('Show detail', props.id);
                    }}
                >
                    <Avatar
                        source={{ uri: uriAvatar }}
                        style={{
                            backgroundColor: userBgColorCode,
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
                            {USERNAME_FOR_BROKEN_AVATAR}
                        </ThemedText>
                    </Avatar>
                    {props.onlineState && (
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
                                    backgroundColor: props.onlineState.isOnline ? '#22c55e' : '#737373',
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
                                    {StringOnlineStateHelper.toLastOnlineTime(props.onlineState.lastOnline)}
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
                        {props.displayName}
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
                        @{props.username}
                    </ThemedText>
                </Flex>
            </View>
        </MotiView>
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

export default memo(PeerDevice);
