import { configureStore } from '@reduxjs/toolkit';
import setting from './setting/reducer';
import peers from './peers/reducer';
import auth from './auth/reducer';

export const store = configureStore({ reducer: { setting, peers, auth } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
