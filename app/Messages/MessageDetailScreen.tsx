import React from 'react';
import MessageChatBoxLayout from '@/components/layout/MessageLayout';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';
import MessageChatBox from '@/components/Messages/MessageChatBox';
function MessageDetailScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'message-detail'>>();
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'message-detail'>>();
    const handleExit = () => {
        navigation.goBack();
    };
    if (!routeParams) return null;
    return (
        <>
            <MessageChatBoxLayout preventStatusBar={true}>
                <MessageChatBox {...routeParams} handleExit={handleExit} />
            </MessageChatBoxLayout>
        </>
    );
}
export default MessageDetailScreen;
