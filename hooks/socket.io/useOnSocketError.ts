import { useEffect, useState } from 'react';
import { socketConnection, SocketEvent } from '@/lib/SocketFactory';

interface ISocketErrorResponse<Payload> {
    event: string;
    payload?: Payload;
    message: string;
}
const useOnSocketError = <IPayload>(
    catchEvent: string,
): [
    ISocketErrorResponse<IPayload> | null,
    React.Dispatch<React.SetStateAction<ISocketErrorResponse<IPayload> | null>>,
] => {
    const socket = socketConnection.socket;
    const [error, setError] = useState<ISocketErrorResponse<IPayload> | null>(null);
    useEffect(() => {
        socket.on(SocketEvent.sendSocketRequestError, (error: ISocketErrorResponse<IPayload>) => {
            if (catchEvent === error.event) {
                setError(error);
            }
        });
        return () => {
            socket.off(SocketEvent.sendSocketRequestError);
        };
    }, []);

    return [error, setError];
};

export default useOnSocketError;
