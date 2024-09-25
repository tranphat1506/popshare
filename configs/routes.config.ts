import { MessageChatBoxProps } from '@/components/Messages/MessageChatBox';
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
    '/': undefined;
    friends: undefined;
    'friends-list': {
        peerId?: PeerId;
        filterNav?: string;
    };
    notifications: undefined;
    messages: MessagesStackParamList;
    'message-detail': MessageChatBoxProps | undefined;
    archive: undefined;
    signIn?: {
        account?: string;
        error?: string;
    };
    signOut: undefined;
    signUp: undefined;
    'user-detail': {
        userId: string;
    };
    search: undefined;
};

export type MessagesStackParamList = {
    index?: undefined;
};
