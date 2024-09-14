import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import useLanguage from '@/languages/hooks/useLanguage';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MessageContainer from '@/components/Messages/MessageContainer';
import { NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';
import { MessageChatBoxProps } from '@/components/Messages/MessageChatBox';
import { View } from 'react-native';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks/hooks';
import { BLUE_MAIN_COLOR } from '@/constants/Colors';
import MessageChatBoxLayout from '@/components/layout/MessageLayout';
function MessagesScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'messages'>>();
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            HEADER_TITLE: lang.MESSAGES_TITLE,
            MESSAGES_REQUESTS: lang.MESSAGES_REQUEST,
        };
    }, []);
    const chatRoomState = useAppSelector((state) => state.chatRoom);
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'messages'>>();
    const [displayChatBox, setChatBox] = useState<MessageChatBoxProps | undefined>();
    const messageNotRead = useMemo(() => {
        return Object.keys(chatRoomState.rooms).filter((r) => !!chatRoomState.rooms[r]?.notRead === true).length;
    }, [chatRoomState]);
    useEffect(() => {
        setChatBox(routeParams);
    }, [routeParams]);

    const handleExit = () => {
        navigation.goBack();
    };
    return (
        <>
            <MessageChatBoxLayout preventStatusBar={true}>
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
                <MessageContainer chatBox={displayChatBox} />
            </MessageChatBoxLayout>
        </>
    );
}
export default MessagesScreen;
