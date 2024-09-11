import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import useLanguage from '@/languages/hooks/useLanguage';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MessageContainer from '@/components/Messages/MessageContainer';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';
import { MessageChatBoxProps } from '@/components/Messages/MessageChatBox';
function MessagesScreen() {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            HEADER_TITLE: lang.MESSAGES_TITLE,
            MESSAGES_REQUESTS: lang.MESSAGES_REQUEST,
        };
    }, []);
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'messages'>>();
    const [displayChatBox, setChatBox] = useState<MessageChatBoxProps | undefined>();
    useEffect(() => {
        setChatBox(routeParams);
    }, [routeParams]);
    useCustomScreenOptions({
        title: `${textData.HEADER_TITLE}`,
        headerTitleStyle: {
            fontSize: 18,
            fontFamily: 'System-Medium',
        },
    });
    return (
        <>
            <DefaultLayout preventStatusBar={false}>
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
            </DefaultLayout>
        </>
    );
}
export default MessagesScreen;
