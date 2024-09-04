import { Peer, PeerId } from '@/redux/peers/reducer';
import { fakerVI } from '@faker-js/faker';
import uuid from 'react-native-uuid';
import { getAllFirstLetterOfString, stringToColorCode } from './string';

export const OS = ['android', 'ios', 'macos', 'windows', 'web'];

// export const genRandomPeer = (): Peer => {
//     const peerId = uuid.v4().toString();
//     const displayName = fakerVI.person.fullName();
//     return {
//         id: peerId,
//         displayName,
//         username: fakerVI.person.zodiacSign(),
//         avatar: fakerVI.image.avatarGitHub(),
//         suffixName: getAllFirstLetterOfString(displayName),
//         userBgColorCode: stringToColorCode(peerId),
//     };
// };

export const genRandomPeerId = (): PeerId => {
    return uuid.v4().toString();
};

export const genRandomNumberBtwMaxAndMin = (max: number, min: number): PeerId => {
    return Math.round(Math.random() * (max - min) + min).toString();
};

// export const genRandomPeers = (n: number): Peer[] => {
//     return fakerVI.helpers.multiple(genRandomPeer, {
//         count: n ?? 0,
//     });
// };
export const getRandomImageUrl = () => {
    return fakerVI.image.url();
};
export const genRandomPeersId = (n: number): PeerId[] => {
    return fakerVI.helpers.multiple(genRandomPeerId, {
        count: n ?? 0,
    });
};
