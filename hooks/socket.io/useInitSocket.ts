import { useEffect } from 'react';
import useSocketIO from './useSocketIO';
import { useDispatch } from 'react-redux';
import { connectionEstablished, connectionLost } from '@/redux/socket/reducer';
import { SocketEvent } from '@/lib/SocketFactory';
import { useAppSelector } from '@/redux/hooks/hooks';

const useInitSocket = () => {
    const socket = useSocketIO();
    const dispatch = useDispatch();
    const peers = useAppSelector((state) => state.peers);
    const handleConnectSocket = () => {
        socket.on('connect', () => {
            console.info('Connect with socketId =', socket.id);
            const friendIdList = Object.keys(peers.peers);
            socket.emit(SocketEvent.SetupChatRoom, friendIdList);
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
