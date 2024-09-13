import { StringOnlineStateHelper } from '@/helpers/string';
import useLanguage from '@/languages/hooks/useLanguage';
import { IMessageDetail } from '@/redux/chatRoom/messages.interface';
import React, { useMemo, useState } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { ThemedText } from '../ThemedText';
import PopshareAvatar from '../common/PopshareAvatar';
import { EmojiKey } from '../common/EmojiPicker';
import { ThemedView } from '../ThemedView';
import { Peer } from '@/redux/peers/reducer';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import ReactionItem, { ReactionItemProps } from './ReactionItem';
const width = Dimensions.get('window').width;

interface MessageChatItemProps {
    message: IMessageDetail;
    isConsecutiveMessage: { prev: boolean; next: boolean };
    userData?: Peer;
    borderStyle: ViewStyle;
    seensList: (Peer | undefined)[];
    reactionList: ReactionItemProps[];
}

const MessageChatItem: React.FC<MessageChatItemProps> = ({
    message,
    isConsecutiveMessage,
    userData,
    borderStyle,
    seensList,
    reactionList,
}) => {
    const formatMessageCreatedAt = StringOnlineStateHelper.formatDate(message.createdAt);
    const language = useLanguage();
    const textData = useMemo(() => {
        return {
            TODAY_TEXT: language.TODAY_TEXT,
        };
    }, []);
    const LIGHT_MESSAGE_TEXT_THEMED = '#ffffffa4';
    const DARK_MESSAGE_TEXT_THEMED = '#1e1e1ea4';

    const [seensMessage, setSeens] = useState(seensList);
    const [reactionsMessage, setReactions] = useState(reactionList);

    return (
        <>
            {!isConsecutiveMessage.prev && (
                <View
                    style={{
                        marginBottom: 5,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ThemedView
                        lightColor={LIGHT_MESSAGE_TEXT_THEMED}
                        darkColor={DARK_MESSAGE_TEXT_THEMED}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 3,
                            borderRadius: 10,
                        }}
                    >
                        <ThemedText
                            lightColor={BLUE_MAIN_COLOR}
                            darkColor="#fff"
                            style={{
                                lineHeight: 20,
                                fontSize: 15,
                                fontFamily: 'System-Medium',
                            }}
                        >
                            {formatMessageCreatedAt.dateString ?? formatMessageCreatedAt.timeString}
                        </ThemedText>
                    </ThemedView>
                </View>
            )}
            <View
                style={{
                    justifyContent: userData ? 'flex-start' : 'flex-end',
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        columnGap: 10,
                        alignItems: 'flex-end',
                        paddingBottom: isConsecutiveMessage.next ? 2 : 10,
                        maxWidth: '75%',
                        // borderWidth: 1,
                        // borderColor: '#f4f',
                    }}
                >
                    <View>
                        {userData && isConsecutiveMessage.next === false && (
                            <PopshareAvatar
                                size={38}
                                profilePicture={userData.profilePicture}
                                avatarColor={userData.avatarColor}
                                avatarEmoji={userData.avatarEmoji as EmojiKey}
                            />
                        )}
                        {userData && isConsecutiveMessage.next && <View style={{ width: 38, height: 1 }}></View>}
                    </View>
                    <View
                        style={{
                            flexDirection: userData ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            // borderWidth: 1,
                            // borderColor: '#f4f',
                        }}
                    >
                        <ThemedView
                            lightColor={LIGHT_MESSAGE_TEXT_THEMED}
                            darkColor={DARK_MESSAGE_TEXT_THEMED}
                            style={{
                                ...borderStyle,
                                paddingHorizontal: 15,
                                paddingTop: 10,
                                paddingBottom: 5,
                                rowGap: 10,
                            }}
                        >
                            <View>
                                {message.messageType === 'text' && (
                                    <ThemedText
                                        style={{ fontSize: 17, lineHeight: 20 }}
                                    >{`${message.content}`}</ThemedText>
                                )}
                            </View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between',
                                    columnGap: 10,
                                    alignItems: 'flex-end',
                                    flex: 2,
                                    // borderWidth: 1,
                                    // borderColor: '#000',
                                }}
                            >
                                <ThemedText
                                    darkColor="#999"
                                    lightColor="#888"
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 14,
                                        textAlign: 'right',
                                        marginTop: 5,
                                    }}
                                >
                                    {formatMessageCreatedAt.timeString}
                                </ThemedText>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        columnGap: 5,
                                        rowGap: 5,
                                        maxWidth: '80%',
                                        // borderWidth: 1,
                                        // borderColor: '#fff',
                                    }}
                                >
                                    {reactionsMessage.map((reaction) => {
                                        return <ReactionItem style={{ flex: 1 }} {...reaction} />;
                                    })}
                                </View>
                            </View>
                        </ThemedView>
                        {/* Small arrow */}
                        {/* <ThemedView
                            lightColor={LIGHT_MESSAGE_TEXT_THEMED}
                            darkColor={DARK_MESSAGE_TEXT_THEMED}
                            style={{
                                width: 10,
                                height: 10,
                                borderBottomLeftRadius: 100,
                                right: !userData ? -1 : undefined,
                                left: userData ? -1 : undefined,
                                bottom: -2,
                                transform: [{ rotate: userData ? '-55deg' : '-35deg' }],
                                opacity: !isConsecutiveMessage.next ? 1 : 0,
                                position: 'absolute',
                                zIndex: 10,
                            }}
                        /> */}
                    </View>
                    {/* Seen list */}
                    {!userData && (
                        <View className="flex flex-row gap-y-1">
                            {seensMessage.map((member) => {
                                if (!member) return <></>;
                                return (
                                    <PopshareAvatar
                                        profilePicture={member.profilePicture}
                                        avatarColor={member.avatarColor}
                                        avatarEmoji={member.avatarEmoji as EmojiKey}
                                    />
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

export default MessageChatItem;
