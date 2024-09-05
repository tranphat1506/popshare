import SocketFactory from '@/lib/SocketFactory';
import { useAppSelector } from '@/redux/hooks/hooks';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const useSocketIO = () => {
    const auth = useAppSelector((state) => state.auth);
    const [socket, setSocket] = useState<Socket>(SocketFactory.create(auth.user?.token).socket);
    useEffect(() => {
        setSocket(SocketFactory.create(auth.user?.token).socket);
    }, [auth.user?.token]);
    return socket;
};
export default useSocketIO;
