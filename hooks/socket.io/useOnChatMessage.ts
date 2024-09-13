import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { IMessageDetail } from '@/redux/chatRoom/messages.interface';

const useOnChatMessage = (roomId?: string) => {
    const socket = socketConnection.socket;
    const [newMessage, setMessage] = useState<IMessageDetail>();

    useEffect(() => {
        socket.on(SocketEvent.sendMessage, (message: IMessageDetail) => {
            if (roomId === message.roomId || roomId === 'global') setMessage(message);
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
