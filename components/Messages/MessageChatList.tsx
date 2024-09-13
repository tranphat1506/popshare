import { IMessageDetail, IReaction } from '@/redux/chatRoom/messages.interface';
import React, { LegacyRef, RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Dimensions, FlatList, ListRenderItem, View, ViewProps, ViewStyle } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useAppSelector } from '@/redux/hooks/hooks';
import PopshareAvatar from '../common/PopshareAvatar';
import { ChatRoom } from '@/redux/chatRoom/reducer';
import { IMemberDetail } from '@/redux/chatRoom/room.interface';
import { EmojiKey } from '../common/EmojiPicker';
import { Peers } from '@/redux/peers/reducer';
import { StringOnlineStateHelper } from '@/helpers/string';
import useLanguage from '@/languages/hooks/useLanguage';
import MessageChatItem from './MessageChatItem';
import { ReactionItemProps, ReactionUI } from './ReactionItem';
import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
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
        timeDiffFromNext = nextMessage!.createdAt - currentMessage.createdAt;

        return {
            prev: false,
            next: timeDiffFromNext <= 2 * 60 * 1000 && nextMessage.senderId === currentMessage.senderId,
        };
    } else {
        timeDiffFromPrev = currentMessage.createdAt - previousMessage!.createdAt;
        timeDiffFromNext = nextMessage!.createdAt - currentMessage.createdAt;
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
            if (state.next) return 5;
            return 15;
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
        const topLeft = () => {
            if (!state.prev) return 15;
            if (state.prev) return 5;
        };
        const bottomLeft = () => {
            if (state.next) return 5;
            return 1;
        };
        const topRight = () => {
            if (state.prev) return 5;
            return 15;
        };
        const bottomRight = () => {
            if (state.next) return 5;
            return 15;
        };
        return {
            borderTopLeftRadius: topLeft(),
            borderBottomLeftRadius: bottomLeft(),
            borderTopRightRadius: topRight(),
            borderBottomRightRadius: bottomRight(),
        };
    }
};

const generateReaction = (
    reactions: IReaction[],
    peers: Peers,
    currentUser: ICurrentUserDetail,
): ReactionItemProps[] => {
    const reactionsFilter: {
        [emoji: string]: ReactionItemProps | undefined;
    } = {};
    reactions.forEach((reaction) => {
        const user = peers[reaction.senderId];
        if (user) {
            const senderAvatarSate: IAvatarState = {
                avatarColor: user.avatarColor,
                avatarEmoji: user.avatarEmoji as EmojiKey,
                profilePicture: user.profilePicture,
            };
            if (!reactionsFilter[reaction.data]) {
                reactionsFilter[reaction.data] = {
                    isAlreadyReaction: reaction.senderId === currentUser.userId,
                    userAvatarState: {
                        avatarColor: currentUser.avatarColor,
                        avatarEmoji: currentUser.avatarEmoji as EmojiKey,
                        profilePicture: currentUser.profilePicture,
                    },
                    reactionData: {
                        emoji: reaction.data as EmojiKey,
                        list: [{ ...reaction, ...senderAvatarSate }],
                    },
                };
            } else {
                const data = reactionsFilter[reaction.data]!;
                reactionsFilter[reaction.data] = {
                    ...data,
                    isAlreadyReaction: reaction.senderId === currentUser.userId,
                    reactionData: {
                        ...data.reactionData,
                        list: data?.reactionData.list.concat({ ...reaction, ...senderAvatarSate }),
                    },
                };
            }
        }
    });

    return Object.keys(reactionsFilter).map((r) => reactionsFilter[r]!);
};

const MessageChatList: React.FC<MessageChatListProps> = ({ room }) => {
    const currentUser = useAppSelector((state) => state.auth.user);
    const peers = useAppSelector((state) => state.peers.peers);
    const rooms = useAppSelector((state) => state.chatRoom.rooms);
    const roomMessages = rooms[room.detail._id]?.messages ?? room.messages;

    const RenderMessageItem: ListRenderItem<IMessageDetail> = useCallback(({ item: message, index }) => {
        const userData = message.senderId === currentUser?.userId ? undefined : peers[message.senderId];
        const isConsecutiveMessage = isConsecutiveMessageCheck(message, index, room.messages);
        const seenByUsers = getSeenByUsers(message, index, room.messages, peers);
        const borderStyle = borderStyleChatMessage(!userData, isConsecutiveMessage);
        const reactions = generateReaction(message.reactions, peers, currentUser!);
        return (
            <MessageChatItem
                message={message}
                userData={userData}
                isConsecutiveMessage={isConsecutiveMessage}
                seensList={seenByUsers}
                borderStyle={borderStyle}
                reactionList={reactions}
            />
        );
    }, []);

    return (
        <FlatList
            scrollEnabled={false}
            data={roomMessages}
            renderItem={RenderMessageItem}
            keyExtractor={(item) => item._id}
        />
    );
};

export default MessageChatList;
