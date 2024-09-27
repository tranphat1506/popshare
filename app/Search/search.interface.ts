import { IOnlineState, IUserPublicDetail } from '@/redux/peers/reducer';

export interface SearchUserResult extends IUserPublicDetail {
    _id: string;
    isMyFriend?: boolean;
}
