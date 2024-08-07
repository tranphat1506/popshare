import data from './data';
import { LanguageServiceClass } from './services';
const LanguageService = new LanguageServiceClass();
export default {
    ...data,
    LanguageService,
};
