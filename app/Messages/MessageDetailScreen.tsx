import React, { useEffect } from 'react';
import MessageChatBoxLayout from '@/components/layout/MessageLayout';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/configs/routes.config';
import MessageChatBox from '@/components/Messages/MessageChatBox';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { updateChatStateData } from '@/redux/chatRoom/reducer';
import { BackHandler } from 'react-native';
function MessageDetailScreen() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'message-detail'>>();
    const { params: routeParams } = useRoute<RouteProp<RootStackParamList, 'message-detail'>>();
    const handleExit = () => {
        navigation.goBack();
        return true;
    };
    useEffect(() => {
        // console.log('Set on chat room');
        // Set state user is on chatting
        dispatch(updateChatStateData({ field: 'isOnChatRoom', data: true }));
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleExit);
        return () => {
            dispatch(updateChatStateData({ field: 'isOnChatRoom', data: false }));
            backHandler.remove();
        };
    }, [dispatch]);
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
