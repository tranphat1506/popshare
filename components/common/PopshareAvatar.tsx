import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { Emoji } from '@/constants/EmojiConstants';
import { IOnlineState } from '@/redux/peers/reducer';
import { Skeleton } from 'native-base';
import { Image, Text, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { StringOnlineStateHelper } from '@/helpers/string';

const PopshareAvatar: React.FC<
    IAvatarState & {
        size?: number;
        children?: React.ReactNode;
        skeleton?: boolean;
        onlineState?: IOnlineState;
        displayOnlineState?: boolean;
        hidden?: boolean;
    }
> = ({ size = 128, ...props }) => {
    const isOnline = !!props.onlineState?.lastTimeActive
        ? new Date().getTime() - props.onlineState?.lastTimeActive <= 5 * 60 * 1000
        : false;
    if (props.skeleton) {
        return (
            <Skeleton
                style={{
                    backgroundColor: props.avatarColor,
                    borderRadius: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: size,
                    height: size,
                }}
            >
                {props.children}
            </Skeleton>
        );
    }
    if (props.hidden) {
        return (
            <View
                style={{
                    borderRadius: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: size,
                    height: size,
                }}
            >
                {props.children}
            </View>
        );
    }
    return (
        <View
            style={{
                backgroundColor: props.avatarColor,
                borderRadius: 9999,
                justifyContent: 'center',
                alignItems: 'center',
                width: size,
                height: size,
            }}
        >
            {!props.profilePicture && props.avatarEmoji && (
                <Image
                    style={{
                        borderRadius: 10,
                        width: Math.round(size * 0.7),
                        height: Math.round(size * 0.7),
                    }}
                    source={Emoji[props.avatarEmoji]}
                    key={`${props.avatarEmoji}:${props.avatarColor}`}
                />
            )}
            {props.profilePicture && (
                <Image
                    style={{
                        borderRadius: 10,
                        width: size,
                        height: size,
                    }}
                    source={{ uri: props.profilePicture }}
                    key={props.profilePicture}
                />
            )}
            {props.displayOnlineState && (
                <ThemedView
                    style={{
                        position: 'absolute',
                        bottom: size * 0.01,
                        right: size * 0.01,
                        padding: size * 0.04,
                        borderRadius: 100,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: isOnline ? '#22c55e' : '#737373',
                            minWidth: Math.round(size * 0.25),
                            height: Math.round(size * 0.25),
                            borderRadius: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {props.onlineState && (
                            <Text
                                style={{
                                    fontSize: Math.round(size >= 100 ? size * 0.13 : size * 0.2),
                                    lineHeight: Math.round(size >= 100 ? size * 0.18 : size * 0.25),
                                    paddingHorizontal: 4,
                                    fontFamily: 'System-Regular',
                                    color: '#fff',
                                }}
                            >
                                {Date.now() - props.onlineState.lastTimeActive > 5 * 60 * 1000 &&
                                    StringOnlineStateHelper.toLastOnlineTime(props.onlineState.lastTimeActive)}
                            </Text>
                        )}
                    </View>
                </ThemedView>
            )}
            {props.children}
        </View>
    );
};

export default PopshareAvatar;
