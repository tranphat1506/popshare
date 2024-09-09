import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import useSocketIO from './useSocketIO';

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
    const socket = useSocketIO();
    const [error, setError] = useState<ISocketErrorResponse<IPayload> | null>(null);
    useEffect(() => {
        socket.on('SocketRequestError', (error: ISocketErrorResponse<IPayload>) => {
            if (catchEvent === error.event) {
                setError(error);
            }
        });
        return () => {
            socket.off('SocketRequestError');
        };
    }, []);

    return [error, setError];
};

export default useOnSocketError;
