import { configureStore } from '@reduxjs/toolkit';
import setting from './setting/reducer';
import peers from './peers/reducer';
import auth from './auth/reducer';
import chatRoom from './chatRoom/reducer';
import socket from './socket/reducer';
import notifications from './notifications/reducer';

export const store = configureStore({
    reducer: { setting, peers, auth, chatRoom, socket, notifications },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().concat([]);
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
