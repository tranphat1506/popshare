import React, { useMemo } from 'react';
import { View } from 'react-native';
import MessageList from './MessageList';
import { MessageChatBoxProps } from './MessageChatBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { ThemedText } from '../ThemedText';
import useLanguage from '@/languages/hooks/useLanguage';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import { ThemedView } from '../ThemedView';
import { useAppSelector } from '@/redux/hooks/hooks';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';

interface MessageContainerProps {
    chatBox?: MessageChatBoxProps;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ chatBox }) => {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            HEADER_TITLE: lang.MESSAGES_TITLE,
            MESSAGES_REQUESTS: lang.MESSAGES_REQUEST,
        };
    }, []);
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'messages'>>();
    const chatRoomState = useAppSelector((state) => state.chatRoom);
    const user = useAppSelector((state) => state.auth.user);
    const peers = useAppSelector((state) => state.peers.peers);

    const messageNotRead = useMemo(() => {
        return Object.keys(chatRoomState.rooms).filter((r) => !!chatRoomState.rooms[r]?.notRead === true).length;
    }, [chatRoomState.rooms]);
    const handleChangeChatBox = (chatBox?: MessageChatBoxProps) => {
        navigation.navigate('message-detail', chatBox);
    };
    const handleExit = () => {
        navigation.goBack();
    };
    return (
        <>
            {/* Header */}
            <View className="flex flex-row items-center px-4 h-14 justify-between">
                <View
                    className="flex flex-row items-center justify-between"
                    style={{ columnGap: 20, flexBasis: '20%' }}
                >
                    <TouchableOpacity onPress={handleExit}>
                        <Icon as={Ionicons} name="arrow-back" size={'lg'} className="text-black dark:text-white" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flexBasis: '60%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        columnGap: 10,
                    }}
                >
                    <ThemedText
                        style={{ fontFamily: 'System-Medium', textAlign: 'center', lineHeight: 20, fontSize: 16 }}
                    >
                        {textData.HEADER_TITLE}
                    </ThemedText>
                    <View
                        style={{
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                            backgroundColor: BLUE_MAIN_COLOR,
                            borderRadius: 5,
                        }}
                    >
                        <ThemedText lightColor="#fff" darkColor="#fff" style={{ lineHeight: 15, fontSize: 12 }}>
                            {messageNotRead}
                        </ThemedText>
                    </View>
                </View>
                <View style={{ flexBasis: '20%' }}></View>
            </View>
            <ThemedView
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                }}
            >
                <ThemedText style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Bold' }} lightColor="#000">
                    {textData.HEADER_TITLE}
                </ThemedText>
                <TouchableOpacity>
                    <ThemedText
                        style={{ fontSize: 16, lineHeight: 20, fontFamily: 'System-Bold' }}
                        lightColor="#999"
                        darkColor="#999"
                    >
                        {textData.MESSAGES_REQUESTS}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
            <MessageList
                handleSetChatBox={handleChangeChatBox}
                user={user}
                chatRoomState={chatRoomState}
                peers={peers}
            />
        </>
    );
};

export default MessageContainer;
