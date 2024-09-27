import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification } from './notifications.interface';

export type NotificationType = {
    // for UI
    isReaded?: boolean;
} & INotification;
export interface NotificationState {
    notifications: { [notiId: string]: NotificationType | undefined };
    notiQueue: string[];
}
export const initState: NotificationState = {
    notifications: {},
    notiQueue: [],
};
const notificationReducer = {
    addNoti: (state: NotificationState, action: PayloadAction<NotificationType>) => {
        const noti = action.payload;
        state.notifications[noti._id] = noti;
        state.notiQueue.push(noti._id);
    },
    addMoreNoti: (state: NotificationState, action: PayloadAction<NotificationType[]>) => {
        for (const noti of action.payload) {
            state.notifications[noti._id] = noti;
            state.notiQueue.push(noti._id);
        }
    },
    sortTheNotificationQueue: (state: NotificationState) => {
        state.notiQueue = Object.keys(state.notifications).sort((id: string, nextId: string) => {
            const noti1 = state.notifications[id]!;
            const noti2 = state.notifications[nextId]!;
            return noti1.createdAt - noti2.createdAt;
        });
    },
    clearState: (state: NotificationState) => {
        state.notiQueue = initState.notiQueue;
        state.notifications = initState.notifications;
    },
    readNotifications: (state: NotificationState, action: PayloadAction<string[]>) => {
        for (const notiId of action.payload) {
            const noti = state.notifications[notiId];
            if (noti) state.notifications[notiId]!.isReaded = true;
        }
    },
};
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: initState,
    reducers: notificationReducer,
});

export const { addNoti, addMoreNoti, clearState, readNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
