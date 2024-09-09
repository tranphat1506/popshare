import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { Emoji } from '@/constants/EmojiConstants';
import { Skeleton } from 'native-base';
import { Image, View } from 'react-native';

const PopshareAvatar: React.FC<
    IAvatarState & {
        size?: number;
        children?: React.ReactNode;
        skeleton?: boolean;
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
            />
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
            {!props.profilePicture && !props.avatarEmoji && props.children}
        </View>
    );
};

export default PopshareAvatar;
