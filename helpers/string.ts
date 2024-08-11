import languages from '@/languages';

export const stringToColorCode = function (str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

export const getAllFirstLetterOfString = (str: string, maxLetter = 3): string => {
    const nameArr = str?.split(' ');
    if (nameArr.length === 1) return str.slice(0, maxLetter);
    return nameArr
        .slice(0, maxLetter)
        .map((w) => w[0])
        .join('');
};
export class StringOnlineStateHelper {
    private static miliPerSec = 1000;
    private static language = languages.LanguageService;
    private static currentTime = Date.now();

    private static minToMili(minute: number): number {
        return minute * this.miliPerSec * 60;
    }

    private static miliToMin(milisecond: number): number {
        return milisecond / this.miliPerSec / 60;
    }

    static toLastOnlineTime(time: number): string | undefined {
        const btwTime = this.currentTime - time;
        if (btwTime < this.miliPerSec * 60) return Math.round(btwTime / 1000) + 's';
        if (btwTime < this.minToMili(59)) return Math.round(this.miliToMin(btwTime)) + 'm';
        if (btwTime < this.minToMili(60 * 24)) return Math.round(this.miliToMin(btwTime) / 60) + 'h';
        return Math.round(this.miliToMin(btwTime) / 60 / 24) + 'd';
    }
}
