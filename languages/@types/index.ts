import data from '../data';
export type LanguageType = keyof typeof data;
export type DataLanguageType = (typeof data)[LanguageType];
export type KeyDataLanguageType = keyof DataLanguageType;
export type ValueDataLanguageType = DataLanguageType[KeyDataLanguageType];
export interface ILanguageProps {
    key: KeyDataLanguageType;
    lang: LanguageType;
}
