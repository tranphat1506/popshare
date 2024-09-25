import React, { useCallback, useEffect, useState } from 'react';
import useGlobalFonts from '@/hooks/useGlobalFonts';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store';
import AuthLayout from '@/app/Auth/_layout';
import { useAppSelector } from '@/redux/hooks/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { login } from '@/redux/auth/reducer';
import * as Splash from 'expo-splash-screen';
import { FetchChatRoomCurrentUser, FetchChatRoomMessagesPerPage, fetchMyData } from '@/helpers/fetching';
import { addPeers, Peers } from '@/redux/peers/reducer';
import useInitSocket from '@/hooks/socket.io/useInitSocket';
import { addRooms, sortTheRoomQueue, updateTheNewestMessages } from '@/redux/chatRoom/reducer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotFound from '@/app/+not-found';
import HomeTabs from '@/app/Home/_layout';
import MessagesStackScreen from '@/app/Messages/_layout';
import UserDetailScreen from '@/app/User/UserDetailScreen';
import SearchScreen from './Search';

Splash.preventAutoHideAsync();
export default function Layout() {
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <AppComponent />
            </NativeBaseProvider>
        </Provider>
    );
}
const AppComponent = () => {
    const authState = useAppSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [appIsReady, setAppIsReady] = useState<boolean>(false);

    const handleFetchCurrentSession = useCallback(async () => {
        const session = await LoginSessionManager.getCurrentSession();
        if (session) {
            const userData = await fetchMyData({ token: session.token, rtoken: session.rtoken });
            const chatRoomData = await FetchChatRoomCurrentUser({ token: session.token, rtoken: session.rtoken });
            if (userData && chatRoomData) {
                const friends: Peers = {};
                userData.friends.friendList.forEach((userId) => {
                    friends[userId] = undefined;
                });
                dispatch(addRooms(chatRoomData.rooms));
                const addMessages = Promise.all(
                    chatRoomData.roomIdList.map(async (roomId) => {
                        const messages = await FetchChatRoomMessagesPerPage(
                            { token: session.token, rtoken: session.rtoken },
                            roomId,
                            0,
                        );
                        if (messages) {
                            dispatch(
                                updateTheNewestMessages({
                                    messages: messages.messages.reverse(),
                                    currentUserId: userData.user.userId ?? userData.user._id,
                                }),
                            );
                        }
                    }),
                );
                await addMessages;
                dispatch(sortTheRoomQueue());
                dispatch(addPeers(friends));
                dispatch(login(userData.user));
            }
        }
    }, [dispatch]);
    // Hàm để load session và fonts
    const loadApp = useCallback(
        async (login: boolean) => {
            try {
                await useGlobalFonts();
                if (!login) {
                    await handleFetchCurrentSession();
                }
            } catch (error) {
                console.warn(error);
            } finally {
                setAppIsReady(true);
            }
        },
        [dispatch, authState.user],
    );

    // Fetch session khi component mount và khi authState thay đổi
    useEffect(() => {
        loadApp(!!authState.user);
    }, [authState]); // Theo dõi authState.isLogging để fetch lại session khi logout
    // Hàm xử lý khi layout hoàn tất
    useEffect(() => {
        if (appIsReady) {
            Splash.hideAsync();
        }
    }, [appIsReady]);
    // Nếu ứng dụng chưa sẵn sàng thì không render
    if (!appIsReady) return null;

    return (
        <GestureHandlerRootView>
            <NavigationContainer independent={true}>
                {authState.user ? <MainComponent /> : <AuthLayout />}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};
const Stack = createNativeStackNavigator();

const MainComponent = () => {
    const initSocket = useInitSocket();
    return (
        <Stack.Navigator initialRouteName="/">
            <Stack.Screen name="/" component={HomeTabs} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name="messages" component={MessagesStackScreen} options={{ headerShown: false }} />
            <Stack.Screen name="user-detail" component={UserDetailScreen} />
            <Stack.Screen name="search" component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NotFound" component={NotFound} />
        </Stack.Navigator>
    );
};
