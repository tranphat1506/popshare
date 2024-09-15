import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { IMessageDetail } from '@/redux/chatRoom/messages.interface';
import { useAppSelector } from '@/redux/hooks/hooks';

const useOnChatMessage = (roomId?: string) => {
    const socket = socketConnection.socket;
    const [newMessage, setMessage] = useState<IMessageDetail>();
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        // On recived messages
        socket.on(SocketEvent.sendMessage, (message: IMessageDetail) => {
            if ((roomId === message.roomId || roomId === 'global') && user && message.senderId !== user.userId)
                setMessage(message);
        });

        return () => {
            socket.off(SocketEvent.sendMessage);
        };
    }, []);
    return [newMessage, setMessage] as [
        IMessageDetail | undefined,
        React.Dispatch<React.SetStateAction<IMessageDetail | undefined>>,
    ];
};
export default useOnChatMessage;
