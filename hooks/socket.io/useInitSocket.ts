import { useEffect } from 'react';
import useSocketIO from './useSocketIO';
import { useDispatch } from 'react-redux';
import { connectionEstablished, connectionLost } from '@/redux/socket/reducer';
import { SocketEvent } from '@/lib/SocketFactory';
import { useAppSelector } from '@/redux/hooks/hooks';
import useOnSocketError from './useOnSocketError';
import { refreshToken } from '@/helpers/fetching';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { logout } from '@/redux/auth/reducer';

const useInitSocket = () => {
    const socket = useSocketIO();
    const dispatch = useDispatch();
    const [onError] = useOnSocketError<string>('auth');
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
            const roomIdList: string[] = [];
            socket.emit(SocketEvent.SetupChatRoom, roomIdList);
            dispatch(connectionEstablished({ socketId: socket.id }));
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
    useEffect(() => {
        handleConnectSocket();
        return () => {
            handleDisconnectSocket();
        };
    }, []);

    return socket;
};
export default useInitSocket;
