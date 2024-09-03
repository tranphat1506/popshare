import { BE_API_URL, BE_URL } from '@/constants/Constants';
import { ICurrentUserDetail } from '@/redux/auth/reducer';
import { PeerId } from '@/redux/peers/reducer';
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
interface IResponseFetch<Payload> {
    httpCode: string | number;
    isError: boolean;
    payload: Payload;
}

export const FetchUserProfileById = (id: PeerId): Promise<IResponseFetch<any>> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(BE_URL + '' + id, {
                method: 'GET',
            });
            resolve({
                httpCode: response.status,
                payload: await response.json(),
                isError: response.status !== 200,
            });
        } catch (error) {
            reject(error);
        }
    });
};
interface IFetchingDataResponse {
    friends: {
        count: number;
        friendList: string[];
    };
    message: string;
    user: ICurrentUserDetail & { _id: string };
}
export const refreshTokenAndFetchingData = async (rtoken?: string) => {
    try {
        if (!rtoken) throw Error('WHERE RTOKEN?');
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
            return await fetchMyData(token);
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

export const fetchMyData = async (token: string) => {
    try {
        const fetchUserData = await fetch(BE_API_URL + '/user/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!fetchUserData.ok) {
            return null;
        }
        const userData = (await fetchUserData.json()) as IFetchingDataResponse;
        userData.user.token = token;
        userData.user.profilePicture =
            userData.user.profilePicture == 'undefined' ? undefined : userData.user.profilePicture;
        return userData;
    } catch (error) {
        console.error(error);
        return null;
    }
};
