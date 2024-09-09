import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DefaultLayout from '@/components/layout/DefaultLayout';
import useCustomScreenOptions from '@/hooks/useCustomScreenOptions';
import useLanguage from '@/languages/hooks/useLanguage';
import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native';
import MessageList from '@/components/Messages/MessageList';
function MessagesScreen() {
    const lang = useLanguage();
    const textData = useMemo(() => {
        return {
            HEADER_TITLE: lang.MESSAGES_TITLE,
            MESSAGES_REQUESTS: lang.MESSAGES_REQUEST,
        };
    }, []);
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
                <View>
                    <MessageList />
                </View>
            </DefaultLayout>
        </>
    );
}
export default MessagesScreen;
