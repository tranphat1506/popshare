import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import {
    CloudMessageRoom,
    GroupMessageRoom,
    ICloudMessageRoom,
    IGroupMessageRoom,
    IP2PMessageRoom,
    P2PMessageRoom,
    SkeletonMessageRoom,
} from './MessageBox';
import { getAllFirstLetterOfString, reverseUnicodeString, stringToColorCode } from '@/helpers/string';
import { MessageChatBoxProps } from './MessageChatBox';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import { addPeers, Peer, Peers } from '@/redux/peers/reducer';
import { ChatRoom, ChatRoomState } from '@/redux/chatRoom/reducer';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { IRoomDetail } from '@/redux/chatRoom/room.interface';
import { FetchUserAvatarByUrl, FetchUserProfileById } from '@/helpers/fetching';

interface MessageListProps {
    handleSetChatBox: (chatBox?: MessageChatBoxProps) => void;
    user: ICurrentUserDetail | undefined;
    peers: Peers;
    chatRoomState: ChatRoomState;
}
const MessageList: React.FC<MessageListProps> = ({ handleSetChatBox, user, peers, chatRoomState }) => {
    const roomQueue = useMemo(() => {
        return chatRoomState.roomQueue;
    }, [chatRoomState.roomQueue]);

    const rooms = useMemo(() => {
        return chatRoomState.rooms;
    }, [chatRoomState.rooms]);
    const peersData = useMemo(() => {
        return peers;
    }, [peers]);
    const dispatch = useAppDispatch();
    const handleFetchAgainUserData = useCallback((room: ChatRoom, currentUser: ICurrentUserDetail) => {
        const fetchingRoomMember = async () => {
            try {
                const session = await LoginSessionManager.getCurrentSession();
                const members: Peers = {};
                const peers = await Promise.all(
                    room.detail.roomMembers.list.map(async (member) => {
                        if (member.memberId === currentUser.userId) return null;
                        const data = await FetchUserProfileById(member.memberId, {
                            token: session?.token,
                            rtoken: session?.rtoken,
                        });
                        if (!data) throw Error('Cannot Fetching');
                        const uriData = data.user.profilePicture
                            ? await FetchUserAvatarByUrl(data.user.profilePicture)
                            : undefined;
                        const peer: Peer = {
                            ...data.user,
                            uriAvatar: uriData,
                            suffixName: getAllFirstLetterOfString(data.user.displayName),
                            friendship: data.friendship,
                        };
                        return peer;
                    }),
                );
                peers.forEach((p) => {
                    if (p) members[p.userId] = p;
                });
                dispatch(addPeers(members));
            } catch (error) {
                console.error(error);
            }
        };
        return fetchingRoomMember();
    }, []);
    const FilterMessageItem: ListRenderItem<string> = useCallback(
        ({ item }) => {
            const room = rooms[item]!;
            if (!room) return <SkeletonMessageRoom />;
            if (room.detail.roomType === 'p2p' && user) {
                const otherUserData = room.detail.roomMembers.list.find((member) => member.memberId !== user.userId)!;
                const existPeerData = peersData[otherUserData.memberId];
                if (!existPeerData) {
                    handleFetchAgainUserData(room, user);
                }
                if (existPeerData) {
                    const p2pRoomProps: IP2PMessageRoom = {
                        room: room,
                        user: existPeerData,
                        member: otherUserData,
                        currentUser: user,
                        handleSetChatBox: handleSetChatBox,
                    };
                    return <P2PMessageRoom {...p2pRoomProps} />;
                }
            } else if (room.detail.roomType === 'group' && user) {
                const groupRoomProps: IGroupMessageRoom = {
                    room: room,
                    avatarColor: stringToColorCode(room.detail._id),
                    suffixNameColor: stringToColorCode(reverseUnicodeString(room.detail._id)),
                    suffixRoomName: getAllFirstLetterOfString(room.detail.roomName!),
                    handleSetChatBox: handleSetChatBox,
                    currentUser: user,
                };
                return <GroupMessageRoom {...groupRoomProps} />;
            } else if (room.detail.roomType === 'cloud' && user) {
                const cloudRoomProps: ICloudMessageRoom = {
                    room: room,
                    currentUser: user,
                    member: room.detail.roomMembers.list[0],
                    handleSetChatBox: handleSetChatBox,
                };
                return <CloudMessageRoom {...cloudRoomProps} />;
            }
            return <SkeletonMessageRoom />;
        },
        [roomQueue, rooms, peersData],
    );
    return <FlatList data={roomQueue} renderItem={FilterMessageItem} keyExtractor={(roomId) => roomId} />;
};

export default memo(MessageList);
