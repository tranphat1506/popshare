import React, { useCallback, useEffect, useState } from 'react';
import useGlobalFonts from '@/hooks/useGlobalFonts';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Home/_layout';
import NotFoundPage from './+not-found';
import { RootStackParamList } from '@/configs/routes.config';
import 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store';
import BottomNavBar from '@/components/BottomNavBar';
import AuthLayout from '@/app/Auth/_layout';
import { useAppSelector } from '@/redux/hooks/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginSessionManager } from '@/storage/loginSession.storage';
import { login } from '@/redux/auth/reducer';
import * as Splash from 'expo-splash-screen';
import { FetchChatRoomCurrentUser, fetchMyData } from '@/helpers/fetching';
import { addPeers, Peers } from '@/redux/peers/reducer';
import useInitSocket from '@/hooks/socket.io/useInitSocket';
import { addRooms, sortTheRoomQueue } from '@/redux/chatRoom/reducer';
Splash.preventAutoHideAsync();
const Tab = createBottomTabNavigator<RootStackParamList>();
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
        [dispatch],
    );

    // Fetch session khi component mount và khi authState thay đổi
    useEffect(() => {
        loadApp(!!authState.isLogging);
    }, [authState.isLogging]); // Theo dõi authState.isLogging để fetch lại session khi logout
    // Hàm xử lý khi layout hoàn tất
    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await Splash.hideAsync();
        }
    }, [appIsReady]);
    // Nếu ứng dụng chưa sẵn sàng thì không render
    if (!appIsReady) return null;

    return (
        <GestureHandlerRootView onLayout={onLayoutRootView}>
            <NavigationContainer independent={true}>
                {authState.isLogging ? <MainComponent /> : <AuthLayout />}
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

const MainComponent = () => {
    const initSocket = useInitSocket();
    return (
        <Tab.Navigator initialRouteName="/" tabBar={(props) => <BottomNavBar {...props} />}>
            <Tab.Screen name="/" component={HomePage} options={{ headerShown: false }} />
            <Tab.Screen name="archive" component={NotFoundPage} />
        </Tab.Navigator>
    );
};
