import { Avatar, Flex } from 'native-base';
import React, { memo, useLayoutEffect, useState } from 'react';
import { DimensionValue, Pressable, StyleProp, useColorScheme, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { SIZES } from '@/constants/Sizes';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { Peer } from '@/redux/peers/reducer';
import { getAllFirstLetterOfString, stringToColorCode } from '@/helpers/string';
import { FetchUserAvatarByUrl } from '@/helpers/fetching';
export type PeerDeviceProps = {
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>;
    className?: string;
    delay?: number;
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
                className={''.concat('flex justify-center items-center', className)}
            >
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
                            backgroundColor: stringToColorCode(USERNAME_FOR_BROKEN_AVATAR),
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
                        darkColor={BLUE_MAIN_COLOR}
                        lightColor={'#333'}
                    >
                        {props.username}
                    </ThemedText>
                    {/* <View className="w-1 h-1 bg-[#555] mx-1 dark:bg-white rounded-full" /> */}
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
                        {props.deviceName}
                    </ThemedText>
                </Flex>
            </View>
        </MotiView>
    );
};

export default memo(PeerDevice);
