import { BE_USER_API_URL } from '@/constants/Constants';
import { PeerId } from '@/redux/peers/reducer';
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
            const response = await fetch(BE_USER_API_URL + id, {
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
