import { LanguageType } from '@/languages/@types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingState = {
    language: LanguageType;
    theme: 'light' | 'dark' | 'device';
};
export const initState: SettingState = {
    language: 'default',
    theme: 'device',
};

const settingReducer = {
    changeLanguage: (state: SettingState, action: PayloadAction<LanguageType>) => {
        state.language = action.payload;
    },
    changeTheme: (state: SettingState, action: PayloadAction<'light' | 'dark' | 'device'>) => {
        state.theme = action.payload;
    },
};

const settingSlice = createSlice({
    name: 'setting',
    initialState: initState,
    reducers: settingReducer,
});

export const { changeLanguage } = settingSlice.actions;
export default settingSlice.reducer;
