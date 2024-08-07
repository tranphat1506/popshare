import { DataLanguageType, KeyDataLanguageType, LanguageType } from '../@types';
import data from '../data';
export class LanguageServiceClass {
    // value
    #_language: LanguageType = 'default';
    get language(): LanguageType {
        return this.#_language;
    }
    set language(lang: LanguageType) {
        this.#_language = lang;
    }

    data(): DataLanguageType;
    data(lang?: LanguageType): DataLanguageType;
    data(lang?: LanguageType): DataLanguageType {
        if (lang === undefined) return data[this.language];
        return data[lang];
    }

    getWord({ key }: { key?: KeyDataLanguageType }): string;
    getWord({ language }: { language: LanguageType }): DataLanguageType;
    getWord(): DataLanguageType;
    getWord(props?: { key?: KeyDataLanguageType; language?: LanguageType }): string | DataLanguageType {
        if (props === undefined) {
            return this.data();
        }
        if (!props.key) return this.data(props.language);
        return this.data(props.language)[props.key];
    }
}
