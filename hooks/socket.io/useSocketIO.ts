import SocketFactory from '@/lib/SocketFactory';
import { useAppSelector } from '@/redux/hooks/hooks';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const useSocketIO = () => {
    const auth = useAppSelector((state) => state.auth);
    const socketState = useAppSelector((state) => state.socket);
    const [socket, setSocket] = useState<Socket>(SocketFactory.create(auth.user?.token).socket);
    useEffect(() => {
        if (!socketState.isConnected) setSocket(SocketFactory.create(auth.user?.token).socket);
    }, [auth.user?.token, socketState.isConnected]);
    return socket;
};
export default useSocketIO;
