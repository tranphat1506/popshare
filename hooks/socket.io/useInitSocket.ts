import { useEffect } from 'react';
import useSocketIO from './useSocketIO';
import { useDispatch } from 'react-redux';
import { connectionEstablished, connectionLost } from '@/redux/socket/reducer';
import { SocketEvent } from '@/lib/SocketFactory';
import useOnSocketError from './useOnSocketError';
import { refreshToken } from '@/helpers/fetching';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { logout } from '@/redux/auth/reducer';
import { useAppSelector } from '@/redux/hooks/hooks';
import useOnChatMessage from './useOnChatMessage';
import { updateChatRoomData, updateTheNewestMessage } from '@/redux/chatRoom/reducer';
import useOnSeenStatus from './useOnSeenStatus';
import { IOnlineState, updatePeerById } from '@/redux/peers/reducer';
import useOnActionOnChatRoom from './useOnActionOnChatRoom';

const useInitSocket = () => {
    const socket = useSocketIO();
    const dispatch = useDispatch();
    const [newMessage] = useOnChatMessage('global');
    const [onTypingAction] = useOnActionOnChatRoom('global');
    const [onError] = useOnSocketError<string>('auth');
    const rooms = useAppSelector((state) => state.chatRoom.rooms);
    const peers = useAppSelector((state) => state.peers.peers);
    const user = useAppSelector((state) => state.auth.user);
    useOnSeenStatus(user!.userId);

    const handleRefreshToken = async () => {
        try {
            const session = await LoginSessionManager.getCurrentSession();
            if (session && session.rtoken) {
                const token = await refreshToken(session.rtoken);
                if (token) {
                    session.token = token;
                    await LoginSessionManager.setCurrentSession(session);
                    return;
                }
            }
            throw Error();
        } catch (error) {
            // Error when refrsh token
            await LoginSessionManager.logoutSession(false);
            dispatch(logout());
            dispatch(connectionLost());
        }
    };
    useEffect(() => {
        if (onError) {
            handleRefreshToken();
        }
    }, [onError]);
    const handleConnectSocket = () => {
        socket.on('connect', () => {
            console.info('Connect with socketId =', socket.id);
            const roomIdList: string[] = Object.keys(rooms);
            const friendIdList: string[] = Object.keys(peers);
            socket.emit(SocketEvent.SetupChatRoom, { roomIdList: roomIdList });
            socket.emit(SocketEvent.onSetupNotification, { friendIdList: friendIdList });
            socket.emit(SocketEvent.handleUserConnect);
            dispatch(connectionEstablished({ socketId: socket.id }));
        });
        socket.on(SocketEvent.sendOnlineState, (data: IOnlineState) => {
            if (data.userId !== user?.userId) {
                dispatch(updatePeerById({ userId: data.userId, field: 'onlineState', data: data }));
            }
        });
        socket.on('disconnect', (e) => {
            console.info('Disconect');
            dispatch(connectionLost());
        });
        socket.on('connect_error', (e) => {
            console.error(e);
            dispatch(connectionLost());
        });
    };

    const handleDisconnectSocket = () => {
        socket.disconnect();
        socket.removeAllListeners();
    };
    // On new message
    useEffect(() => {
        if (!!newMessage && !!user)
            dispatch(updateTheNewestMessage({ message: newMessage, currentUserId: user.userId }));
    }, [newMessage]);
    // On typing action room
    useEffect(() => {
        if (onTypingAction)
            dispatch(
                updateChatRoomData({
                    roomId: onTypingAction.roomId,
                    field: 'onAction',
                    data: onTypingAction,
                }),
            );
    }, [onTypingAction]);
    useEffect(() => {
        handleConnectSocket();
        return () => {
            handleDisconnectSocket();
        };
    }, []);

    return socket;
};
export default useInitSocket;
