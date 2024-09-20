import { IMessageDetail, IReaction } from '@/redux/chatRoom/messages.interface';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem, ViewStyle } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { ChatRoom, updateChatRoomData } from '@/redux/chatRoom/reducer';
import { EmojiKey } from '../common/EmojiPicker';
import { Peers } from '@/redux/peers/reducer';
import MessageChatItem from './MessageChatItem';
import { ReactionItemProps } from './ReactionItem';
import { IAvatarState } from '@/app/Auth/AvatarSettingModal';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import useOnChatMessage from '@/hooks/socket.io/useOnChatMessage';
import _ from 'lodash';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { UpdateSeenMessage } from '@/helpers/fetching';
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

const getSeenByUsers = (
    message: IMessageDetail,
    currentIndex: number,
    messages: IMessageDetail[],
    members: Peers,
    currentUserId: string,
) => {
    try {
        const currentSeenList = message.seenBy.filter((m) => m !== currentUserId);
        const currentSet = new Set(currentSeenList);
        const nextMessage = messages[currentIndex + 1];
        if (!nextMessage)
            return [...currentSet].map((id) => {
                return members[id];
            });
        const nextSeenList = nextMessage.seenBy.filter((m) => m !== currentUserId);
        if (currentSet.size === 0) return [];
        const nextSet = new Set(nextSeenList);
        const seenList = _.difference([...currentSet], [...nextSet]);
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
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);
    const members = useAppSelector((state) => state.peers.peers);
    const notRead = useAppSelector((state) => state.chatRoom.rooms[room.detail._id]?.notRead);
    const roomDetail = useAppSelector((state) => state.chatRoom.rooms[room.detail._id]!);

    const RenderMessageItem: ListRenderItem<IMessageDetail> = useCallback(
        ({ item: message, index }) => {
            const userData = message.senderId === currentUser?.userId ? undefined : members[message.senderId];
            const isConsecutiveMessage = isConsecutiveMessageCheck(message, index, roomDetail.messages);
            const seenByUsers = getSeenByUsers(message, index, roomDetail.messages, members, currentUser!.userId);
            const borderStyle = borderStyleChatMessage(!userData, isConsecutiveMessage);
            const reactions = generateReaction(message.reactions, members, currentUser!);

            // console.log(message._id, message.seenBy);
            return (
                <MessageChatItem
                    key={message._id}
                    message={message}
                    userData={userData}
                    isConsecutiveMessage={isConsecutiveMessage}
                    seensList={seenByUsers}
                    borderStyle={borderStyle}
                    reactionList={reactions}
                />
            );
        },
        [roomDetail.messages, currentUser, members],
    );
    useEffect(() => {
        console.log('Re render Chat List');
    }, [roomDetail]);
    useEffect(() => {
        const handleReadMessage = async (notRead: number) => {
            const session = await LoginSessionManager.getCurrentSession();
            const success = await UpdateSeenMessage(
                room.detail._id,
                {
                    token: session?.token,
                    rtoken: session?.rtoken,
                },
                notRead,
            );
            return success;
        };
        if (notRead && notRead > 0) {
            console.log('Update read message');
            handleReadMessage(notRead);
        }
        dispatch(updateChatRoomData({ roomId: room.detail._id, field: 'notRead', data: 0 }));
    }, [notRead, room.detail._id, dispatch]);
    return (
        <FlatList
            scrollEnabled={false}
            data={roomDetail.messages}
            renderItem={RenderMessageItem}
            keyExtractor={(item) => item._id}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={7}
        />
    );
};

export default memo(MessageChatList);
