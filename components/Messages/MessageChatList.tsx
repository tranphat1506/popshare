import { IMessageDetail } from '@/redux/chatRoom/messages.interface';
import React, { useCallback } from 'react';
import { Dimensions, FlatList, ListRenderItem, View, ViewProps, ViewStyle } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useAppSelector } from '@/redux/hooks/hooks';
import PopshareAvatar from '../common/PopshareAvatar';
import { ChatRoom } from '@/redux/chatRoom/reducer';
import { IMemberDetail } from '@/redux/chatRoom/room.interface';
import { EmojiKey } from '../common/EmojiPicker';
import { Peers } from '@/redux/peers/reducer';
const width = Dimensions.get('window').width;
interface MessageChatListProps {
    room: ChatRoom;
}

const isConsecutiveMessageCheck = (
    message: IMessageDetail,
    currentIndex: number,
    messages: (IMessageDetail | undefined)[],
): { prev: boolean; next: boolean } => {
    let timeDiffFromPrev;
    let timeDiffFromNext;
    const currentMessage = message;
    const previousMessage = messages[currentIndex - 1];
    const nextMessage = messages[currentIndex + 1];
    if (!previousMessage && !nextMessage) return { prev: false, next: false };
    if (previousMessage && !nextMessage) {
        // Current message is last message
        timeDiffFromPrev = currentMessage.createdAt - previousMessage.createdAt;
        return {
            next: false,
            prev: timeDiffFromPrev <= 2 * 60 * 1000 && previousMessage.senderId === currentMessage.senderId,
        };
    } else if (!previousMessage && nextMessage) {
        timeDiffFromNext = currentMessage.createdAt - nextMessage!.createdAt;
        return {
            prev: false,
            next: timeDiffFromNext <= 2 * 60 * 1000 && nextMessage.senderId === currentMessage.senderId,
        };
    } else {
        timeDiffFromPrev = currentMessage.createdAt - previousMessage!.createdAt;
        timeDiffFromNext = currentMessage.createdAt - nextMessage!.createdAt;
        return {
            prev: timeDiffFromPrev <= 2 * 60 * 1000 && previousMessage!.senderId === currentMessage.senderId,
            next: timeDiffFromNext <= 2 * 60 * 1000 && nextMessage!.senderId === currentMessage.senderId,
        };
    }
};

const getSeenByUsers = (message: IMessageDetail, currentIndex: number, messages: IMessageDetail[], members: Peers) => {
    try {
        const currentSeenList = message.seenBy.filter((userId) => userId !== message.senderId);
        const nextMessage = messages[currentIndex + 1];
        if (!nextMessage)
            return currentSeenList.map((id) => {
                return members[id];
            });
        const nextSeenList = nextMessage.seenBy.filter((userId) => userId !== message.senderId);
        const currentSet = new Set(currentSeenList);
        if (currentSet.size === 0) return [];
        const nextSet = new Set(nextSeenList);
        const seenList = [...currentSet.difference(nextSet)];
        return seenList.map((id) => {
            return members[id];
        });
    } catch (error) {
        console.log(error);
        return [];
    }
};

const borderStyleChatMessage = (isCurrentUser: boolean, state: { prev: boolean; next: boolean }): ViewStyle => {
    if (isCurrentUser) {
        const topLeft = () => {
            if (!state.prev) return 15;
            if (state.prev) return 5;
        };
        const bottomLeft = () => {
            return 5;
        };
        const topRight = () => {
            if (state.prev) return 5;
            return 15;
        };
        const bottomRight = () => {
            if (state.next) return 5;
            return 1;
        };
        return {
            borderTopLeftRadius: topLeft(),
            borderBottomLeftRadius: bottomLeft(),
            borderTopRightRadius: topRight(),
            borderBottomRightRadius: bottomRight(),
        };
    } else {
        return {};
    }
};

const MessageChatList: React.FC<MessageChatListProps> = ({ room }) => {
    const currentUser = useAppSelector((state) => state.auth.user);
    const peers = useAppSelector((state) => state.peers.peers);
    const RenderMessageItem: ListRenderItem<IMessageDetail> = useCallback(({ item: message, index }) => {
        const userData = message.senderId === currentUser?.userId ? undefined : peers[message.senderId];
        const isConsecutiveMessage = isConsecutiveMessageCheck(message, index, room.messages);
        console.log(isConsecutiveMessage);

        const seenByUsers = getSeenByUsers(message, index, room.messages, peers);
        const borderStyle = borderStyleChatMessage(!userData, isConsecutiveMessage);
        return (
            <>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        columnGap: 10,
                        alignItems: 'flex-start',
                        marginBottom: isConsecutiveMessage.next ? 3 : 15,
                        justifyContent: userData ? 'flex-start' : 'flex-end',
                    }}
                >
                    {userData && isConsecutiveMessage.next === false && (
                        <PopshareAvatar
                            size={48}
                            profilePicture={userData.profilePicture}
                            avatarColor={userData.avatarColor}
                            avatarEmoji={userData.avatarEmoji as EmojiKey}
                        />
                    )}
                    <ThemedView
                        lightColor={'#4f4f4f'}
                        darkColor={'#444'}
                        style={{
                            ...borderStyle,
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            maxWidth: Math.round(width * (5 / 6)),
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {message.messageType === 'text' && (
                            <ThemedText style={{ fontSize: 16, lineHeight: 20 }}>{message.content}</ThemedText>
                        )}
                    </ThemedView>
                    {!userData && (
                        <View className="flex flex-row gap-y-1">
                            {seenByUsers.map((member) => {
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
            </>
        );
    }, []);

    return <FlatList data={room.messages} renderItem={RenderMessageItem} keyExtractor={(item) => item._id} />;
};

export default MessageChatList;
