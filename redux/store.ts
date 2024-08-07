import { configureStore } from '@reduxjs/toolkit';
import setting from './setting/reducer';
import peers from './peers/reducer';

export const store = configureStore({ reducer: { setting, peers } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
