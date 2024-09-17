import { BE_API_URL, BE_URL } from '@/constants/Constants';
import { socketConnection } from '@/lib/SocketFactory';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import { IMessageDetail, IMessageTypeTypes } from '@/redux/chatRoom/messages.interface';
import { IRoomDetail } from '@/redux/chatRoom/room.interface';
import { IOnlineState, PeerId } from '@/redux/peers/reducer';
import { LoginSessionManager } from '@/storage/loginSession.storage';
const base64ImageRegx = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g;
export const FetchUserAvatarByUrl = (url: string): Promise<string | undefined> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            if (response.status === 200) {
                const blob = await response.blob();
                const fileReaderInstance = new FileReader();
                fileReaderInstance.onload = () => {
                    const base64 = fileReaderInstance.result as string;
                    resolve(base64);
                };
                fileReaderInstance.onerror = (error) => resolve(undefined);
                fileReaderInstance.readAsDataURL(blob);
            }
        } catch (error) {
            reject(error);
        }
    });
};
interface IAuthProps {
    token?: string | null;
    rtoken?: string | null;
}
interface IFetchingResponse {
    message: string;
}
type FetchingUserData = {
    user: ICurrentUserDetail & { _id: string; onlineState?: IOnlineState };
} & IFetchingResponse;
type FetchingCurrentUserPayload = {
    friends: {
        count: number;
        friendList: string[];
    };
    user: ICurrentUserDetail & { _id: string; onlineState?: IOnlineState };
} & IFetchingResponse;

type FetchingCurrentUserRoomPayload = IFetchingResponse & {
    roomIdList: string[];
    rooms: IRoomDetail[];
};
export const checkingValidAuthSession = async (auth: IAuthProps) => {
    try {
        if (!auth.rtoken && !auth.token) throw Error('Invalid auth.');
        if (!auth.token && auth.rtoken) {
            auth.token = (await refreshToken(auth.rtoken)) as string;
            return auth;
        }
        return auth;
    } catch (error) {
        throw Error(error as string);
    }
};
export const FetchChatRoomCurrentUser = async (auth: IAuthProps): Promise<FetchingCurrentUserRoomPayload | null> => {
    try {
        auth = await checkingValidAuthSession(auth);
        const response = await fetch(BE_API_URL + '/room/myChatRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        });
        if (response.status === 401 && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return await FetchChatRoomCurrentUser(auth);
        }
        if (response.ok) {
            const data = (await response.json()) as FetchingCurrentUserRoomPayload;
            return data;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

interface FetchChatRoomMessagesPerPage extends IFetchingResponse {
    messages: IMessageDetail[];
}
export const FetchChatRoomMessagesPerPage = async (
    auth: IAuthProps,
    roomId: string,
    page: number,
): Promise<FetchChatRoomMessagesPerPage | null> => {
    try {
        auth = await checkingValidAuthSession(auth);
        const response = await fetch(BE_API_URL + '/chat/getPerPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
                roomId: roomId,
                page: page,
            }),
        });
        if (response.status === 401 && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return await FetchChatRoomMessagesPerPage(auth, roomId, page);
        }
        if (response.ok) {
            const data = (await response.json()) as FetchChatRoomMessagesPerPage;
            return data;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const FetchUserProfileById = async (id: PeerId, auth: IAuthProps): Promise<FetchingUserData | null> => {
    try {
        auth = await checkingValidAuthSession(auth);
        const response = await fetch(BE_API_URL + '/user/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        });
        if (response.status === 401 && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return await FetchUserProfileById(id, auth);
        }
        if (response.ok) {
            const data = (await response.json()) as FetchingUserData;
            data.user.userId = data.user._id;
            return data;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const UpdateSeenMessage = async (
    roomId: string,
    auth: IAuthProps,
    notRead: number,
): Promise<IFetchingResponse | null> => {
    try {
        auth = await checkingValidAuthSession(auth);
        const response = await fetch(BE_API_URL + '/chat/markAsSeen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({
                roomId: roomId,
                notRead: notRead,
            }),
        });
        if (response.status === 401 && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return await UpdateSeenMessage(roomId, auth, notRead);
        }
        if (response.ok) {
            const data = (await response.json()) as IFetchingResponse;
            return data;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const refreshToken = async (rtoken: string) => {
    try {
        const response = await fetch(BE_API_URL + '/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rtoken: rtoken,
            }),
        });
        if (response.ok) {
            const refreshData = await response.json();
            const token = refreshData.token as string;
            if (!token) throw Error('WHERE ACCESS TOKEN?');
            const session = await LoginSessionManager.getCurrentSession();
            if (session) {
                session.token = token;
                await LoginSessionManager.setSessionToSessionSaved(session, true);
            }
            return token;
        } else {
            // Mean this rfresh token is not valid anymore
            // return to signin or
            // console.log(await response.json());
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const refreshTokenAndFetchingData = async (auth: IAuthProps) => {
    try {
        auth = await checkingValidAuthSession(auth);
        return await fetchMyData(auth);
    } catch (error) {
        console.error(error);
        return null;
    }
};
interface SendMessagePayload {
    roomId: string;
    messageType: IMessageTypeTypes;
}

type TextMessagePayload = SendMessagePayload & {
    messageType: 'text';
    content: string;
};

interface SendMessageResponse extends IFetchingResponse {
    newMessage: IMessageDetail;
}

export const sendMessage = async (
    auth: IAuthProps,
    payload: TextMessagePayload,
    socketId?: string,
): Promise<SendMessageResponse | null> => {
    if (!socketId) return null;
    try {
        auth = await checkingValidAuthSession(auth);
        const sendReponse = await fetch(BE_API_URL + '/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify({ message: payload, socketId: socketId }),
        });
        const json = await sendReponse.json();
        if (sendReponse.ok) return json as SendMessageResponse;
        // not authorized
        if (sendReponse.status === 401 && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return await sendMessage(auth, payload);
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const sendTextMessage = async (auth: IAuthProps, payload: TextMessagePayload, socketId?: string) => {
    try {
        payload.messageType = 'text';
        return await sendMessage(auth, payload, socketId);
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const fetchMyData = async (auth: IAuthProps): Promise<FetchingCurrentUserPayload | null> => {
    try {
        auth = await checkingValidAuthSession(auth);
        const fetchUserData = await fetch(BE_API_URL + '/user/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        });
        if (!fetchUserData.ok) {
            // not authorized
            if (fetchUserData.status === 401 && auth.rtoken) {
                auth.token = await refreshToken(auth.rtoken);
                return await fetchMyData(auth);
            }
            // other error code
            return null;
        }
        const userData = (await fetchUserData.json()) as FetchingCurrentUserPayload;
        if (userData.user._id) userData.user.userId = userData.user._id;
        userData.user.token = auth.token!;
        userData.user.profilePicture =
            userData.user.profilePicture == 'undefined' ? undefined : userData.user.profilePicture;
        return userData;
    } catch (error) {
        console.error(error);
        return null;
    }
};
