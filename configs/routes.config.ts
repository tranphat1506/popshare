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
    friends?: {
        peerId?: PeerId;
        filterNav?: string;
    };
    notifications?: undefined;
    messages?: MessagesStackParamList; // Nest messages stack here
    archive: undefined;
    signIn: undefined;
    signOut: undefined;
    signUp: undefined;
};

export type MessagesStackParamList = {
    messages: MessageChatBoxProps | undefined; // This would be the main screen for messages
};
