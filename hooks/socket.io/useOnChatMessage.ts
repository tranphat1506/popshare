import { useCallback, useEffect, useRef, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { IMessageDetail } from '@/redux/chatRoom/messages.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import usePlaySound from '../usePlaySound';
import { addRoom, sortTheRoomQueue, updateTheNewestMessages } from '@/redux/chatRoom/reducer';
import { IRoomDetail } from '@/redux/chatRoom/room.interface';
import { FetchChatRoomMessagesPerPage } from '@/helpers/fetching';
import { LoginSessionManager } from '@/storage/loginSession.storage';

const useOnChatMessage = () => {
    const socket = socketConnection.socket;
    const dispatch = useAppDispatch();
    const [newMessages, setMessages] = useState<IMessageDetail[]>();
    const NotificationSound = usePlaySound('NotificationSound');
    const user = useAppSelector((state) => state.auth.user);
    const isOnChatting = useAppSelector((state) => state.chatRoom.isOnChatRoom);
    const messagesBatch = useRef<IMessageDetail[]>([]);
    const batchInterval = 500; // Khoảng thời gian batch (500ms)
    const isBatching = useRef(false);
    useEffect(() => {
        // On recived messages
        socket.on(SocketEvent.sendMessage, (data: { messages: IMessageDetail[]; socketId: string }) => {
            if (user && data.socketId !== socket.id) setMessages(data.messages);
        });

        // On joined new chat room
        socket.on(SocketEvent.onJoinNewChatRoom, async (data?: IRoomDetail) => {
            if (data) {
                console.log(data);
                dispatch(addRoom(data));
                dispatch(sortTheRoomQueue());
                socket.emit(SocketEvent.SetupChatRoom, { roomIdList: [data._id] });
                const session = await LoginSessionManager.getCurrentSession();
                const messages = await FetchChatRoomMessagesPerPage(
                    { token: session?.token, rtoken: session?.rtoken },
                    data._id,
                    0,
                );
                if (messages && user) {
                    dispatch(
                        updateTheNewestMessages({
                            messages: messages.messages.reverse(),
                            currentUserId: user.userId,
                        }),
                    );
                }
            }
        });

        return () => {
            socket.off(SocketEvent.sendMessage);
        };
    }, []);
    const handlePlayNotification = useCallback(() => {
        if (!isOnChatting && NotificationSound) NotificationSound?.handleAsyncPlayFromStart();
    }, [isOnChatting, NotificationSound]);
    // On new message
    useEffect(() => {
        isBatching.current = false;
        if (!newMessages || !user) return;
        const updateMessages = () => {
            const batchMessages = [...messagesBatch.current];
            messagesBatch.current = []; // reset queue
            handlePlayNotification();
            dispatch(updateTheNewestMessages({ messages: batchMessages, currentUserId: user.userId }));
        };
        messagesBatch.current = messagesBatch.current.concat(newMessages);
        if (messagesBatch.current.length >= 10) {
            // If batch reaches 10, send immediately
            updateMessages();
        } else if (!isBatching.current) {
            // Start batching if not already in progress
            isBatching.current = true;
            setTimeout(() => {
                updateMessages();
            }, batchInterval);
        }
    }, [newMessages]);
    // On new message
    // useEffect(() => {
    //     console.log('ON::', isOnChatting);
    // }, [isOnChatting]);
    return [newMessages, setMessages] as [
        IMessageDetail[] | undefined,
        React.Dispatch<React.SetStateAction<IMessageDetail[] | undefined>>,
    ];
};
export default useOnChatMessage;
