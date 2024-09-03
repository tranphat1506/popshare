import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { Emoji } from '@/constants/EmojiConstants';
import { Image, View } from 'react-native';

const PopshareAvatar: React.FC<
    IAvatarState & {
        size?: number;
        children?: React.ReactNode;
    }
> = ({ size = 128, ...props }) => {
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
            {!props.profilePicture && (
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

            {props.children}
        </View>
    );
};

export default PopshareAvatar;
