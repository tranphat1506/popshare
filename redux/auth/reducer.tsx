import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISessionToken, LoginSessionManager } from '@/storage/loginSession.storage';
export interface INotificationSettings {
    messages: boolean;
    addFriends: boolean;
}
export interface IPrivacySettings {
    allowStrangerSendMessages: AllowStrangerSendMessageTypes;
}
type AllowStrangerSendMessageTypes = 'invite' | 'allow' | 'none';
export const AllowStrangerSendMessageEnum: AllowStrangerSendMessageTypes[] = ['allow', 'invite', 'none'];
export interface ICurrentUserDetail {
    userId: string;
    authId: string;
    username: string;
    email: string;
    createdAt: string;
    profilePicture: string | undefined;
    isVerify: boolean;
    displayName: string;
    avatarEmoji: string;
    avatarColor: string;
    privacies: IPrivacySettings;
    notifications: INotificationSettings;
    token: string;
}

export interface IAuthState {
    isLogging?: boolean;
    user?: ICurrentUserDetail;
}
export const initState: IAuthState = {
    isLogging: false,
    user: undefined,
};
const authReducer = {
    login: (state: IAuthState, action: PayloadAction<ICurrentUserDetail | undefined>) => {
        state.isLogging = true;
        state.user = action.payload;
    },
    logout: (state: IAuthState) => {
        state.isLogging = false;
        state.user = undefined;
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: authReducer,
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
