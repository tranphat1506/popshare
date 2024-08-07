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
