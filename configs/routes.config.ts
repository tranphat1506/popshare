import { PeerId } from '@/redux/peers/reducer';

export const DEFAULT_CONFIG = {
    screens: {
        home: '',
        NotFound: '*',
    },
};

export const DEFAULT_LINKING = {
    prefixes: [],
    config: DEFAULT_CONFIG,
};

export type RootStackParamList = {
    '/': {};
    archive: {};
    friends: {
        peerId?: PeerId;
        filterNav?: string;
    };
    notifications: {};
};
