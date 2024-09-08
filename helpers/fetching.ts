import { BE_API_URL, BE_URL } from '@/constants/Constants';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
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

export const checkingValidAuthSession = async (auth: IAuthProps) => {
    try {
        if (!auth.rtoken && !auth.token) throw Error('Invalid auth.');
        if (!auth.token && auth.rtoken) {
            auth.token = await refreshToken(auth.rtoken);
            return auth;
        }
        return auth;
    } catch (error) {
        throw Error('Invalid auth.');
    }
};
export const FetchUserProfileById = async (id: PeerId, auth: IAuthProps): Promise<IFetchingUserData | null> => {
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
            const data = (await response.json()) as IFetchingUserData;
            data.user.userId = data.user._id;
            return data;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
interface IFetchingUserData {
    message: string;
    user: ICurrentUserDetail & { _id: string; onlineState?: IOnlineState };
}
interface IFetchingDataResponse {
    friends: {
        count: number;
        friendList: string[];
    };
    message: string;
    user: ICurrentUserDetail & { _id: string; onlineState?: IOnlineState };
}
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

export const fetchMyData = async (auth: IAuthProps): Promise<IFetchingDataResponse | null> => {
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
        const userData = (await fetchUserData.json()) as IFetchingDataResponse;
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
