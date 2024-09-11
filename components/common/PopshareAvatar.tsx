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
    }
> = ({ size = 128, ...props }) => {
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
                        width: size * 0.7,
                        height: size * 0.7,
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
                        bottom: -5,
                        right: -5,
                        padding: 3,
                        borderRadius: 100,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: props.onlineState?.isOnline ? '#22c55e' : '#737373',
                            minWidth: size * 0.25,
                            height: size * 0.25,
                            borderRadius: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {props.onlineState && (
                            <Text
                                style={{
                                    fontSize: size * 0.2,
                                    paddingHorizontal: 4,
                                    fontFamily: 'System-Regular',
                                    color: '#fff',
                                }}
                            >
                                {!props.onlineState?.isOnline ??
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
