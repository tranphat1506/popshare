import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { updateSeenMessages } from '@/redux/chatRoom/reducer';

export interface IMarkAsSeenPayload {
    userId: string;
    roomId: string;
    messagesIdList: string[];
}
const useOnSeenStatus = (userId: string) => {
    const socket = socketConnection.socket;
    const dispatch = useAppDispatch();
    const [seenComing, setSeenComing] = useState<IMarkAsSeenPayload>();
    useEffect(() => {
        socket.on(SocketEvent.onSendSeenStatus, (payload: IMarkAsSeenPayload) => {
            setSeenComing(payload);
        });
        return () => {
            socket.off(SocketEvent.onSendSeenStatus);
        };
    }, []);
    useEffect(() => {
        if (seenComing) {
            dispatch(updateSeenMessages({ ...seenComing, currentUserId: userId }));
        }
    }, [seenComing]);
    return seenComing;
};
export default useOnSeenStatus;
