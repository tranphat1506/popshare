import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { IMessageDetail } from '@/redux/chatRoom/messages.interface';
import { useAppSelector } from '@/redux/hooks/hooks';

const useOnChatMessage = () => {
    const socket = socketConnection.socket;
    const [newMessages, setMessages] = useState<IMessageDetail[]>();
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        // On recived messages
        socket.on(SocketEvent.sendMessage, (data: { messages: IMessageDetail[]; socketId: string }) => {
            if (user && data.socketId !== socket.id) setMessages(data.messages);
        });

        return () => {
            socket.off(SocketEvent.sendMessage);
        };
    }, []);
    return [newMessages, setMessages] as [
        IMessageDetail[] | undefined,
        React.Dispatch<React.SetStateAction<IMessageDetail[] | undefined>>,
    ];
};
export default useOnChatMessage;
