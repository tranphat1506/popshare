import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { Emoji } from '@/constants/EmojiConstants';
import { IReaction } from '@/redux/chatRoom/messages.interface';
import React, { useState } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { EmojiKey } from '../common/EmojiPicker';
import PopshareAvatar from '../common/PopshareAvatar';
import { ThemedText } from '../ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedView } from '../ThemedView';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';

export interface ReactionItemProps {
    isAlreadyReaction: boolean;
    userAvatarState: IAvatarState;
    reactionData: {
        list: ReactionUI[];
        emoji: EmojiKey;
    };
    themedColor?: string;
    size?: number;
    style?: ViewStyle;
}
export type ReactionUI = IReaction & IAvatarState;
const ReactionItem: React.FC<ReactionItemProps> = ({ size = 22, themedColor = BLUE_MAIN_COLOR, ...props }) => {
    const [isReaction, setReaction] = useState<boolean>(props.isAlreadyReaction);
    const [totalReaction, setTotalReaction] = useState<number>(props.reactionData.list.length);
    const handleReaction = () => {
        if (isReaction) {
            setTotalReaction((total) => total - 1);
        } else {
            setTotalReaction((total) => total + 1);
        }
        setReaction(!isReaction);
    };
    return (
        <>
            {!!totalReaction && (
                <TouchableOpacity activeOpacity={0.8} onPress={handleReaction}>
                    <ThemedView
                        lightColor={isReaction ? themedColor : `${themedColor}6f`}
                        darkColor={isReaction ? themedColor : `${themedColor}8f`}
                        style={[
                            {
                                display: 'flex',
                                flexDirection: 'row',
                                columnGap: 5,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 999,
                            },
                            props.style,
                        ]}
                    >
                        <Image
                            style={{
                                borderRadius: 10,
                                width: Math.round(size),
                                height: Math.round(size),
                            }}
                            source={Emoji[props.reactionData.emoji]}
                            key={props.reactionData.emoji}
                        />
                        <View>
                            <ThemedText lightColor="#fff" style={{ lineHeight: 18, fontSize: 14 }}>
                                {totalReaction}
                            </ThemedText>
                        </View>
                        {isReaction && <PopshareAvatar {...props.userAvatarState} size={size} />}
                    </ThemedView>
                </TouchableOpacity>
            )}
        </>
    );
};

export default ReactionItem;
