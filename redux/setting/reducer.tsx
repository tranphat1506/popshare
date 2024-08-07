import { LanguageType } from '@/languages/@types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingState = {
    language: LanguageType;
};
export const initState: SettingState = {
    language: 'default',
};

const settingReducer = {
    changeLanguage: (state: SettingState, action: PayloadAction<LanguageType>) => {
        state.language = action.payload;
    },
};

const settingSlice = createSlice({
    name: 'setting',
    initialState: initState,
    reducers: settingReducer,
});

export const { changeLanguage } = settingSlice.actions;
export default settingSlice.reducer;
