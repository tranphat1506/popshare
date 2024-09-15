import { BE_URL } from '@/constants/Constants';
import { io, Socket } from 'socket.io-client';
export enum SocketEvent {
    sendMessage = 'SendMessage',
    sendNotification = 'NotiSent',
    broadcastNotification = 'Broadcast',
    SetupChatRoom = 'SetupChatRoom',
    sendSocketRequestError = 'SocketRequestError',
    onTyping = 'OnTyping',
    responseTyping = 'ReponseTyping',
    onSendSeenStatus = 'OnSeenMessage',
    sendOnlineState = 'SendOnlineState',
    handleUserLogout = 'handleUserLogout',
    onSetupNotification = 'SetupNotification',
    handleUserConnect = 'handleUserConnect',
}
export interface SocketInterface {
    socket: Socket;
}

export class SocketConnection implements SocketInterface {
    public socket: Socket;
    public socketEndpoint = BE_URL;
    // The constructor will initialize the Socket Connection
    constructor(token?: string) {
        this.socket = io(this.socketEndpoint, {
            transports: ['websocket'],
            extraHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export let socketConnection: SocketConnection;

// The SocketFactory is responsible for creating and returning a single instance of the SocketConnection class
// Implementing the singleton pattern
class SocketFactory {
    public static create(token?: string): SocketConnection {
        socketConnection = new SocketConnection(token);
        return socketConnection;
    }

    public static initSocket() {}
}

export default SocketFactory;
