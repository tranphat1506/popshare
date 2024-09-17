import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { IMessageDetail, IMessageTypeTypes } from '@/redux/chatRoom/messages.interface';
import { useAppSelector } from '@/redux/hooks/hooks';

export interface IResponseOnTyping extends IRequestOnTyping {
    userId: string;
}

export interface IRequestOnTyping {
    roomId: string;
    typeTyping: IMessageTypeTypes | 'stop';
}
const useOnActionOnChatRoom = (roomId: string = 'global') => {
    const socket = socketConnection.socket;
    const [action, setAction] = useState<IResponseOnTyping>();
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        socket.on(SocketEvent.responseTyping, (action: IResponseOnTyping) => {
            console.log(action);
            if ((roomId === action.roomId || roomId === 'global') && user && action.userId !== user.userId)
                setAction(action);
        });
    }, []);
    return [action, setAction] as [
        IResponseOnTyping | undefined,
        React.Dispatch<React.SetStateAction<IResponseOnTyping | undefined>>,
    ];
};

const useEmitOnTyping = (roomId?: string) => {
    const socket = socketConnection.socket;
    const [type, setType] = useState<IResponseOnTyping['typeTyping'] | undefined>();
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (type && type != 'stop') {
            intervalId = setInterval(() => {
                socket.emit(SocketEvent.onTyping, {
                    roomId: roomId,
                    typeTyping: type,
                } as IRequestOnTyping);
            }, 2000);
        } else {
            socket.emit(SocketEvent.onTyping, {
                roomId: roomId,
                typeTyping: 'stop',
            } as IRequestOnTyping);
            setType(undefined);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [type]);
    return [type, setType] as [
        IRequestOnTyping['typeTyping'],
        React.Dispatch<React.SetStateAction<IRequestOnTyping['typeTyping']>>,
    ];
};
export { useEmitOnTyping };
export default useOnActionOnChatRoom;
